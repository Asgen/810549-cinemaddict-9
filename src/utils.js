const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const SortBy = {
  DATE: `date`,
  RATING: `rating`,
  DEFAULT: `default`
};

const FilterBy = {
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  ALL: `all`
};

const createElement = (tempalete) => {
  const element = document.createElement(`div`);
  element.innerHTML = tempalete;
  return element.firstChild;
};

// Рендер и анрендер для компонент
const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export {createElement, render, unrender, Position, SortBy, FilterBy};
