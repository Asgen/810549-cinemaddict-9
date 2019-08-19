import {cardsList as cards, makeCard, user} from '../src/data.js';

import {search} from '../src/components/search.js';
import {profile} from '../src/components/profile.js';
import {navigation} from '../src/components/navigation.js';
import {sort} from '../src/components/sort.js';
import {filmsContainer} from '../src/components/films-container.js';
import {card} from '../src/components/card.js';
import {showMoreBtn} from '../src/components/show-more-button.js';
import {detail} from '../src/components/detail.js';

const cardsList = cards.slice();

const renderComponent = (target, component, repeat = 1, placement = `beforeend`) => {
  for (let i = 0; i < repeat; i++) {
    target.insertAdjacentHTML(placement, component);
  }
};

const renderCard = (target, data, tamplate, placement = `beforeend`) => {
  target.insertAdjacentHTML(placement, data.splice(0, 5)
    .map(tamplate)
    .join(``)
  );
};

const renderMoreTask = (container, list, tamplate, placement = `beforeend`) => {
  container.insertAdjacentHTML(placement, list.splice(0, 5)
    .map(tamplate)
    .join(``));
};

const body = document.querySelector(`body`);
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
renderComponent(header, search());
renderComponent(header, profile(user));
renderComponent(main, navigation(user));
renderComponent(main, sort());
renderComponent(main, filmsContainer());

const filmsList = main.querySelector(`.films-list`);
const container = filmsList.querySelector(`.films-list__container`);
renderCard(container, cardsList, card);
renderComponent(filmsList, showMoreBtn());
renderComponent(body, detail(makeCard()));

const loadMore = filmsList.querySelector(`.films-list__show-more`);
loadMore.addEventListener(`click`, () => {
  if (cardsList.length > 0) {
    renderMoreTask(container, cardsList, card);
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


