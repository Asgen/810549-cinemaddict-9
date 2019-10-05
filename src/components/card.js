import moment from 'moment';
import AbstractComponent from '../components/abstract-component.js';

const MAX_DESCRIPTION_LENGTH = 140;

class Card extends AbstractComponent {
  constructor({title, description, duration, poster, date, genre, totalRating, userDetails, comments}) {
    super();
    this._title = title;
    this._description = description;
    this._duration = duration;
    this._poster = poster;
    this._date = date;
    this._genre = genre;
    this._rate = totalRating;
    this._comments = comments;
    this._isWatched = userDetails.isWatched;
    this._inWatchList = userDetails.inWatchList;
    this._isFavorite = userDetails.isFavorite;
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rate}</p>
    <p class="film-card__info">
      <span class="film-card__year">${moment(this._date).format(`YYYY`)}</span>
      <span class="film-card__duration">${Math.floor(this._duration / 60)}h ${this._duration % 60}m</span>
      <span class="film-card__genre">${Array.from(this._genre).join(`, `)}</span>
    </p>
    <img src="${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description.length > MAX_DESCRIPTION_LENGTH ? this._description.slice(0, MAX_DESCRIPTION_LENGTH) + `...` : `` }</p>
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
