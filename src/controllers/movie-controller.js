import {render, createElement, unrender, Position} from '../utils.js';

import Card from '../components/card.js';
import Detail from '../components/detail.js';
export default class MovieController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._card = new Card(data);
    this._detail = new Detail(data);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;

    this.init();
  }

  init() {
    const body = document.querySelector(`body`);

    const onCardClick = () => {

      const onEscKeyDown = (evt) => {
        if (evt.key === `Escape` || evt.key === `Esc`) {
          this.setDefaultView();
        }
      };

      this._detail.getElement()
        .querySelector(`.film-details__close-btn`)
        .addEventListener(`click`, () => {
          this.setDefaultView();
        });

      this._detail.getElement()
        .querySelector(`textarea`)
        .addEventListener(`focus`, () => {
          document.removeEventListener(`keydown`, onEscKeyDown);
        });

      document.addEventListener(`keydown`, onEscKeyDown);

      this._onChangeView();

      render(body, this._detail.getElement(), Position.BEFOREEND);
    };

    // Обработка нажатий на контроль фильма
    for (let control of this._card.getElement().querySelectorAll(`.film-card__controls-item`)) {
      control.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        evt.target.classList.toggle(`film-card__controls-item--active`);
        switch (evt.target.dataset.controlType) {
          case (`watchlist`):
            this._onDataChange(this._data, `watchlist`);
            break;
          case (`watched`):
            this._onDataChange(this._data, `watched`);
            break;
          case (`favorite`):
            this._onDataChange(this._data, `favorite`);
            break;
        }
      });
    }

    // Обработка нажатий на контроль фильма в детальном просмотре
    for (let control of this._detail.getElement().querySelectorAll(`.film-details__control-input`)) {
      control.addEventListener(`change`, (evt) => {
        evt.preventDefault();
        switch (evt.target.id) {
          case (`watchlist`):
            this._onDataChange(this._data, `watchlist`);
            break;
          case (`watched`):
            this._onDataChange(this._data, `watched`);
            break;
          case (`favorite`):
            this._onDataChange(this._data, `favorite`);
            break;
        }
      });
    }


    // Удаление комментария
    this._detail.getElement().querySelector(`.film-details__comments-wrap`)
      .addEventListener(`click`, (evt) => {

        if (evt.target.tagName !== `BUTTON`) {
          return;
        }

        let commentId = 0;

        this._detail.getElement().querySelectorAll(`.film-details__comment`)
          .forEach((it) => {
            if ((it.contains(evt.target))) {
              it.remove();
              commentId = parseInt(it.id, 10);
            }
          });

        this._data.comments.forEach((it, index) => {
          if (it.id === commentId) {
            this._data.comments.splice(index, 1);
          }
        });

        this._onDataChange(this._data, null);
      });

    // Добавление комментария
    const emojiContainer = this._detail.getElement().querySelector(`.film-details__add-emoji-label`);
    const emojiList = this._detail.getElement().querySelectorAll(`.film-details__emoji-item`);
    const commentInput = this._detail.getElement().querySelector(`.film-details__comment-input`);

    commentInput.addEventListener(`keydown`, (evt) => {

      if (evt.key === `Enter` && evt.ctrlKey && commentInput.value && emojiContainer.querySelector(`img`)) {

        const newComment = {
          id: Math.floor(Math.random() * 5000000000),
          commentator: `John Doe`,
          comment: encodeURI(commentInput.value).replace(/%20/gi, ` `),
          reaction: this._detail.getElement().querySelector(`input[name="comment-emoji"]:checked`).value,
          commentDate: Date.now(),
        };

        this._data.comments.push(newComment);

        const comment = createElement(this._detail.createComment(newComment));
        render(this._detail.getElement().querySelector(`.film-details__comments-list`), comment, Position.BEFOREEND);

        this._onDataChange(this._data, null);
      }

    });

    // Выбор emoji
    for (let emoji of emojiList) {
      emoji.addEventListener(`change`, (evt) => {
        emojiContainer.innerHTML = ``;

        switch (evt.target.value) {
          case (`smile`):
            render(emojiContainer, createElement(`<img src="images/emoji/smile.png" width="55" height="55" alt="emoji">`), Position.BEFOREEND);
            break;
          case (`sleeping`):
            render(emojiContainer, createElement(`<img src="images/emoji/sleeping.png" width="55" height="55" alt="emoji">`), Position.BEFOREEND);
            break;
          case (`puke`):
            render(emojiContainer, createElement(`<img src="images/emoji/puke.png" width="55" height="55" alt="emoji">`), Position.BEFOREEND);
            break;
          case (`angry`):
            render(emojiContainer, createElement(`<img src="images/emoji/angry.png" width="55" height="55" alt="emoji">`), Position.BEFOREEND);
            break;
        }
      });
    }

    this._card.getElement().querySelector(`.film-card__title`).addEventListener(`click`, () => onCardClick(this._data));
    this._card.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, () => onCardClick(this._data));
    this._card.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => onCardClick(this._data));

    render(this._container.getElement(), this._card.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (document.body.contains(this._detail.getElement())) {
      unrender(this._detail.getElement());
      this._detail.removeElement();
    }
  }
}
