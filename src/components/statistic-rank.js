import AbstractComponent from '../components/abstract-component.js';

export default class StatisticRank extends AbstractComponent {
  constructor(rating) {
    super();
    this._rank = rating;
  }
  getTemplate() {
    return `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${this._rank ? this._rank : `-`}</span>
    </p>`;
  }
}
