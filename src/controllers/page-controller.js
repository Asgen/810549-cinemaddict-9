import {render, unrender, Position} from '../utils.js';

import Card from '../components/card.js';
import Detail from '../components/detail.js';
import ShowMoreBtn from '../components/show-more-button.js';
import Sort from '../components/sort.js';
import FilmsContainer from '../components/films-container.js';


export default class PageController {
  constructor(cardsArr) {
    this._cardsArr = cardsArr;
    this._showMoreBtn = new ShowMoreBtn();
    this._container = new FilmsContainer();
    this._sort = new Sort();
    this._unrenderedCards = 0;
  }

  init() {
    const cardsList = this._cardsArr.slice();

    const body = document.querySelector(`body`);
    const main = document.querySelector(`.main`);
    render(main, this._sort.getElement(), Position.BEFOREEND);
    render(main, this._container.getElement(), Position.BEFOREEND);

    this._sort.getElement().addEventListener(`click`, (e) => this._onSortClick(e));

    if (this._cardsArr.length < 1) {
      body.innerText = `There are no movies in our database`;
    } else {
      this._renderCards(cardsList);
    }

    if (cardsList.length > 0) {
      this._renderLoadMoreBtn(this._unrenderedCards);
    }

    this._unrenderedCards = cardsList;

    this._showMoreBtn.getElement().addEventListener(`click`, () => {
      if (this._unrenderedCards.length > 0) {
        this._renderCards(this._unrenderedCards);
      }
      if (this._unrenderedCards.length < 1) {
        unrender(this._showMoreBtn);
      }
    });
  }

  _renderCards(cardsArr) {
    const renderCard = (data) => {
      const body = document.querySelector(`body`);
      const container = document.querySelector(`.films-list__container`);
      const onCardClick = (card) => {

        const onEscKeyDown = (evt) => {
          if (evt.key === `Escape` || evt.key === `Esc`) {
            body.removeChild(detail.getElement());
          }
          document.removeEventListener(`keydown`, onEscKeyDown);
        };

        const detail = new Detail(card);

        detail.getElement()
          .querySelector(`.film-details__close-btn`)
          .addEventListener(`click`, () => {
            body.removeChild(detail.getElement());
          });

        detail.getElement()
          .querySelector(`textarea`)
          .addEventListener(`focus`, () => {
            document.removeEventListener(`keydown`, onEscKeyDown);
          });

        document.addEventListener(`keydown`, onEscKeyDown);

        render(body, detail.getElement(), Position.BEFOREEND);
      };

      const card = new Card(data);

      card.getElement().querySelector(`.film-card__title`).addEventListener(`click`, () => onCardClick(data));
      card.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, () => onCardClick(data));
      card.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => onCardClick(data));

      render(container, card.getElement(), Position.BEFOREEND);
    };

    cardsArr.splice(0, 5).forEach((cardMock) => renderCard(cardMock));
  }

  _renderLoadMoreBtn(cardsList) {
    const filmsList = document.querySelector(`.films-list`);
    if (cardsList.length > 0) {
      render(filmsList, this._showMoreBtn.getElement(), Position.BEFOREEND);
    }
  }

  _onSortClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    const container = document.querySelector(`.films-list__container`);
    document.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
    container.innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `date`:
        const sortByDate = this._cardsArr.slice().sort((a, b) => a.date - b.date);
        this._renderCards(sortByDate);
        this._unrenderedCards = sortByDate;
        this._renderLoadMoreBtn(sortByDate);
        break;
      case `rating`:
        const sortByRating = this._cardsArr.slice().sort((a, b) => a.rate - b.rate);
        this._renderCards(sortByRating);
        this._unrenderedCards = sortByRating;
        this._renderLoadMoreBtn(sortByRating);
        break;
      case `default`:
        const sortByDefault = this._cardsArr.slice();
        this._renderCards(sortByDefault);
        this._unrenderedCards = sortByDefault;
        this._renderLoadMoreBtn(sortByDefault);
        break;
    }

  }
}
