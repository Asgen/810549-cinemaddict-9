import AbstractComponent from '../components/AbstractComponent.js';

export default class Profile extends AbstractComponent {
  constructor(watchlistLength) {
    super();
    this._watchlistLength = watchlistLength;
    this._rating = ``;
    this._init();
  }

  _init() {
    switch (true) {
      case (this._watchlistLength < 1):
        this._rating = ``;
        break;
      case (this._watchlistLength > 0 && this._watchlistLength < 11):
        this._rating = `Novice`;
        break;
      case (this._watchlistLength > 10 && this._watchlistLength < 21):
        this._rating = `Fan`;
        break;
      case (this._watchlistLength > 20):
        this._rating = `Movie Buff`;
        break;
    }
  }


  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }
}
