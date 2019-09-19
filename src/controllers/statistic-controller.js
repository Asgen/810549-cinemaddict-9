import {render, Position} from '../utils.js';
import {renderStatisticChart} from '../chart-options.js';

import Statistic from '../components/statistic.js';
import StatisticInfo from '../components/statistic-info.js';
import StatisticFilters from '../components/statistic-filters.js';
import StatisticRank from '../components/statistic-rank.js';
import StatisticCanvas from '../components/statistic-canvas.js';

export default class StatisticController {
  constructor(container) {
    this._container = container;
    this._userData = {};

    this._statistic = new Statistic();
  }

  init() {
    render(this._container, this._statistic.getElement(), Position.BEFOREEND);
  }

  render(userData) {
    this._userData = userData;

    let rate = this._userData.watchedFilms;

    switch (true) {
      case (rate < 1):
        rate = ``;
        break;
      case (rate > 0 && rate < 11):
        rate = `Novice`;
        break;
      case (rate > 10 && rate < 21):
        rate = `Fan`;
        break;
      case (rate > 20):
        rate = `Movie Buff`;
        break;
    }

    this._statistic.getElement().innerHTML = ``;

    render(this._statistic.getElement(), new StatisticRank(rate).getElement(), Position.BEFOREEND);
    render(this._statistic.getElement(), new StatisticFilters().getElement(), Position.BEFOREEND);
    render(this._statistic.getElement(), new StatisticInfo(this._userData).getElement(), Position.BEFOREEND);
    render(this._statistic.getElement(), new StatisticCanvas().getElement(), Position.BEFOREEND);
    const daysCtx = document.querySelector(`.statistic__chart`);
    renderStatisticChart(daysCtx, [...Object.keys(this._userData.watchedGenres)], [...Object.values(this._userData.watchedGenres)]);
  }

  show() {
    this._statistic.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._statistic.getElement().classList.add(`visually-hidden`);

  }
}
