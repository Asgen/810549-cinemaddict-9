import {render, unrender, Position} from '../utils.js';
import {getWatchedGenres} from '../functions.js';
import {renderStatisticChart} from '../chart-options.js';
import Navigation from '../components/navigation.js';
import Films from '../components/films.js';
import ShowMoreBtn from '../components/show-more-button.js';
import Sort from '../components/sort.js';
import FilmsList from '../components/films-list.js';
import FilmsContainer from '../components/films-container.js';
import MovitListConrtroller from '../controllers/movie-list-controller.js';

import Statistic from '../components/statistic.js';
import StatisticInfo from '../components/statistic-info.js';
import StatisticFilters from '../components/statistic-filters.js';
import StatisticRank from '../components/statistic-rank.js';
import StatisticCanvas from '../components/statistic-canvas.js';

export default class PageController {
  constructor(container, user) {
    this._cardsArr = [];
    this._container = container;
    this._user = user;
    this._navigation = new Navigation(user);
    this._showMoreBtn = new ShowMoreBtn();
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._filmsListContainer = new FilmsContainer();
    this._sort = new Sort();
    this._unrenderedCards = 0;

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);

    this.init();
  }

  init() {

    render(this._container, this._navigation.getElement(), Position.BEFOREEND);
    render(this._container, this._sort.getElement(), Position.BEFOREEND);
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);

    this._sort.getElement().addEventListener(`click`, (e) => this._onSortClick(e));

    this._navigation.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      document.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);

      switch (evt.target.dataset.navType) {
        case (`all`):
          this.show(this._cardsArr);
          statistic.getElement().classList.add(`visually-hidden`);
          break;
        case (`watchlist`):
          this.show(this._cardsArr);
          statistic.getElement().classList.add(`visually-hidden`);
          break;
        case (`history`):
          this.show(this._cardsArr);
          statistic.getElement().classList.add(`visually-hidden`);
          break;
        case (`favorites`):
          this.show(this._cardsArr);
          statistic.getElement().classList.add(`visually-hidden`);
          break;
        case (`stats`):
          this.hide();
          this._navigation.getElement().classList.remove(`visually-hidden`);
          statistic.getElement().classList.remove(`visually-hidden`);
          break;
      }
    });

    const statistic = new Statistic();
    render(this._container, statistic.getElement(), Position.BEFOREEND);
    render(statistic.getElement(), new StatisticRank(this._user).getElement(), Position.BEFOREEND);
    render(statistic.getElement(), new StatisticFilters().getElement(), Position.BEFOREEND);
    render(statistic.getElement(), new StatisticInfo(this._user).getElement(), Position.BEFOREEND);
    render(statistic.getElement(), new StatisticCanvas().getElement(), Position.BEFOREEND);

    statistic.getElement().classList.add(`visually-hidden`);

    const daysCtx = document.querySelector(`.statistic__chart`);

    const allGeneres = getWatchedGenres(this._user.history);
    const labelsForChart = [...Object.keys(allGeneres)];
    const dataForChart = [...Object.values(allGeneres)];

    renderStatisticChart(daysCtx, labelsForChart, dataForChart);
  }

  show(movies) {

    this._setCards(movies);

    this._films.getElement().classList.remove(`visually-hidden`);
    this._sort.getElement().classList.remove(`visually-hidden`);
    this._navigation.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._films.getElement().classList.add(`visually-hidden`);
    this._sort.getElement().classList.add(`visually-hidden`);
    this._navigation.getElement().classList.add(`visually-hidden`);
  }

  _setCards(cardsArr) {
    this._cardsArr = cardsArr;

    const cardsList = this._cardsArr.slice();
    const body = document.querySelector(`body`);
    this._filmsListContainer.getElement().innerHTML = ``;
    const movitListConrtroller = new MovitListConrtroller(this._filmsListContainer.getElement(), this._onDataChange, this._onChangeView);

    if (this._cardsArr.length < 1) {
      body.innerText = `There are no movies in our database`;
    } else {
      movitListConrtroller.init(cardsList);
      this._unrenderedCards = cardsList;
    }
    this._showMoreBtn.getElement().addEventListener(`click`, () => {
      if (this._unrenderedCards.length > 0) {
        movitListConrtroller.init(this._unrenderedCards);
      }
      if (this._unrenderedCards.length < 1) {
        unrender(this._showMoreBtn.getElement());
      }
    });
  }

  _onSortClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    document.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
    this._filmsListContainer.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `date`:
        const sortByDate = this._cardsArr.slice().sort((a, b) => a.date - b.date);
        this._setCards(sortByDate);
        break;
      case `rating`:
        const sortByRating = this._cardsArr.slice().sort((a, b) => a.rate - b.rate);
        this._setCards(sortByRating);
        break;
      case `default`:
        const sortByDefault = this._cardsArr.slice().sort((a, b) => a.id - b.id);
        this._setCards(sortByDefault);
        break;
    }
  }

  _onDataChange(newData) {

    unrender(this._filmsListContainer.getElement());
    this._filmsListContainer.removeElement();

    render(this._filmsList. getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);
    this._setCards(newData);
    this._unrenderedCards = newData;
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
