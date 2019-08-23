import {cardsList as cards, makeCard, user} from '../src/data.js';
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
  const card = new Card(cardMock);
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
renderCards(cardsList);
render(filmsList, new ShowMoreBtn().getElement(), Position.BEFOREEND);
render(body, new Detail(makeCard()).getElement(), Position.BEFOREEND);

const loadMore = filmsList.querySelector(`.films-list__show-more`);
loadMore.addEventListener(`click`, () => {
  if (cardsList.length > 0) {
    renderCards(cardsList);
  }
  if (cardsList.length < 1) {
    loadMore.style.display = `none`;
  }
});

const detailView = document.querySelector(`.film-details`);
const closeDetailButton = detailView.querySelector(`.film-details__close-btn`);
closeDetailButton.addEventListener(`click`, () => {
  detailView.style.display = `none`;
});
