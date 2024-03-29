import {getUserRank} from '../functions.js';

export default class UserData {
  constructor() {
    this.watchList = [];
    this.watchedFilms = [];
    this.favorites = [];
    this.rate = 0;
    this.topGenre = ``;
    this.totalDuration = 0;
    this.rank = ``;
  }

  update(cards) {
    this.watchList = cards.filter((card) => card.userDetails.inWatchList);
    this.watchedFilms = cards.filter((card) => card.userDetails.isWatched);
    this.favorites = cards.filter((card) => card.userDetails.isFavorite);
    this.rate = this.watchedFilms.length;
    this.totalDuration = this.watchedFilms.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.duration;
    }, 0);
    this._setTopGenre();
    this._getRank(this.watchedFilms.length);
  }

  getWatchedGenres() {
    return this.watchedFilms
    .reduce((prev, curr) => {
      return [...prev, ...curr.genre];
    }, [])
    .reduce((acc, el) => {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {});
  }

  countActivity() {
    const x = {};
    x.watchList = this.watchList.length;
    x.watchedFilms = this.watchedFilms.length;
    x.favorites = this.favorites.length;
    x.totalDuration = this.totalDuration;
    x.topGenre = this.topGenre;
    x.getWatchedGenres = this.getWatchedGenres();

    return x;
  }

  _setTopGenre() {
    const genres = [...Object.keys(this.getWatchedGenres())];
    const topIndex = [...Object.values(this.getWatchedGenres())].indexOf(Math.max(...Object.values(this.getWatchedGenres())));
    this.topGenre = genres[topIndex];
  }

  _getRank(watchedFilmsLength) {
    this.rank = getUserRank(watchedFilmsLength);
    return this.rank;
  }
}
