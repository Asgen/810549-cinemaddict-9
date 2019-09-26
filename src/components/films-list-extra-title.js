import AbstractComponent from '../components/AbstractComponent.js';

export default class FilmsListExtraTitle extends AbstractComponent {
  getTemplate() {
    return `<h2 class="films-list__title">Most commented</h2>`;
  }
}
