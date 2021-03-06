const { GoogleSpreadsheet } = require("google-spreadsheet");
const { decryptJSON } = require("./crypto");

const SPREADSHEET_ID = "1BzqqZPJjaGtr8wEXL-rcgIr5PmyQewiA6TOE0MbglIg";

function parseRows(rows) {
  let emojiSets = [];
  rows.forEach(({ category, emojiSet, answer }) => {
    if (category && emojiSet && answer)
      emojiSets.push({ category, emojiSet, answer });
  });
  return emojiSets;
}

async function fetchEmojis() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(decryptJSON(require("./hash.json")));
    await doc.loadInfo();

    const SHEET_IDS = {
      general: 1100919438,
      movies: 1448404852,
      tv: 1066868128,
      songs: 109594337,
      places: 1066745410,
      brands: 1563151545,
      anime: 554060221,
      koreaboo: 556464515,
    };

    const general = parseRows(
      await doc.sheetsById[SHEET_IDS.general].getRows()
    );
    const movies = parseRows(await doc.sheetsById[SHEET_IDS.movies].getRows());
    const tv = parseRows(await doc.sheetsById[SHEET_IDS.tv].getRows());
    const songs = parseRows(await doc.sheetsById[SHEET_IDS.songs].getRows());
    const places = parseRows(await doc.sheetsById[SHEET_IDS.places].getRows());
    const brands = parseRows(await doc.sheetsById[SHEET_IDS.brands].getRows());
    const anime = parseRows(await doc.sheetsById[SHEET_IDS.anime].getRows());
    const koreaboo = parseRows(
      await doc.sheetsById[SHEET_IDS.koreaboo].getRows()
    );

    const emojiSets = {
      songs,
      general,
      movies,
      tv,
      places,
      brands,
      anime,
      koreaboo,
    };

    console.log(
      `Fetched ${
        movies.length +
        tv.length +
        songs.length +
        places.length +
        brands.length +
        anime.length +
        koreaboo.length
      } emoji sets.`
    );

    return emojiSets;
  } catch (e) {
    throw e;
  }
}

module.exports = { fetchEmojis };
