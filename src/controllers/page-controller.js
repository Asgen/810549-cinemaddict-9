import UserData from '../data/user-data.js';
import {render, unrender, Position, SortBy, FilterBy} from '../utils.js';
import Navigation from '../components/navigation.js';
import Films from '../components/films.js';
import ShowMoreBtn from '../components/show-more-button.js';
import Sort from '../components/sort.js';
import FilmsList from '../components/films-list.js';
import FilmsContainer from '../components/films-container.js';

import MovitListConrtroller from '../controllers/movie-list-controller.js';
import StatisticConrtoller from '../controllers/statistic-controller.js';
import ExtraMoviesController from '../controllers/extra-movies-controller.js';

const CARDS_IN_ROW = 5;

export default class PageController {
  constructor(container, onDataChange, api) {
    this._api = api;
    this._onDataChangeMain = onDataChange;
    this._cardsArr = [];
    this._container = container;
    this._userData = new UserData();
    this._navigation = new Navigation();
    this._showMoreBtn = new ShowMoreBtn();
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._filmsListContainer = new FilmsContainer();
    this._sort = new Sort();
    this._unrenderedCards = 0;
    this._filteredMovies = null;
    this._sortMoviesBy = SortBy.DEFAULT;
    this._filterBy = FilterBy.ALL;
    this._isHidden = false;

    this._showedMovies = CARDS_IN_ROW;
    this._subscriptions = [];

    this._extraMoviesController = new ExtraMoviesController(this._films.getElement(), this._onExtraDataChange.bind(this), this._api);
    this._movitListConrtroller = new MovitListConrtroller(this._filmsListContainer.getElement(), this._onDataChange.bind(this), this._api);
    this._statisticController = new StatisticConrtoller(this._container);

    this._init();
  }

  _init() {
    render(this._container, this._navigation.getElement(), Position.BEFOREEND);
    render(this._container, this._sort.getElement(), Position.BEFOREEND);
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);

    this._sort.getElement().addEventListener(`click`, (e) => this._onSortClick(e));
    this._statisticController.hide();
  }

  _renderPage() {
    render(this._filmsList.getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);

    unrender(this._showMoreBtn.getElement());
    this._showMoreBtn.removeElement();

    let movies = this._filteredMovies ? this._filteredMovies : this._cardsArr;
    movies = this._sortMoviesList(movies, this._sortMoviesBy);

    if (this._showedMovies < movies.length) {
      render(this._filmsList.getElement(), this._showMoreBtn.getElement(), Position.BEFOREEND);
    }

    this._movitListConrtroller.setCards(movies.slice(0, this._showedMovies));
    this._extraMoviesController.render(this._cardsArr);

    this._showMoreBtn.getElement()
      .addEventListener(`click`, () => this._onLoadMoreButtonClick());
  }

  _onLoadMoreButtonClick() {
    let movies = this._filteredMovies ? this._filteredMovies : this._cardsArr;
    movies = this._sortMoviesList(movies, this._sortMoviesBy);

    this._movitListConrtroller.addTasks(movies.slice(this._showedMovies, this._showedMovies + CARDS_IN_ROW));

    this._showedMovies += CARDS_IN_ROW;

    if (this._showedMovies >= movies.length) {
      unrender(this._showMoreBtn.getElement());
      this._showMoreBtn.removeElement();
    }
  }

  _setCards(cards, showedMovies) {
    this._cardsArr = cards;

    if (this._filterBy) {
      this._filteredMovies = this._filterMovies(this._cardsArr, this._filterBy);
    }
    this._showedMovies = showedMovies ? showedMovies : CARDS_IN_ROW;
    this._renderPage();
  }

  show() {
    this._isHidden = false;
    this._films.getElement().classList.remove(`visually-hidden`);
    this._sort.getElement().classList.remove(`visually-hidden`);
    this._navigation.getElement().classList.remove(`visually-hidden`);
  }

  update(movies, showedMovies) {
    this._userData.update(movies);
    this._updateNavigation();
    this._setCards(movies, showedMovies);
  }

  hide() {
    this._isHidden = true;
    this._films.getElement().classList.add(`visually-hidden`);
    this._sort.getElement().classList.add(`visually-hidden`);
    this._navigation.getElement().classList.add(`visually-hidden`);
    this._statisticController.hide();
  }

  _onSortClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    document.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);

    switch (evt.target.dataset.sortType) {
      case SortBy.DATE:
        this._sortMoviesBy = SortBy.DATE;
        break;
      case `rating`:
        this._sortMoviesBy = SortBy.RATING;
        break;
      case `default`:
        this._sortMoviesBy = SortBy.DEFAULT;
        break;
    }

    this._setCards(this._filteredMovies ? this._filteredMovies : this._cardsArr);
  }

  _sortMoviesList(movies, mode) {
    let sortedArr = movies.slice();
    switch (mode) {
      case SortBy.DATE:
        sortedArr.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        break;
      case SortBy.RATING:
        sortedArr.sort((a, b) => b.totalRating - a.totalRating);
        break;
      case SortBy.DEFAULT:
        sortedArr.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
        break;
    }
    return sortedArr;
  }

  _onNavigationClick(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    this._navigation.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);

    switch (evt.target.dataset.navType) {
      case (`all`):
        this.show();
        this._filterBy = null;
        this._setCards(this._cardsArr.slice());
        this._statisticController.hide();
        break;
      case (`stats`):
        this.hide();
        this._navigation.getElement().classList.remove(`visually-hidden`);
        this._statisticController.show(this._userData.watchedFilms, this._userData.rank);
        break;
      default:
        this.show();
        this._filterBy = evt.target.dataset.navType;
        this._setCards(this._cardsArr.slice());
        this._statisticController.hide();
        break;
    }
  }

  _filterMovies(allMovies, filter) {
    let filteredArr = [];

    switch (filter) {
      case (FilterBy.WATCHLIST):
        filteredArr = allMovies.filter((it) => it.userDetails.inWatchList === true);
        break;
      case (FilterBy.HISTORY):
        filteredArr = allMovies.filter((it) => it.userDetails.isWatched === true);
        break;
      case (FilterBy.FAVORITES):
        filteredArr = allMovies.filter((it) => it.userDetails.isFavorite === true);
        break;
      case (FilterBy.ALL):
        filteredArr = null;
        break;
    }
    return filteredArr;
  }

  _updateNavigation() {
    const currentActiveLink = this._navigation.getElement().querySelector(`.main-navigation__item--active`);

    this._navigation.getElement().removeEventListener(`click`, (evt) => this._onNavigationClick(evt));
    unrender(this._navigation.getElement());
    this._navigation.removeElement();

    this._navigation.update(this._userData.countActivity());
    render(this._container, this._navigation.getElement(), Position.AFTERBEGIN);

    if (this._isHidden) {
      this._navigation.getElement().classList.add(`visually-hidden`);
    }

    // Сохраняем выделенный пункт меню
    if (currentActiveLink.dataset.navType !== `all`) {
      this._navigation.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);

      this._navigation.getElement().querySelector(`[data-nav-type=${currentActiveLink.dataset.navType}]`).classList.add(`main-navigation__item--active`);
    }
    this._navigation.getElement().addEventListener(`click`, (evt) => this._onNavigationClick(evt));
  }

  _onDataChange(newMovies, newCard) {

    this._api.getMovies().then((movies) => {
      this.update(movies, this._showedMovies);
    });
  }

  _onExtraDataChange() {
    this._onDataChangeMain(this._showedMovies);
  }
}
