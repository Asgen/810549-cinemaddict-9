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
      inWatchList: data[`user_details`][`watchlist`],
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
