import AbstractComponent from '../components/abstract-component.js';

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

  setCount(count) {
    this._count = count;
    this._element = null;
  }
}
