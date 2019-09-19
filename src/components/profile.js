import AbstractComponent from '../components/AbstractComponent.js';

export default class Profile extends AbstractComponent {
  constructor({watchlist}) {
    super();
    this._rating = watchlist;
  }
  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }
}
