import {cardsList as cards, user} from '../src/data.js';
import {render, Position} from '../src/utils.js';

import Search from '../src/components/search.js';
import Profile from '../src/components/profile.js';
import Navigation from '../src/components/navigation.js';
import Films from '../src/components/films.js';

import Statistic from '../src/components/statistic.js';
import StatisticInfo from '../src/components/statistic-info.js';
import StatisticFilters from '../src/components/statistic-filters.js';
import StatisticRank from '../src/components/statistic-rank.js';
import StatisticCanvas from '../src/components/statistic-canvas.js';

import PageController from '../src/controllers/page-controller.js';

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const filmsContainer = new Films();
const navigation = new Navigation(user);
render(header, new Search().getElement(), Position.BEFOREEND);
render(header, new Profile(user).getElement(), Position.BEFOREEND);
render(main, navigation.getElement(), Position.BEFOREEND);

const statistic = new Statistic();
render(main, statistic.getElement(), Position.BEFOREEND);
render(statistic.getElement(), new StatisticRank(user).getElement(), Position.BEFOREEND);
render(statistic.getElement(), new StatisticFilters().getElement(), Position.BEFOREEND);
render(statistic.getElement(), new StatisticInfo(user).getElement(), Position.BEFOREEND);
render(statistic.getElement(), new StatisticCanvas().getElement(), Position.BEFOREEND);

const pageController = new PageController(cards, filmsContainer.getElement());
pageController.init();

statistic.getElement().classList.add(`visually-hidden`);

navigation.getElement().addEventListener(`click`, (evt) => {
  if (evt.target.tagName !== `A`) {
    return;
  }

  document.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
  evt.target.classList.add(`main-navigation__item--active`);

  switch (evt.target.dataset.navType) {
    case (`all`):
      pageController.show();
      statistic.getElement().classList.add(`visually-hidden`);
      break;
    case (`watchlist`):
      pageController.show();
      statistic.getElement().classList.add(`visually-hidden`);
      break;
    case (`history`):
      pageController.show();
      statistic.getElement().classList.add(`visually-hidden`);
      break;
    case (`favorites`):
      pageController.show();
      statistic.getElement().classList.add(`visually-hidden`);
      break;
    case (`stats`):
      pageController.hide();
      statistic.getElement().classList.remove(`visually-hidden`);
      break;
  }
});


