const emojis = require("./emojis");

// { players: { arandomsocketid: {name: 'Jack', emoji: ':)'}},
//   settings: { scoreLimit: 10, selectedCategories: ['brands', 'places']}
// }

const rooms = {};

const DEFAULT_SCORE_LIMIT = 10;
const DEFAULT_SELECTED_CATEGORIES = {
  words: { name: "Words", icon: "💬", include: true },
  movies: { name: "Movies", icon: "🍿", include: false },
  tv: { name: "TV Shows", icon: "📺", include: false },
  places: { name: "Places", icon: "✈️", include: false },
  anime: { name: "Anime", icon: "🇯🇵", include: false },
  koreaboo: { name: "Koreaboo", icon: "🇰🇷", include: false },
  brands: { name: "Brands", icon: "🛍", include: false },
};

// Room actions
const getRoom = (roomName) => {
  if (roomName in rooms) {
    return rooms[roomName];
  } else {
    throw new Error(`Room ${roomName} could not be found.`);
  }
};

const createRoom = (roomName) => {
  if (roomName in rooms) {
    throw new Error(`Room ${roomName} already exists.`);
  } else {
    rooms[roomName] = {
      players: {},
      settings: {
        scoreLimit: DEFAULT_SCORE_LIMIT,
        selectedCategories: DEFAULT_SELECTED_CATEGORIES,
      },
    };
    return rooms[roomName];
  }
};

const cleanRooms = () => {
  Object.keys(rooms).forEach((key) => {
    if (Object.keys(rooms[key].players).length == 0) delete rooms[key];
  });
};

// User actions
const addPlayer = (roomName, playerId, { name, emoji }) => {
  rooms[roomName].players[playerId] = { name, emoji };
  return rooms[roomName].players;
};

const removePlayer = (roomName, playerId) => {
  delete rooms[roomName]?.players[playerId];
  cleanRooms();
};

// Settings actions
const updateScoreLimit = (roomName, newScoreLimit) => {
  rooms[roomName].settings.scoreLimit = newScoreLimit;
};

const updateCategories = (roomName, updatedCategories) => {
  rooms[roomName].settings.selectedCategories = updatedCategories;
};

// Game actions
const getEmojis = (selectedCategories) => {
  let gameEmojiSets = [];
  let categories = [];
  Object.keys(selectedCategories).map((category) => {
    selectedCategories[category].include && categories.push(category);
  });
  console.log(categories);
  categories.map((category) => {
    gameEmojiSets = [...gameEmojiSets, ...emojis.emojiSets[category]];
  });
  console.log(gameEmojiSets);
  return gameEmojiSets;
};

const startGame = (roomName) => {
  const gameEmojiSets = getEmojis(rooms[roomName].settings.selectedCategories);
  rooms[roomName].game = {
    emojiSets: gameEmojiSets,
  };
  console.log(rooms[roomName].game);
  return rooms[roomName].game;
};

const getEmojiSet = (roomName) => {
  const emojiSets = rooms[roomName].game.emojiSets;
  const randomEmojiSet =
    emojiSets[Math.floor(Math.random() * Math.floor(emojiSets.length))];
  console.log("random emoji set", randomEmojiSet);
  return randomEmojiSet;
};

module.exports = {
  getRoom,
  createRoom,
  cleanRooms,
  addPlayer,
  removePlayer,
  updateScoreLimit,
  updateCategories,
  startGame,
  getEmojiSet,
};
