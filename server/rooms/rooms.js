const emojis = require("./emojis");
var _ = require("lodash");

// { players: { arandomsocketid: {name: 'Jack', emoji: ':)'}},
//   settings: { scoreLimit: 10, selectedCategories: ['brands', 'places']}
// }

let rooms = {};

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
      name: roomName,
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
    if (Object.keys(rooms[key].players).length === 0) delete rooms[key];
  });
  console.log("Rooms left: ", rooms);
};

// User actions
const addPlayer = (roomName, playerId, { name, emoji }) => {
  rooms[roomName].players[playerId] = { name, emoji, score: 0 };
  console.log("Added player", rooms[roomName].players);
  return rooms[roomName].players;
};

const getPlayer = (roomName, playerId) => {
  return rooms[roomName].players[playerId];
};

const removePlayer = (roomName, playerId) => {
  console.log("trying to delete", playerId, "from", roomName);
  try {
    const player = rooms[roomName].players[playerId];
    console.log(`Deleting`, player, playerId);
    delete rooms[roomName].players[playerId];
    console.log(`Players left`, rooms[roomName].players);
    return rooms[roomName].players;
  } catch (e) {
    console.log("Could not remove", playerId, "from", roomName);
  } finally {
    cleanRooms();
  }
};

const removePlayerFromAllRooms = (socket) => {
  const getUserRooms = (socket) => {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.players[socket.id] != null) names.push(name);
      return names;
    }, []);
  };

  try {
    getUserRooms(socket).forEach((room) => {
      try {
        delete rooms[room].players[socket.id];
      } finally {
        socket.to(room).emit("player-disconnected", rooms[room].players);
      }
    });
  } catch (e) {
    console.log("Could not remove", socket.id, "from all rooms");
  } finally {
    cleanRooms();
  }
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
  gameEmojiSets = _.shuffle(gameEmojiSets);
  return gameEmojiSets;
};

const startGame = (roomName) => {
  const gameEmojiSets = getEmojis(rooms[roomName].settings.selectedCategories);
  rooms[roomName].game = {
    emojiSets: gameEmojiSets,
  };
  rooms[roomName].game.currentEmojiSet = getEmojiSet(roomName);
  console.log(rooms[roomName].game);
  return rooms[roomName].game;
};

const getEmojiSet = (roomName) => {
  const emojiSets = rooms[roomName].game.emojiSets;
  try {
    const randomEmojiSet = emojiSets.pop();
    rooms[roomName].game.currentEmojiSet = randomEmojiSet;
    return randomEmojiSet;
  } catch (e) {
    console.log(e);
    throw new Error("No more emojiSets left in selected categories.");
  }
};

const addPoint = (roomName, playerId) => {
  rooms[roomName].players[playerId].score += 1;
  return rooms[roomName].players;
};

const resetPoints = (roomName) => {
  Object.keys(rooms[roomName].players).forEach((playerId) => {
    rooms[roomName].players[playerId].score = 0;
  });
  return rooms[roomName].players;
};

module.exports = {
  getRoom,
  createRoom,
  cleanRooms,
  addPlayer,
  getPlayer,
  removePlayer,
  removePlayerFromAllRooms,
  updateScoreLimit,
  updateCategories,
  startGame,
  getEmojiSet,
  addPoint,
  resetPoints,
};
