import {render, unrender, Position} from '../utils.js';

import Search from '../components/search.js';
import SearchNoResult from '../components/search-no-result.js';
import ShowMoreBtn from '../components/show-more-button.js';
import Films from '../components/films.js';
import FilmsList from '../components/films-list.js';
import FilmsContainer from '../components/films-container.js';
import MovitListConrtroller from '../controllers/movie-list-controller.js';

const CARDS_IN_ROW = 5;

export default class SearchController {
  constructor(container, input, onDataChange, api) {
    this._api = api;
    this._movies = [];
    this._foundMovies = [];
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

    this._onDataChangeMain = onDataChange;
    this._showedMovies = CARDS_IN_ROW;
    this._subscriptions = [];
    this._movitListConrtroller = new MovitListConrtroller(this._filmsListContainer.getElement(), this._onDataChange.bind(this), this._api);

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
      this.show(evt.target.value);
    });
  }

  setCards(cards) {
    this._movies = cards;
  }

  show(querry) {
    this._showedMovies = CARDS_IN_ROW;
    this._querry = querry.replace(/[^а-яёa-z0-9\s\.]/gmi, ``);
    let re = new RegExp(this._querry, `gim`);

    this._foundMovies = this._movies.filter((it) => it.title.match(re) !== null);

    if (this._container.contains(this._searchResult.getElement())) {
      unrender(this._searchResult.getElement());
    }
    this._searchResult.setCount(this._foundMovies.length);
    render(this._container, this._searchResult.getElement(), Position.AFTERBEGIN);

    this._filmsListContainer.getElement().innerHTML = ``;
    this._setCards(this._foundMovies);

    this._films.getElement().classList.remove(`visually-hidden`);
    this._searchResult.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._films.getElement().classList.add(`visually-hidden`);
    this._searchResult.getElement().classList.add(`visually-hidden`);
  }

  _setCards(cards) {
    const cardsList = cards.slice();

    unrender(this._showMoreBtn.getElement());
    this._showMoreBtn.removeElement();

    if (this._showedMovies < cardsList.length) {
      render(this._filmsList.getElement(), this._showMoreBtn.getElement(), Position.BEFOREEND);
    }

    this._movitListConrtroller.setCards(cardsList.slice(0, this._showedMovies));

    this._showMoreBtn.getElement()
      .addEventListener(`click`, () => {

        this._movitListConrtroller.addTasks(cardsList.slice(this._showedMovies, this._showedMovies + CARDS_IN_ROW));

        this._showedMovies += CARDS_IN_ROW;

        if (this._showedMovies >= cardsList.length) {
          unrender(this._showMoreBtn.getElement());
          this._showMoreBtn.removeElement();
        }
      });
  }

  _onDataChange(newMoviesList, changedMovie) {

    if (newMoviesList && changedMovie) {
      this._api.updateMovie(changedMovie.id, changedMovie.toRAW());
      this._setCards(newMoviesList);
      this._unrenderedCards = newMoviesList;
    }

    this._onDataChangeMain();

  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
