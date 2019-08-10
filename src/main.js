import {search} from '../src/components/search.js';
import {profile} from '../src/components/profile.js';
import {navigation} from '../src/components/navigation.js';
import {sort} from '../src/components/sort.js';
import {filmsContainer} from '../src/components/films-container.js';
import {card} from '../src/components/card.js';
import {showMoreBtn} from '../src/components/show-more-button.js';
import {detail} from '../src/components/detail.js';


const renderComponent = (target, component, repeat = 1, placement = `beforeend`) => {
  for (let i = 0; i < repeat; i++) {
    target.insertAdjacentHTML(placement, component);
  }
};

const body = document.querySelector(`body`);
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
renderComponent(header, search());
renderComponent(header, profile());
renderComponent(main, navigation());
renderComponent(main, sort());
renderComponent(main, filmsContainer());

const filmsList = main.querySelector(`.films-list`);
const container = filmsList.querySelector(`.films-list__container`);
renderComponent(container, card(), 4);
renderComponent(filmsList, showMoreBtn());
renderComponent(body, detail());
