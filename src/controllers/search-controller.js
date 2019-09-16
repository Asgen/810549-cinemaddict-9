import {render, unrender, Position} from '../utils.js';

import Search from '../components/search.js';
import ShowMoreBtn from '../components/show-more-button.js';
import Films from '../components/films.js';
import FilmsList from '../components/films-list.js';
import FilmsContainer from '../components/films-container.js';
import MovitListConrtroller from '../controllers/movie-list-controller.js';


export default class SearchController {
  constructor(container, movies) {
    this._cardsArr = movies;
    this._container = container;
    this._querry = ``;
    //this._searchResult = new Search();
    this._showMoreBtn = new ShowMoreBtn();
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._filmsListContainer = new FilmsContainer();
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
  }

  show(querry) {

    this._querry = querry;

    const searchArr = this._cardsArr.slice().filter((it) => it.description.includes(`Lorem`));
    //console.log(searchResult);

    render(this._container, new Search(searchArr.length).getElement(), Position.AFTERBEGIN);

    if (searchArr !== this._cardsArr) {
      this._setCards(searchArr);
    }

    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  _setCards(cardsArr) {
    this._cardsArr = cardsArr;

    const cardsList = this._cardsArr.slice();
    const body = document.querySelector(`body`);
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

  _onDataChange(newData) {

    unrender(this._filmsListContainer.getElement());
    this._filmsListContainer.removeElement();

    render(this._filmsList. getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);
    //const cardsList = this._cardsArr.slice();
    this._setCards(newData);
    this._unrenderedCards = newData;
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
