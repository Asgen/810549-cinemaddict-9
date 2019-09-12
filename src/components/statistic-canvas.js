import AbstractComponent from '../components/AbstractComponent.js';

export default class StatisticCanvas extends AbstractComponent {

  getTemplate() {
    return `<div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>`;
  }
}
