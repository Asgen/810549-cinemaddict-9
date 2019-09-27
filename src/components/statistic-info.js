import AbstractComponent from '../components/AbstractComponent.js';

export default class StatisticInfo extends AbstractComponent {
  constructor({watchedFilms, topGenre, totalDuration}) {
    super();
    this._watched = watchedFilms;
    this._duration = totalDuration;
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
        <p class="statistic__item-text">${this._genre ? this._genre : `-`}</p>
      </li>
    </ul>`;
  }
}
