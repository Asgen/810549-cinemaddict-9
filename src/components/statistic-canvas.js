import AbstractComponent from '../components/abstract-component.js';

export default class StatisticCanvas extends AbstractComponent {

  getTemplate() {
    return `<div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>`;
  }
}
