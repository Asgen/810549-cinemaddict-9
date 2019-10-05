import {render, unrender, Position} from '../utils.js';
import {renderStatisticChart} from '../chart-options.js';
import moment from 'moment';

import Statistic from '../components/statistic.js';
import StatisticInfo from '../components/statistic-info.js';
import StatisticFilters from '../components/statistic-filters.js';
import StatisticRank from '../components/statistic-rank.js';
import StatisticCanvas from '../components/statistic-canvas.js';

import UserData from '../data/user-data.js';

export default class StatisticController {
  constructor(container) {
    this._container = container;
    this._rank = ``;
    this._cards = [];
    this._userData = new UserData();

    this._statistic = new Statistic();
    this._statisticFilters = new StatisticFilters();
    this._chart = null;
    this.init();
  }

  init() {
    render(this._container, this._statistic.getElement(), Position.BEFOREEND);
    render(this._statistic.getElement(), this._statisticFilters.getElement(), Position.BEFOREEND);
    this._statisticFilters.getElement().addEventListener(`change`, (evt) => this._onFilterChange(evt));
  }

  _render() {
    unrender(this._statistic.getElement().querySelector(`.statistic__rank`));
    unrender(this._statistic.getElement().querySelector(`.statistic__text-list`));
    unrender(this._statistic.getElement().querySelector(`.statistic__chart-wrap`));

    render(this._statistic.getElement(), new StatisticRank(this._rank).getElement(), Position.AFTERBEGIN);
    render(this._statistic.getElement(), new StatisticInfo(this._userData.countActivity()).getElement(), Position.BEFOREEND);
    render(this._statistic.getElement(), new StatisticCanvas().getElement(), Position.BEFOREEND);
    const daysCtx = document.querySelector(`.statistic__chart`);
    if (this._chart) {
      this._chart.destroy();
    }
    this._chart = renderStatisticChart(daysCtx, [...Object.keys(this._userData.getWatchedGenres())], [...Object.values(this._userData.getWatchedGenres())]);
  }

  _onFilterChange(evt) {

    switch (evt.target.value) {
      case `today`:
        const filterToday = this._cards.filter((card) => moment().isSame(card.userDetails.watchingDate, `day`));
        this._userData.update(filterToday);
        this._render();
        break;
      case `week`:
        const filterWeek = this._cards.filter((card) => moment().isSame(card.userDetails.watchingDate, `week`));
        this._userData.update(filterWeek);
        this._render();
        break;
      case `month`:
        const filterMonth = this._cards.filter((card) => moment().isSame(card.userDetails.watchingDate, `month`));
        this._userData.update(filterMonth);
        this._render();
        break;
      case `year`:
        const filterYear = this._cards.filter((card) => moment().isSame(card.userDetails.watchingDate, `year`));
        this._userData.update(filterYear);
        this._render();
        break;
      case `all-time`:
        this._userData.update(this._cards);
        this._render();
        break;
    }
  }

  show(cards, rank) {
    this._cards = cards;
    this._rank = rank;
    this._userData.update(cards);
    this._render();
    this._statistic.getElement().classList.remove(`visually-hidden`);
    this._statisticFilters.getElement().querySelector(`#statistic-all-time`).checked = true;
  }

  hide() {
    this._statistic.getElement().classList.add(`visually-hidden`);

  }
}
