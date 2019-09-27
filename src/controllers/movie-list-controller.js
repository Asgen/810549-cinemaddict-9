import MovieController from '../controllers/movie-controller.js';

export default class MovitListConrtroller {
  constructor(container, onDataChange) {
    this._cardsArr = [];
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._unrenderedCards = 0;

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  setCards(cards) {
    this._cardsArr = cards;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._cardsArr.forEach((card) => this._renderCard(card));
  }

  addTasks(cards) {
    cards.forEach((card) => this._renderCard(card));
    this._cardsArr = this._cardsArr.concat(cards);
  }

  _renderCard(card) {
    const movieController = new MovieController(this._container, card, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _onDataChange(oldData, newData) {
    const thisCard = this._cardsArr[this._cardsArr.findIndex((it) => it === oldData)];

    if (newData === null) {
      // console.log(`comment modified`);
    } else {

      switch (newData) {

        case (`watchlist`):
          thisCard.user_details.inWatchList = !thisCard.user_details.inWatchList ? true : false;
          break;
        case (`watched`):
          thisCard.user_details.isWatched = !thisCard.user_details.isWatched ? true : false;
          if (thisCard.user_details.isWatched) {
            thisCard.user_details[`watching_date`] = new Date().toISOString();
          }
          break;
        case (`favorite`):
          thisCard.user_details.isFavorite = thisCard.user_details.isFavorite !== true ? true : false;
          break;
      }
    }

    this._onDataChangeMain(this._cardsArr, thisCard);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
