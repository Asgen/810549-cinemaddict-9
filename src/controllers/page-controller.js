import {render, Position} from '../utils.js';

import Card from '../components/card.js';
import Detail from '../components/detail.js';
import ShowMoreBtn from '../components/show-more-button.js';

export default class PageController {
  constructor(cardsArr) {
    this._cardsArr = cardsArr;
    this._showMoreBtn = new ShowMoreBtn();
  }

  init() {

    const cardsList = this._cardsArr.slice();

    const body = document.querySelector(`body`);
    const main = document.querySelector(`.main`);
    const filmsList = main.querySelector(`.films-list`);
    const container = filmsList.querySelector(`.films-list__container`);

    const renderCard = (cardMock) => {

      const onCardClick = (card) => {

        const onEscKeyDown = (evt) => {
          if (evt.key === `Escape` || evt.key === `Esc`) {
            body.removeChild(detail.getElement());
          }
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

      const card = new Card(cardMock);

      card.getElement().querySelector(`.film-card__title`).addEventListener(`click`, () => onCardClick(cardMock));
      card.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, () => onCardClick(cardMock));
      card.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => onCardClick(cardMock));

      render(container, card.getElement(), Position.BEFOREEND);
    };

    const renderCards = (cardsArr) => {
      cardsArr.splice(0, 5).forEach((cardMock) => renderCard(cardMock));
    };

    if (this._cardsArr.length < 1) {
      body.innerText = `There are no movies in our database`;
    } else {
      renderCards(cardsList);
    }

    if (cardsList.length > 5) {
      render(filmsList, this._showMoreBtn.getElement(), Position.BEFOREEND);
    }

    const loadMore = filmsList.querySelector(`.films-list__show-more`);
    if (loadMore) {
      loadMore.addEventListener(`click`, () => {
        if (cardsList.length > 0) {
          renderCards(cardsList);
        }
        if (cardsList.length < 1) {
          loadMore.style.display = `none`;
        }
      });
    }
  }
}
