export default class ModelMovie {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`];
    this.description = data[`film_info`][`description`];
    this.alternativeTitle = data[`film_info`][`alternative_title`];
    this.poster = data[`film_info`][`poster`];
    this.director = data[`film_info`][`director`];
    this.writers = new Set(data[`film_info`][`writers`]);
    this.ageRating = data[`film_info`][`age_rating`];
    this.totalRating = data[`film_info`][`total_rating`];
    this.actors = new Set(data[`film_info`][`actors`]);
    this.date = data[`film_info`][`release`][`date`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.duration = data[`film_info`][`runtime`];
    this.genre = new Set(data[`film_info`][`genre`]);
    this.userDetails = {
      personalRating: data[`user_details`][`personal_rating`],
      isFavorite: data[`user_details`][`favorite`],
      isWatched: data[`user_details`][`already_watched`],
      inWatchlist: data[`user_details`][`watchlist`],
      watchingDate: data[`user_details`][`watching_date`],
    };
    this.comments = data[`comments`];
  }

  static parseCard(data) {
    return new ModelMovie(data);
  }

  static parseCards(data) {
    return data.map(ModelMovie.parseCard);
  }
}
