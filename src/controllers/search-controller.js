import {render, unrender, Position} from '../utils.js';

import ShowMoreBtn from '../components/show-more-button.js';
import SearchResult from '../components/search.js';
import FilmsList from '../components/films-list.js';
import FilmsContainer from '../components/films-container.js';
import MovieController from '../controllers/movie-controller.js';


export default class SearchController {
  constructor(cardsArr, container) {
    this._cardsArr = cardsArr;
    this._container = container;
    this._showMoreBtn = new ShowMoreBtn();
    this._filmsList = new FilmsList();
    this._filmsListContainer = new FilmsContainer();
    this._search = new SearchResult(115);
    this._unrenderedCards = 0;

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  init() {
    const cardsList = this._cardsArr.slice().filter((it) => it.description.includes(this._querry));

    const body = document.querySelector(`body`);
    const main = document.querySelector(`.main`);
    render(main, this._search.getElement(), Position.BEFOREEND);
    render(main, this._container, Position.BEFOREEND);
    render(this._container, this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);

    this._search.getElement().addEventListener(`click`, (e) => this._onSortClick(e));

    if (this._cardsArr.length < 1) {
      body.innerText = `There are no movies in our database`;
    } else {
      this._renderCards(cardsList);
      this._unrenderedCards = cardsList;
    }
    this._showMoreBtn.getElement().addEventListener(`click`, () => {
      if (this._unrenderedCards.length > 0) {
        this._renderCards(this._unrenderedCards);
      }
      if (this._unrenderedCards.length < 1) {
        unrender(this._showMoreBtn.getElement());
      }
    });
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  _renderCards(cardsArr) {
    cardsArr.splice(0, 5).forEach((cardMock) => {
      const movieController = new MovieController(this._filmsListContainer, cardMock, this._onDataChange, this._onChangeView);
      this._subscriptions.push(movieController.setDefaultView.bind(movieController));
    });
    this._unrenderedCards = cardsArr;

    if (cardsArr.length > 0) {
      render(this._filmsList.getElement(), this._showMoreBtn.getElement(), Position.BEFOREEND);
    }
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
        this._renderCards(sortByDate);
        break;
      case `rating`:
        const sortByRating = this._cardsArr.slice().sort((a, b) => a.rate - b.rate);
        this._renderCards(sortByRating);
        break;
      case `default`:
        const sortByDefault = this._cardsArr.slice();
        this._renderCards(sortByDefault);
        break;
    }
  }

  _onDataChange(oldData, newData) {
    const thisCard = this._cardsArr[this._cardsArr.findIndex((it) => it === oldData)];


    if (newData === null) {
      // console.log(`comments modified`);
    } else {

      switch (newData) {

        case (`watchlist`):
          thisCard.inWatchList = thisCard.inWatchList !== true ? true : false;
          break;
        case (`watched`):
          thisCard.isWatched = thisCard.isWatched !== true ? true : false;
          break;
        case (`favorite`):
          thisCard.isFavorite = thisCard.isFavorite !== true ? true : false;
          break;
      }
    }

    unrender(this._filmsListContainer.getElement());
    this._filmsListContainer.removeElement();

    render(this._filmsList. getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);
    const cardsList = this._cardsArr.slice();
    this._renderCards(cardsList);
    this._unrenderedCards = cardsList;
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
