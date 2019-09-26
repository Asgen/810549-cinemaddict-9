import {render, unrender, Position, SortBy} from '../utils.js';
import Navigation from '../components/navigation.js';
import Films from '../components/films.js';
import ShowMoreBtn from '../components/show-more-button.js';
import Sort from '../components/sort.js';
import FilmsList from '../components/films-list.js';
import FilmsListExtra from '../components/films-list-extra.js';
import FilmsListExtraTitle from '../components/films-list-extra-title.js';
import FilmsContainer from '../components/films-container.js';
import MovitListConrtroller from '../controllers/movie-list-controller.js';
import StatisticConrtoller from '../controllers/statistic-controller.js';
import UserData from '../data/user-data.js';

const CARDS_IN_ROW = 5;

export default class PageController {
  constructor(container, onDataChange) {
    this._onDataChangeMain = onDataChange;
    this._cardsArr = [];
    this._container = container;
    this._userData = new UserData();
    this._navigation = new Navigation();
    this._showMoreBtn = new ShowMoreBtn();
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._filmsListExtra = new FilmsListExtra();
    this._filmsListExtraTitle = new FilmsListExtraTitle();
    this._filmsListContainer = new FilmsContainer();
    this._sort = new Sort();
    this._unrenderedCards = 0;
    this._filteredMovies = null;
    this._sortMoviesBy = SortBy.DEFAULT;

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

    let movies = [];
    if (this._filteredMovies) {
      movies = this._filteredMovies;
    } else {
      movies = this._cardsArr;
    }

    if (this._showedMovies < movies.length) {
      render(this._filmsList.getElement(), this._showMoreBtn.getElement(), Position.BEFOREEND);
    }

    this._movitListConrtroller.setCards(movies.slice(0, this._showedMovies));

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
    cards = this._sortMoviesList(cards, this._sortMoviesBy);

    if (this._filteredMovies) {
      this._filteredMovies = cards;
    } else {
      this._cardsArr = cards;
    }

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
    this._renderExtraBlocks(this._cardsArr);
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
        sortedArr.sort((a, b) => b.date - a.date);
        break;
      case SortBy.RATING:
        sortedArr.sort((a, b) => b.total_rating - a.total_rating);
        break;
      case SortBy.DEFAULT:
        sortedArr.sort((a, b) => a.id - b.id);
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
        this._filteredMovies = null;
        this.show(this._cardsArr.slice());
        this._statisticController.hide();
        break;
      case (`watchlist`):
        this._filteredMovies = this._cardsArr.filter((it) => it.user_details.inWatchList === true);
        this.show(this._filteredMovies);
        this._statisticController.hide();
        break;
      case (`history`):
        this._filteredMovies = this._cardsArr.filter((it) => it.user_details.isWatched === true);
        this.show(this._filteredMovies);
        this._statisticController.hide();
        break;
      case (`favorites`):
        this._filteredMovies = this._cardsArr.filter((it) => it.user_details.isFavorite === true);
        this.show(this._filteredMovies);
        this._statisticController.hide();
        break;
      case (`stats`):
        this.hide();
        this._navigation.getElement().classList.remove(`visually-hidden`);
        this._statisticController.show(this._userData.watchedFilms,this._userData.rank);
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

  _renderExtraBlocks(allMovies) {
    const topRatedMovies = this._sortMoviesList(allMovies, SortBy.RATING).slice(0, 2);
    if (topRatedMovies[0].total_rating === 0) {
      return;
    }
    const mostCommented = allMovies.slice().sort((a, b) => a.comments.length - b.comments.length).slice(0, 2);

    const filmsContainer = new FilmsContainer();
    render(this._films.getElement(), this._filmsListExtra.getElement(), Position.BEFOREEND);
     render(this._films.getElement(), this._filmsListExtra.getElement(), Position.BEFOREEND);
    render(this._filmsListExtra.getElement(), this._filmsListExtraTitle.getElement(), Position.AFTERBEGIN);
    render(this._filmsListExtra.getElement(), filmsContainer.getElement(), Position.BEFOREEND);


    const movitListConrtrollerX = new MovitListConrtroller(filmsContainer.getElement(), this._onDataChange.bind(this));
    movitListConrtrollerX.setCards(topRatedMovies);

  }

  _onDataChange(newData) {

    // Переписываем видимую часть тасков
    if (this._filteredMovies) {
      this._filteredMovies = [...newData, ...this._filteredMovies.slice(this._showedMovies)];
    } else {
      this._cardsArr = [...newData, ...this._cardsArr.slice(this._showedMovies)];
    }

    this.update(this._cardsArr);
    this._renderPage();
    this._onDataChangeMain(this._userData.watchedFilms.length);
    //this._renderExtraBlocks(this._cardsArr);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
