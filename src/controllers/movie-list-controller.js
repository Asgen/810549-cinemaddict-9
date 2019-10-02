import MovieController from '../controllers/movie-controller.js';

export default class MovitListConrtroller {
  constructor(container, onDataChange, api) {
    this._api = api;
    this._cardsArr = [];
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._unrenderedCards = 0;

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
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
    const movieController = new MovieController(this._container, card, this._onDataChange, this._onChangeView, this._api);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _onDataChange(oldData, newData) {

    const thisCard = this._cardsArr[this._cardsArr.findIndex((it) => it === oldData)];

    if (newData === null) {
      // comment modified
      this._onDataChangeMain();
    } else {
      switch (newData) {

        case (`watchlist`):
          thisCard.userDetails.inWatchList = !thisCard.userDetails.inWatchList;
          break;
        case (`watched`):
          thisCard.userDetails.isWatched = !thisCard.userDetails.isWatched;
          if (thisCard.userDetails.isWatched) {
            thisCard.userDetails.watchingDate = new Date().toISOString();
          }
          break;
        case (`favorite`):
          thisCard.userDetails.isFavorite = !thisCard.userDetails.isFavorite;
          break;
      }
      this._api.updateMovie(thisCard.id, thisCard.toRAW()).then(() => this._onDataChangeMain(this._cardsArr, thisCard));
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
