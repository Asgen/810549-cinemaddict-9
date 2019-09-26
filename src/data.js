const CARDS_AMOUNT = 25;

const getGanre = () => ([
  `Thriller`,
  `Thriller`,
  `Comedy`,
  `Biography`,
  `Mystery`,
  `Drama`,
][Math.floor(Math.random() * 5)]);


const makeComment = () => ({
  id: Math.floor(Math.random() * 5000000000),
  commentator: `John Doe`,
  comment: [
    `That's on fleek!`,
    `Such a bullshit`,
    `AWESOOOOOME!`
  ][Math.floor(Math.random() * 3)],
  reaction: [
    `smile`,
    `sleeping`,
    `puke`
  ][Math.floor(Math.random() * 3)],
  commentDate: Date.now(),
});

const makeCard = () => ({
  "id": Math.floor(Math.random() * 50000000),
  "title": [
    `My Best Friend's Birthday`,
    `Pulp Fiction`,
    `Reservoir Dogs`,
    `True Romance`,
    `Natural Born Killer`,
    `Four Rooms`,
    `From Dusk Till Down`,
    `Jackie Brown`,
    `Sin City`,
    `Grindhouse`,
    `Inglorious Basterds`,
    `Django Unchained`,
    `The Hateful Eight`,
    `Once Upon a Time in Holywood`,
    `Thursday`
  ][Math.floor(Math.random() * 15)],
  "description": [`Lorem ipsum okk sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique okk at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, okk boy sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`].slice(Math.floor(Math.random() * 7 - 3)).join(` `),
  "poster": [
    `/images/posters/the-dance-of-life.jpg`,
    `/images/posters/popeye-meets-sinbad.png`,
    `/images/posters/made-for-each-other.png`,
    `/images/posters/pulp-fiction.jpg`,
    `/images/posters/sin-city.jpg`
  ][Math.floor(Math.random() * 5)],
  "director": `Quentin Tarantino`,
  "writers": new Set([
    `Quentin Tarantino`,
    `Robert Anthony Rodriguez`
  ]),
  "age_rating": 18,
  "total_rating": [
    7.7,
    8.1,
    4.5
  ][Math.floor(Math.random() * 3)],
  "actors": new Set([
    `Tim Roth`,
    `John Travolta`,
    `Brad Pitt`,
    `Uma Thurman`,
    `Bridget Fonda`,
    `Margot Robbie`
  ]),
  "date": Date.now() + 1 + Math.floor((Math.random() * 15000) - 14999) * 24 * 60 * 60 * 1000,
  "duration": [
    77,
    80,
    110
  ][Math.floor(Math.random() * 3)],
  "country": `USA`,
  "genre": new Set([getGanre(), getGanre()]),
  "user_details": {
    "personal_rating": [
      8.9,
      4.5,
      9.1,
      8.3
    ][Math.floor(Math.random() * 4)],
    "isFavorite": Boolean(Math.round(Math.random())),
    "isWatched": Boolean(Math.round(Math.random())),
    "inWatchList": Boolean(Math.round(Math.random())),
    "watching_date": [
      `2019-09-21T16:12:32.554Z`,
      `2019-09-28T16:12:32.554Z`,
      `2019-09-20T16:12:32.554Z`,
      `2019-09-19T16:12:32.554Z`
    ][Math.floor(Math.random() * 4)],
  },
  "comments": Array.from(Array(Math.floor(Math.random() * 5))).map(makeComment),
});

const cardsList = Array.from(Array(CARDS_AMOUNT))
  .map(makeCard).sort((a, b) => a.id - b.id);

export {cardsList, makeCard};
