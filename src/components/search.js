import AbstractComponent from '../components/AbstractComponent.js';

export default class Search extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return `<div class="result">
    <p class="result__text">Result <span class="result__count">${this._count}</span></p>
  </div>`;
  }
}
