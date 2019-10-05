import AbstractComponent from '../components/abstract-component.js';

export default class FooterCounter extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }
  getTemplate() {
    return `<p>${this._count} movies inside</p>`;
  }
}
