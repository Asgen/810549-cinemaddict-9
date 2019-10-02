import {render, unrender, Position, SortBy} from '../utils.js';

import FilmsListExtra from '../components/films-list-extra.js';
import FilmsListExtraTitle from '../components/films-list-extra-title.js';
import FilmsContainer from '../components/films-container.js';

import MovitListConrtroller from '../controllers/movie-list-controller.js';

const Title = {
  RATE: `Top rated`,
  COMMENT: `Most commented`,
};

export default class ExtraMoviesController {
  constructor(container, onDataChange, api) {
    this._api = api;
    this._onDataChangeMain = onDataChange;
    this._container = container;
    this._movies = [];

    this._filmsListLeft = new FilmsListExtra();
    this._filmsListRight = new FilmsListExtra();
    this._filmsListTitleLeft = new FilmsListExtraTitle(Title.RATE);
    this._filmsListTitleRight = new FilmsListExtraTitle(Title.COMMENT);
    this._filmsListContainerLeft = new FilmsContainer();
    this._filmsListContainerRight = new FilmsContainer();

    this._moviesListControllerLeft = new MovitListConrtroller(this._filmsListContainerLeft.getElement(), this._onDataChange.bind(this), this._api);
    this._moviesListControllerRight = new MovitListConrtroller(this._filmsListContainerRight.getElement(), this._onDataChange.bind(this), this._api);
  }

  render(allMovies) {
    this._movies = allMovies;

    const topRated = this._getTop(Title.RATE);
    const topComments = this._getTop(Title.COMMENT);

    render(this._container, this._filmsListLeft.getElement(), Position.BEFOREEND);
    render(this._filmsListLeft.getElement(), this._filmsListTitleLeft.getElement(), Position.BEFOREEND);
    render(this._filmsListLeft.getElement(), this._filmsListContainerLeft.getElement(), Position.BEFOREEND);

    render(this._container, this._filmsListRight.getElement(), Position.BEFOREEND);
    render(this._filmsListRight.getElement(), this._filmsListTitleRight.getElement(), Position.BEFOREEND);
    render(this._filmsListRight.getElement(), this._filmsListContainerRight.getElement(), Position.BEFOREEND);


    this._moviesListControllerLeft.setCards(topRated);
    this._moviesListControllerRight.setCards(topComments);
  }

  _getTop(mode) {
    let topMovies = [];

    switch (mode) {
      case (Title.RATE):
        topMovies = this._movies.sort((a, b) => b.totalRating - a.totalRating).slice(0, 2);
        break;
      case (Title.COMMENT):
        topMovies = this._movies.sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);
        break;
    }

    return topMovies;
  }

  _onDataChange() {
    this._onDataChangeMain();
  }
}
