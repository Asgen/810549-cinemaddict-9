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

const refreshProfile = (watchedFilms) => {
  profile.update(watchedFilms);

  unrender(profile.getElement());
  profile.removeElement();
  render(header, profile.getElement(), Position.BEFOREEND);
};

const onDatachenge = (showedMovies) => {
/*  refreshProfile(watchedFilms);
  pageController.update(movies, showedMovies);*/

  api.getMovies().then((movies) => {
    userData.update(movies);
    refreshProfile(userData.watchedFilms.length);
    pageController.update(movies, showedMovies);
  });
};

const userData = new UserData();
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const searchBar = new SearchBar();
render(header, searchBar.getElement(), Position.BEFOREEND);

const pageController = new PageController(main, onDatachenge, api);
const searchController = new SearchController(main, searchBar.getElement(), onDatachenge, api);
searchController.hide();

api.getMovies().then((movies) => {

  userData.update(movies);
  refreshProfile(userData.watchedFilms.length);
  pageController.update(movies);
  pageController.show(movies);
  searchController.setCards(movies);
});

const profile = new Profile(userData.watchedFilms.length);
render(header, profile.getElement(), Position.BEFOREEND);

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
