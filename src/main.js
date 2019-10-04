import {render, unrender, Position} from '../src/utils.js';
import SearchBar from '../src/components/search-bar.js';
import Profile from '../src/components/profile.js';
import PageController from '../src/controllers/page-controller.js';
import SearchController from '../src/controllers/search-controller.js';
import UserData from '../src/data/user-data.js';
import API from '../src/api.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const searchBar = new SearchBar();
const userData = new UserData();
const profile = new Profile(userData.watchedFilms.length);

const refreshProfile = (watchedFilms) => {
  profile.update(watchedFilms);
  unrender(profile.getElement());
  profile.removeElement();

  render(header, profile.getElement(), Position.BEFOREEND);
};

const onDataChange = (showedMovies) => {
  api.getMovies().then((movies) => {
    userData.update(movies);
    refreshProfile(userData.watchedFilms.length);
    pageController.update(movies, showedMovies);
  });
};

const pageController = new PageController(main, onDataChange, api);
const searchController = new SearchController(main, searchBar.getElement(), onDataChange, api);
render(header, searchBar.getElement(), Position.BEFOREEND);
render(header, profile.getElement(), Position.BEFOREEND);
searchController.hide();

api.getMovies().then((movies) => {
  userData.update(movies);
  refreshProfile(userData.watchedFilms.length);
  pageController.update(movies);
  pageController.show(movies);
  searchController.setCards(movies);
});

searchBar.getElement().querySelector(`.search__reset`)
  .addEventListener(`click`, () => {
    pageController.show();
    searchController.hide();
  });

searchBar.getElement().addEventListener(`keyup`, (evt) => {
  if (evt.target.value.length < 3) {
    pageController.show();
    searchController.hide();
  } else {
    pageController.hide();
    searchController.show(evt.target.value);
  }
});
