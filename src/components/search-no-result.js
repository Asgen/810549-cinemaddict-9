import AbstractComponent from '../components/abstract-component.js';

export default class SearchNoResult extends AbstractComponent {
  getTemplate() {
    return `<div class="no-result">
        There is no movies for your request.
      </div>`;
  }
}
