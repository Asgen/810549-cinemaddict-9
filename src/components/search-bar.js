import AbstractComponent from '../components/abstract-component.js';

export default class SearchBar extends AbstractComponent {
  getTemplate() {
    return `<form class="header__search search">
    <input aria-label="search-bar" type="text" name="search" class="search__field" placeholder="Search movies">
    <svg fill="#7171D8" class="search__film-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
      <path fill-rule="nonzero" d="M2 0v4.524h2.833V0h11.334v4.524H19V0h1v19h-1v-4.524h-2.833V19H4.833v-4.524H2V19H0V0h2zm0 7.238v4.524h2.833V7.238H2zm14.167 0v4.524H19V7.238h-2.833z"/>
    </svg>
    <button type="submit" class="visually-hidden">Search</button>
    <button class="search__reset" type="reset">Reset</button>
  </form>`;
  }
}
