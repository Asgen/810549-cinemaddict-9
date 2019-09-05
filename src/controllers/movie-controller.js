import {render, unrender, Position} from '../utils.js';

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
        document.removeEventListener(`keydown`, onEscKeyDown);
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
