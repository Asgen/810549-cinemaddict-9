import {cardsList as cards, user} from '../src/data.js';
import {render, Position} from '../src/utils.js';

import Search from '../src/components/search.js';
import Profile from '../src/components/profile.js';


import PageController from '../src/controllers/page-controller.js';

const header = document.querySelector(`.header`);
render(header, new Search().getElement(), Position.BEFOREEND);
render(header, new Profile(user).getElement(), Position.BEFOREEND);

const pageController = new PageController(cards, user);
pageController.init();
