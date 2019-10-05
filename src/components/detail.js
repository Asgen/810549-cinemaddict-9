import moment from 'moment';
import AbstractComponent from '../components/abstract-component.js';

export default class Detail extends AbstractComponent {
  constructor({id, title, alternativeTitle, description, director, writers, actors, duration, country, poster, date, genre, totalRating, ageRating, userDetails}, comments) {
    super();
    this._id = id;
    this._title = title;
    this._alternativeTitle = alternativeTitle;
    this._description = description;
    this._director = director;
    this._writers = writers;
    this._actors = actors;
    this._duration = duration;
    this._country = country;
    this._poster = poster;
    this._date = date;
    this._genre = genre;
    this._rate = totalRating;
    this._age = ageRating;
    this._comments = comments;
    this._isWatched = userDetails.isWatched;
    this._inWatchList = userDetails.inWatchList;
    this._isFavorite = userDetails.isFavorite;
    this._personalRate = userDetails.isWatched ? userDetails.personalRating : null;

    this._onControlClick();
  }

  createComment(comment) {
    return `<li id="${comment.id}" class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${new Date(comment.date).toDateString()}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
  }

  updatePersonalRating(rating) {
    this.getElement().querySelector(`.film-details__user-rating`).innerText = `Your rate ${rating}`;
  }

  removePersonalRating() {
    if (this.getElement().querySelector(`.film-details__user-rating`)) {
      this.getElement().querySelector(`.film-details__user-rating`).innerText = ``;
    }
  }

  updateCommentsCount(count) {
    this.getElement().querySelector(`.film-details__comments-count`).innerText = count;
  }

  _onControlClick() {
    this.getElement().querySelector(`#watched`).addEventListener(`change`, (evt) => {
      evt.preventDefault();

      if (evt.target.id === `watched`) {
        this.getElement().querySelector(`.form-details__middle-container`).classList.toggle(`visually-hidden`);
      }
    });
  }

  getTemplate() {
    return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${this._poster}" alt="">

          <p class="film-details__age">${this._age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${this._title}</h3>
              <p class="film-details__title-original">${this._alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${this._rate}</p>
              ${this._personalRate ? `<p class="film-details__user-rating">Your rate ${this._personalRate}</p>` : ``}
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${this._director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${Array.from(this._writers).join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${Array.from(this._actors).join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${moment(this._date).format(`DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${Math.floor(this._duration / 60)}h ${this._duration % 60}m</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${this._country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${Array.from(this._genre)
                  .map((it) => `<span class="film-details__genre">${it}</span>`)
                  .join(``)}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${this._description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._inWatchList ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__middle-container ${this._isWatched ? `` : `visually-hidden`}">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${this._title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">

            ${Array.from(Array(9))
                  .map((it, index) => `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${index + 1}" id="rating-${index + 1}" ${this._personalRate === index + 1 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-${index + 1}">${index + 1}</label>`)
                  .join(``)}

            </div>
          </section>
        </div>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${this._comments.map((it) => `<li id="${it.id}" class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${it.emotion}.png" width="55" height="55" alt="emoji">
            </span>
            <div>
              <p class="film-details__comment-text">${it.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${it.author}</span>
                <span class="film-details__comment-day">${new Date(it.date).toDateString()}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`).join(``)}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="puke">
            <label class="film-details__emoji-label" for="emoji-gpuke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
  }
}
