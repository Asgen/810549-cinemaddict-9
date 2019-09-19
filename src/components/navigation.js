import AbstractComponent from '../components/AbstractComponent.js';

export default class Navigation extends AbstractComponent {
  constructor() {
    super();
    this._favorites = 0;
    this._watchList = 0;
    this._watchedFilms = 0;
  }

  update({watchList, watchedFilms, favorites}) {
    this._favorites = favorites;
    this._watchList = watchList;
    this._watchedFilms = watchedFilms;
  }

  getTemplate() {
    return `<nav class="main-navigation">
    <a href="#all" data-nav-type="all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" data-nav-type="watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${this._watchList}</span></a>
    <a href="#history" data-nav-type="history" class="main-navigation__item">History <span class="main-navigation__item-count">${this._watchedFilms}</span></a>
    <a href="#favorites" data-nav-type="favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${this._favorites}</span></a>
    <a href="#stats" data-nav-type="stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`;
  }
}
