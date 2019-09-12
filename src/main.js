import {cardsList as cards, user} from '../src/data.js';
import {render, Position} from '../src/utils.js';

import Search from '../src/components/search.js';
import Profile from '../src/components/profile.js';
import Navigation from '../src/components/navigation.js';

import Statistic from '../src/components/statistic.js';
import StatisticInfo from '../src/components/statistic-info.js';
import StatisticFilters from '../src/components/statistic-filters.js';
import StatisticRank from '../src/components/statistic-rank.js';
import StatisticCanvas from '../src/components/statistic-canvas.js';

import PageController from '../src/controllers/page-controller.js';

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
render(header, new Search().getElement(), Position.BEFOREEND);
render(header, new Profile(user).getElement(), Position.BEFOREEND);
render(main, new Navigation(user).getElement(), Position.BEFOREEND);

let xxx = 0;
//const watchedFilms = cards.filter((card) => card.isWatched);

/*watchedFilms.forEach((card) => {
  xxx += card.duration;
});*/

const yyy = cards.forEach((card) => {
  if (card.isWatched) {
    xxx += card.duration;
  }
});
console.log(xxx);


const statistic = new Statistic();
render(main, statistic.getElement(), Position.BEFOREEND);
render(statistic, new StatisticInfo(user).getElement(), Position.BEFOREEND);
render(statistic, new StatisticFilters().getElement(), Position.BEFOREEND);
render(statistic, new StatisticRank().getElement(), Position.BEFOREEND);
render(statistic, new StatisticCanvas().getElement(), Position.BEFOREEND);

const pageController = new PageController(cards, user);
pageController.init();
