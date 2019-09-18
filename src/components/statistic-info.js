import AbstractComponent from '../components/AbstractComponent.js';

export default class StatisticInfo extends AbstractComponent {
  constructor({history, topGenre}) {
    super();
    this._watched = history.length;
    this._duration = history.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.duration;
    }, 0);
    this._genre = topGenre;
  }
  getTemplate() {
    return `<ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${this._watched} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${Math.floor(this._duration / 60)} <span class="statistic__item-description">h</span> ${this._duration % 60} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${this._genre}</p>
      </li>
    </ul>`;
  }
}
