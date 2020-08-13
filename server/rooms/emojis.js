const fs = require("fs");
const path = require("path");

const WORDS_JSON = path.join(__dirname, "../emojiSets/words.json");
const TV_JSON = path.join(__dirname, "../emojiSets/tv.json");
const MOVIES_JSON = path.join(__dirname, "../emojiSets/movies.json");

let words = JSON.parse(fs.readFileSync(WORDS_JSON));
let tv = JSON.parse(fs.readFileSync(TV_JSON));
let movies = JSON.parse(fs.readFileSync(MOVIES_JSON));

const emojiSets = {
  words,
  tv,
  movies,
};

module.exports = { emojiSets };
