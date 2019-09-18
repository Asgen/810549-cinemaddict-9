import {render, unrender, Position} from '../utils.js';

import ShowMoreBtn from '../components/show-more-button.js';
import MovieController from '../controllers/movie-controller.js';

export default class MovitListConrtroller {
  constructor(container, onDataChange) {
    this._cardsArr = [];
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._showMoreBtn = new ShowMoreBtn();
    this._unrenderedCards = 0;

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  init(films) {

    this._cardsArr = films;
    const cardsList = this._cardsArr.slice();

    const body = document.querySelector(`body`);

    if (this._cardsArr.length < 1) {
      body.innerText = `There are no movies in our database`;
    } else {
      this._renderCards(cardsList);
      this._unrenderedCards = cardsList;
    }
    this._showMoreBtn.getElement().addEventListener(`click`, () => {
      if (this._unrenderedCards.length > 0) {
        this._renderCards(this._unrenderedCards);
      }
      if (this._unrenderedCards.length < 1) {
        unrender(this._showMoreBtn.getElement());
      }
    });
  }

  _renderCards(cardsArr) {
    cardsArr.splice(0, 5).forEach((cardMock) => {
      const movieController = new MovieController(this._container, cardMock, this._onDataChange, this._onChangeView);
      this._subscriptions.push(movieController.setDefaultView.bind(movieController));
    });
    this._unrenderedCards = cardsArr;

    if (cardsArr.length > 0) {
      render(this._container, this._showMoreBtn.getElement(), Position.BEFOREEND);
    }
  }

  _onDataChange(oldData, newData) {
    const thisCard = this._cardsArr[this._cardsArr.findIndex((it) => it === oldData)];

    if (newData === null) {
      // console.log(`comments modified`);
    } else {

      switch (newData) {

        case (`watchlist`):
          thisCard.inWatchList = thisCard.inWatchList !== true ? true : false;
          break;
        case (`watched`):
          thisCard.isWatched = thisCard.isWatched !== true ? true : false;
          break;
        case (`favorite`):
          thisCard.isFavorite = thisCard.isFavorite !== true ? true : false;
          break;
      }
    }

    this._onDataChangeMain(this._cardsArr);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
