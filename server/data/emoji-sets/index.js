const fs = require("fs");
const path = require("path");

const WORDS_JSON = path.join(__dirname, "./words.json");
const TV_JSON = path.join(__dirname, "./tv.json");
const MOVIES_JSON = path.join(__dirname, "./movies.json");
const PLACES_JSON = path.join(__dirname, "./places.json");
const ANIME_JSON = path.join(__dirname, "./anime.json");

let words = JSON.parse(fs.readFileSync(WORDS_JSON));
let tv = JSON.parse(fs.readFileSync(TV_JSON));
let movies = JSON.parse(fs.readFileSync(MOVIES_JSON));
let places = JSON.parse(fs.readFileSync(PLACES_JSON));
let anime = JSON.parse(fs.readFileSync(ANIME_JSON));

const emojiSets = {
  words,
  tv,
  movies,
  places,
  anime,
};

module.exports = { emojiSets };
