import AbstractComponent from '../components/AbstractComponent.js';

export default class FooterCounter extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }
  getTemplate() {
    return `<p>${this._count} movies inside</p>`;
  }
}
