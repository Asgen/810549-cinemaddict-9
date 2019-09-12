import AbstractComponent from '../components/AbstractComponent.js';

export default class StatisticInfo extends AbstractComponent {
  constructor({history, duration, topGenre}) {
    super();
    this._watched = history;
    this._duration = duration;
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
        <p class="statistic__item-text">${this._duration} <span class="statistic__item-description">h</span> 22 <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${this._genre}</p>
      </li>
    </ul>`;
  }
}
