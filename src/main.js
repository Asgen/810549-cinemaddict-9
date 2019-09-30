import {cardsList as cards} from '../src/data.js';
import {render, unrender, Position} from '../src/utils.js';
import SearchBar from '../src/components/search-bar.js';
import Profile from '../src/components/profile.js';
import PageController from '../src/controllers/page-controller.js';
import SearchController from '../src/controllers/search-controller.js';
import UserData from '../src/data/user-data.js';

import API from '../src/api.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;




const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});


api.getMovies()
  .then((movies) => console.log(movies));

/*api.getMovies()
  .then((movies) => movies.reduce((prev, curr) => {
    return [...prev, api.getComments(curr.id)];
  }, [])
  .then((comments) => console.log(comments)));
*/

/*let commentsAll = [];

api.getMovies()
  .then((movies) => movies.map((movie) => api.getComments(movie.id)
  .then((comments) => commentsAll.push(...comments))));

  console.log(commentsAll);

*/

const onDatachenge = (watchedFilms) => {
  profile.update(watchedFilms);

  unrender(profile.getElement());
  profile.removeElement();
  render(header, profile.getElement(), Position.BEFOREEND);
};

const userData = new UserData();
userData.update(cards);

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const searchBar = new SearchBar();
render(header, searchBar.getElement(), Position.BEFOREEND);

const pageController = new PageController(main, onDatachenge, AUTHORIZATION);
const searchController = new SearchController(main, searchBar.getElement());
searchController.hide();
pageController.update(cards);
//pageController.show(cards);
api.getMovies().then((movies) => pageController.show(movies));

const profile = new Profile(userData.watchedFilms.length);
render(header, profile.getElement(), Position.BEFOREEND);

searchBar.getElement().querySelector(`.search__reset`)
  .addEventListener(`click`, () => {
    pageController.show(cards);
    searchController.hide();
  });

searchBar.getElement().addEventListener(`keyup`, (evt) => {
  if (evt.target.value.length < 3) {
    pageController.show(cards);
    searchController.hide();
  } else {
    pageController.hide();
    searchController.show(evt.target.value, cards);
  }
});
