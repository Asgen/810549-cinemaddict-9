import AbstractComponent from '../components/AbstractComponent.js';

class Card extends AbstractComponent {
  constructor({title, description, duration, poster, date, genre, rate, comments, isWatched, inWatchList, isFavorite}) {
    super();
    this._title = title;
    this._description = description;
    this._duration = duration;
    this._poster = poster;
    this._date = date;
    this._genre = genre;
    this._rate = rate;
    this._comments = comments;
    this._isWatched = isWatched;
    this._inWatchList = inWatchList;
    this._isFavorite = isFavorite;
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rate}</p>
    <p class="film-card__info">
      <span class="film-card__year">${new Date(this._date).toDateString()}</span>
      <span class="film-card__duration">${this._duration}</span>
      <span class="film-card__genre">${Array.from(this._genre).join(`, `)}</span>
    </p>
    <img src="${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description.length > 140 ? this._description.slice(0, 140) + `...` : `` }</p>
    <a class="film-card__comments">${this._comments.length} comments</a>
    <form class="film-card__controls">
      <button data-control-type="watchlist" class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._inWatchList ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
      <button data-control-type="watched" class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
      <button data-control-type="favorite" class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
    </form>
  </article>`;
  }
}

export default Card;
