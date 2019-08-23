import AbstractComponent from '../components/AbstractComponent.js';

export default class ShowMoreBtn extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}
