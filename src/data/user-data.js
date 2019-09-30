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

  watchedGenres() {
    return this.watchedFilms
    .reduce((prev, curr) => {
      return [...prev, ...curr.genre];
    }, [])
    .reduce((acc, el) => {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {});
  }

  _setTopGenre() {
    const genres = [...Object.keys(this.watchedGenres())];
    const topIndex = [...Object.values(this.watchedGenres())].indexOf(Math.max(...Object.values(this.watchedGenres())));
    this.topGenre = genres[topIndex];
  }

  countActivity() {
    const x = {};
    x.watchList = this.watchList.length;
    x.watchedFilms = this.watchedFilms.length;
    x.favorites = this.favorites.length;
    x.totalDuration = this.totalDuration;
    x.topGenre = this.topGenre;
    x.watchedGenres = this.watchedGenres();

    return x;
  }

  _getRank(watchedFilmsLength) {
    switch (true) {
      case (watchedFilmsLength < 1):
        this.rank = ``;
        break;
      case (watchedFilmsLength > 0 && watchedFilmsLength < 11):
        this.rank = `Novice`;
        break;
      case (watchedFilmsLength > 10 && watchedFilmsLength < 21):
        this.rank = `Fan`;
        break;
      case (watchedFilmsLength > 20):
        this.rank = `Movie Buff`;
        break;
    }
    return this.rank;
  }
}
