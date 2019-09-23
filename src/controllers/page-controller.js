import {render, unrender, Position} from '../utils.js';
import Navigation from '../components/navigation.js';
import Films from '../components/films.js';
import ShowMoreBtn from '../components/show-more-button.js';
import Sort from '../components/sort.js';
import FilmsList from '../components/films-list.js';
import FilmsContainer from '../components/films-container.js';
import MovitListConrtroller from '../controllers/movie-list-controller.js';
import StatisticConrtoller from '../controllers/statistic-controller.js';
import UserData from '../data/user-data.js';

const CARDS_IN_ROW = 5;

export default class PageController {
  constructor(container) {
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

    this._showedMovies = CARDS_IN_ROW;

    this._subscriptions = [];

    this._movitListConrtroller = new MovitListConrtroller(this._filmsListContainer.getElement(), this._onDataChange.bind(this));
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
    if (this._showedMovies < this._cardsArr.length) {
      render(this._filmsList.getElement(), this._showMoreBtn.getElement(), Position.BEFOREEND);
    }

    this._movitListConrtroller._setCards(this._cardsArr.slice(0, this._showedMovies));

    this._showMoreBtn.getElement()
      .addEventListener(`click`, () => this._onLoadMoreButtonClick());
  }

  _onLoadMoreButtonClick() {
    this._movitListConrtroller.addTasks(this._cardsArr.slice(this._showedMovies, this._showedMovies + CARDS_IN_ROW));

    this._showedMovies += CARDS_IN_ROW;

    if (this._showedMovies >= this._cardsArr.length) {
      unrender(this._showMoreBtn.getElement());
      this._showMoreBtn.removeElement();
    }
  }

  _setCards(cards) {
    this._cardsArr = cards;
    this._showedMovies = CARDS_IN_ROW;

    this._renderPage();
  }

  show(cards) {
    if (cards !== this._cardsArr) {
      this._setCards(cards);
    }

    this._films.getElement().classList.remove(`visually-hidden`);
    this._sort.getElement().classList.remove(`visually-hidden`);
    this._navigation.getElement().classList.remove(`visually-hidden`);
  }

  update(movies) {
    this._userData.update(movies);
    this._updateNavigation();
  }

  hide() {
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
      case `date`:
        const sortByDate = this._cardsArr.slice().sort((a, b) => a.date - b.date);
        this._movitListConrtroller.___setCards(sortByDate);
        break;
      case `rating`:
        const sortByRating = this._cardsArr.slice().sort((a, b) => a.total_rating - b.total_rating);
        this._movitListConrtroller.___setCards(sortByRating);
        break;
      case `default`:
        const sortByDefault = this._cardsArr.slice().sort((a, b) => a.id - b.id);
        this._movitListConrtroller.___setCards(sortByDefault);
        break;
    }
  }

  _onNavigationClick(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    this._navigation.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);

    switch (evt.target.dataset.navType) {
      case (`all`):
        this._filteredMovies = null;
        this.show(this._cardsArr);
        this._statisticController.hide();
        break;
      case (`watchlist`):
        this._filteredMovies = this._cardsArr.filter((it) => it.user_details.inWatchList === true);
        this.show(this._filteredMovies);
        this._statisticController.hide();
        break;
      case (`history`):
        this._filteredMovies = this._cardsArr.filter((it) => it.user_details.isWatched === true);
        this.show(this._cardsArr);
        this._statisticController.hide();
        break;
      case (`favorites`):
        this._filteredMovies = this._cardsArr.filter((it) => it.user_details.isFavorite === true);
        this.show(this._cardsArr);
        this._statisticController.hide();
        break;
      case (`stats`):
        this.hide();
        this._navigation.getElement().classList.remove(`visually-hidden`);
        this._statisticController.show(this._userData.watchedFilms);
        break;
    }

  }

  _updateNavigation() {
    const currentActiveLink = this._navigation.getElement().querySelector(`.main-navigation__item--active`);

    this._navigation.getElement().removeEventListener(`click`, (evt) => this._onNavigationClick(evt));
    unrender(this._navigation.getElement());
    this._navigation.removeElement();

    this._navigation.update(this._userData.countActivity());
    render(this._container, this._navigation.getElement(), Position.AFTERBEGIN);

    // Сохраняем выделенный пункт меню
    if (currentActiveLink.dataset.navType !== `all`) {
      this._navigation.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);

      this._navigation.getElement().querySelector(`[data-nav-type=${currentActiveLink.dataset.navType}]`).classList.add(`main-navigation__item--active`);
    }
    this._navigation.getElement().addEventListener(`click`, (evt) => this._onNavigationClick(evt));
  }

  _onDataChange(newData) {

    // Переписываем видимую часть тасков
    this._cardsArr = [...newData, ...this._cardsArr.slice(this._showedMovies)];

    this.___renderPage();
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
