const fs = require("fs");

let words = JSON.parse(fs.readFileSync("emojiSets/words.json"));
let tv = JSON.parse(fs.readFileSync("emojiSets/tv.json"));
let movies = JSON.parse(fs.readFileSync("emojiSets/movies.json"));

const emojiSets = {
  words,
  tv,
  movies,
};

module.exports = { emojiSets };
