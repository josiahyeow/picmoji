const fs = require("fs");
const path = require("path");

const ANIME_JSON = path.join(__dirname, "./anime.json");
const BRANDS_JSON = path.join(__dirname, "./brands.json");
const KOREABOO_JSON = path.join(__dirname, "./koreaboo.json");
const MOVIES_JSON = path.join(__dirname, "./movies.json");
const PLACES_JSON = path.join(__dirname, "./places.json");
const TV_JSON = path.join(__dirname, "./tv.json");
const WORDS_JSON = path.join(__dirname, "./words.json");

let anime = JSON.parse(fs.readFileSync(ANIME_JSON));
let brands = JSON.parse(fs.readFileSync(BRANDS_JSON));
let koreaboo = JSON.parse(fs.readFileSync(KOREABOO_JSON));
let movies = JSON.parse(fs.readFileSync(MOVIES_JSON));
let places = JSON.parse(fs.readFileSync(PLACES_JSON));
let tv = JSON.parse(fs.readFileSync(TV_JSON));
let words = JSON.parse(fs.readFileSync(WORDS_JSON));

const emojiSets = {
  anime,
  brands,
  koreaboo,
  movies,
  places,
  tv,
  words,
};

module.exports = { emojiSets };
