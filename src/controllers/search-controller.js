import {render, unrender, Position} from '../utils.js';

import Search from '../components/search.js';
import SearchNoResult from '../components/search-no-result.js';
import ShowMoreBtn from '../components/show-more-button.js';
import Films from '../components/films.js';
import FilmsList from '../components/films-list.js';
import FilmsContainer from '../components/films-container.js';
import MovitListConrtroller from '../controllers/movie-list-controller.js';


export default class SearchController {
  constructor(container, input) {
    this._cardsArr = [];
    this._container = container;
    this._input = input;
    this._querry = ``;
    this._searchResult = new Search(0);
    this._showMoreBtn = new ShowMoreBtn();
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._filmsListContainer = new FilmsContainer();
    this._noResult = new SearchNoResult();
    this._unrenderedCards = 0;

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);

    this.init();
  }

  init() {
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);

    this._input.addEventListener(`keyup`, (evt) => {
      if (evt.target.value.length < 3) {
        return;
      }
      this.show(evt.target.value, this._cardsArr);
    });
  }

  show(querry, cards) {

    this._cardsArr = cards;
    this._querry = querry.replace(/[^а-яёa-z0-9\s\.]/gmi, ` `);
    let re = new RegExp(this._querry, `gim`);

    const searchArr = this._cardsArr.filter((it) => it.title.match(re) !== null);

    if (this._container.contains(this._searchResult.getElement())) {
      unrender(this._searchResult.getElement());
    }
    this._searchResult.setCount(searchArr.length);
    render(this._container, this._searchResult.getElement(), Position.AFTERBEGIN);

    this._filmsListContainer.getElement().innerHTML = ``;
    this._setCards(searchArr);

    this._films.getElement().classList.remove(`visually-hidden`);
    this._searchResult.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._films.getElement().classList.add(`visually-hidden`);
    this._searchResult.getElement().classList.add(`visually-hidden`);

  }

  _setCards(cards) {

    const cardsList = cards.slice();
    const movitListConrtroller = new MovitListConrtroller(this._filmsListContainer.getElement(), this._onDataChange, this._onChangeView);

    if (cardsList.length < 1) {
      render(this._filmsList.getElement(), this._noResult.getElement(), Position.AFTERBEGIN);
    } else {
      if (this._filmsList.getElement().contains(this._noResult.getElement())) {
        unrender(this._noResult.getElement());
      }
      movitListConrtroller.setCards(cardsList);
      this._unrenderedCards = cardsList;
    }
    this._showMoreBtn.getElement().addEventListener(`click`, () => {
      if (this._unrenderedCards.length > 0) {
        movitListConrtroller.setCards(this._unrenderedCards);
      }
      if (this._unrenderedCards.length < 1) {
        unrender(this._showMoreBtn.getElement());
      }
    });
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
