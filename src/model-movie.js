export default class ModelMovie {
  constructor(movie) {
    this.id = movie[`id`];
    this.title = movie[`film_info`][`title`];
    this.description = movie[`film_info`][`description`];
    this.alternativeTitle = movie[`film_info`][`alternative_title`];
    this.poster = movie[`film_info`][`poster`];
    this.director = movie[`film_info`][`director`];
    this.writers = new Set(movie[`film_info`][`writers`]);
    this.ageRating = movie[`film_info`][`age_rating`];
    this.totalRating = movie[`film_info`][`total_rating`];
    this.actors = new Set(movie[`film_info`][`actors`]);
    this.date = movie[`film_info`][`release`][`date`];
    this.country = movie[`film_info`][`release`][`release_country`];
    this.duration = movie[`film_info`][`runtime`];
    this.genre = new Set(movie[`film_info`][`genre`]);
    this.userDetails = {
      personalRating: movie[`user_details`][`personal_rating`],
      isFavorite: movie[`user_details`][`favorite`],
      isWatched: movie[`user_details`][`already_watched`],
      inWatchList: movie[`user_details`][`watchlist`],
      watchingDate: movie[`user_details`][`watching_date`],
    };
    this.comments = movie[`comments`];
  }

  static parseCard(movie) {
    return new ModelMovie(movie);
  }

  static parseCards(movies) {
    return movies.map(ModelMovie.parseCard);
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.alternativeTitle,
        "total_rating": this.totalRating,
        "poster": this.poster,
        "age_rating": this.ageRating,
        "director": this.director,
        "writers": Array.from(this.writers),
        "actors": Array.from(this.actors),
        "release": {
          "date": this.date,
          "release_country": this.country
        },
        "runtime": this.duration,
        "genre": Array.from(this.genre),
        "description": this.description
      },
      "user_details": {
        "personal_rating": this.userDetails.personalRating,
        "watchlist": this.userDetails.inWatchList,
        "already_watched": this.userDetails.isWatched,
        "watching_date": new Date(this.userDetails.watchingDate).toISOString(),
        "favorite": this.userDetails.isFavorite
      }
    };
  }
}
