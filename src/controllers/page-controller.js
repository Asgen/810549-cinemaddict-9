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

    this._statisticController = new StatisticConrtoller(this._container);
    this._statisticController.hide();
  }

  update(movies) {
    this._userData.update(movies);
    this._updateNavigation();
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
    this._statisticController.hide();
  }

  _setCards(cardsArr) {
    if (!this._filteredMovies) {
      this._cardsArr = cardsArr;
    }

    const cardsList = this._filteredMovies ? this._filteredMovies : this._cardsArr.slice();

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
        const sortByRating = this._cardsArr.slice().sort((a, b) => a.total_rating - b.total_rating);
        this._setCards(sortByRating);
        break;
      case `default`:
        const sortByDefault = this._cardsArr.slice().sort((a, b) => a.id - b.id);
        this._setCards(sortByDefault);
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

    if (this._filteredMovies) {
      this._filteredMovies = newData;
    } else {
      this._cardsArr = newData;
    }

    const userRang = document.querySelector(`.profile__rating`);
    unrender(this._filmsListContainer.getElement());
    this._filmsListContainer.removeElement();

    render(this._filmsList. getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);
    this._setCards(newData);
    this._unrenderedCards = newData;

    this._userData.update(this._cardsArr);
    this._updateNavigation();
    userRang.innerHTML = this._userData.rank;
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
