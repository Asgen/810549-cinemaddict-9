import {cardsList as cards, user} from '../src/data.js';
import {render, Position} from '../src/utils.js';

import Search from '../src/components/search.js';
import Profile from '../src/components/profile.js';
import Navigation from '../src/components/navigation.js';
import Sort from '../src/components/sort.js';
import FilmsContainer from '../src/components/films-container.js';
import Card from '../src/components/card.js';
import ShowMoreBtn from '../src/components/show-more-button.js';
import Detail from '../src/components/detail.js';

const cardsList = cards.slice();

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

const body = document.querySelector(`body`);
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
render(header, new Search().getElement(), Position.BEFOREEND);
render(header, new Profile(user).getElement(), Position.BEFOREEND);
render(main, new Navigation(user).getElement(), Position.BEFOREEND);
render(main, new Sort().getElement(), Position.BEFOREEND);
render(main, new FilmsContainer().getElement(), Position.BEFOREEND);

const filmsList = main.querySelector(`.films-list`);
const container = filmsList.querySelector(`.films-list__container`);

if (cards.length < 1) {
  container.innerText = `There are no movies in our database`;
} else {
  renderCards(cardsList);
}


if (cardsList.length > 5) {
  render(filmsList, new ShowMoreBtn().getElement(), Position.BEFOREEND);
}

const loadMore = filmsList.querySelector(`.films-list__show-more`);
loadMore.addEventListener(`click`, () => {
  if (cardsList.length > 0) {
    renderCards(cardsList);
  }
  if (cardsList.length < 1) {
    loadMore.style.display = `none`;
  }
});
