import AbstractComponent from '../components/abstract-component.js';

export default class FilmsListExtraTitle extends AbstractComponent {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return `<h2 class="films-list__title">${this._title}</h2>`;
  }
}
