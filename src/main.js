import {cardsList as cards, userInfo} from '../src/data.js';
import {render, Position} from '../src/utils.js';
import SearchBar from '../src/components/search-bar.js';
import Profile from '../src/components/profile.js';
import PageController from '../src/controllers/page-controller.js';
import SearchController from '../src/controllers/search-controller.js';

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const searchBar = new SearchBar();

render(header, searchBar.getElement(), Position.BEFOREEND);
render(header, new Profile(userInfo).getElement(), Position.BEFOREEND);

const pageController = new PageController(main, userInfo);
const searchController = new SearchController(main, searchBar.getElement());
searchController.hide();
pageController.show(cards);

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
