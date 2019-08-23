import AbstractComponent from '../components/AbstractComponent.js';

export default class Navigation extends AbstractComponent {
  constructor({watchlist, history, favorites}) {
    super();
    this._favorites = favorites;
    this._watchlist = watchlist;
    this._history = history;
  }
  getTemplate() {
    return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${this._watchlist}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${this._history}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${this._favorites}</span></a>
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`;
  }
}
