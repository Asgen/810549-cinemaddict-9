import AbstractComponent from '../components/abstract-component.js';
import {getUserRank} from '../functions.js';

export default class Profile extends AbstractComponent {
  constructor(watchlistLength) {
    super();
    this._watchlistLength = watchlistLength;
    this._rating = ``;
    this._init();
  }

  update(watchlistLength) {
    this._watchlistLength = watchlistLength;
    this._init();
  }

  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }

  _init() {
    this._rating = getUserRank(this._watchlistLength);
  }
}
