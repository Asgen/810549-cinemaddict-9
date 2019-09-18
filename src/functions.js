const getWatchedGenres = (watchedMovies) => {

  const allGenres = watchedMovies
  .reduce((prev, curr) => {
    return [...prev, ...curr.genre];
  }, [])
  .reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  return allGenres;
};

export {getWatchedGenres};
