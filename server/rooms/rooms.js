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
    return new Error(`Room ${roomName} could not be found.`);
  }
};

const createRoom = (roomName) => {
  if (roomName in rooms) {
    return new Error(`Room ${roomName} already exists.`);
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
  try {
    rooms[roomName].players[playerId] = { name, emoji, score: 0, pass: false };
    console.log("Added player", rooms[roomName].players);
    return rooms[roomName].players;
  } catch (e) {
    return e;
  }
};

const getPlayer = (roomName, playerId) => {
  return rooms[roomName] && rooms[roomName].players[playerId];
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
  rooms[roomName].settings.scoreLimit = Number(newScoreLimit);
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
  categories.map((category) => {
    gameEmojiSets = [...gameEmojiSets, ...emojis.emojiSets[category]];
  });
  gameEmojiSets = _.shuffle(gameEmojiSets);
  return gameEmojiSets;
};

const startGame = (roomName) => {
  const gameEmojiSets = getEmojis(rooms[roomName].settings.selectedCategories);
  rooms[roomName].game = {
    emojiSets: gameEmojiSets,
    round: 1,
    scoreLimit: rooms[roomName].settings.scoreLimit,
    lastEvent: { type: "start" },
  };
  rooms[roomName].game.currentEmojiSet = rooms[roomName].game.emojiSets.pop();
  return rooms[roomName].game;
};

const getWinners = (roomName) => {
  const winners = Object.values(rooms[roomName].players)
    .sort((a, b) => {
      if (a.score > b.score) return -1;
      if (b.score > a.score) return 1;
      return 0;
    })
    .slice(0, 4);
  rooms[roomName].game.winners = winners;
  return winners;
};

const endGame = (roomName) => {
  resetPoints(roomName);
  rooms[roomName].game = null;
};

const passEmojiSet = (roomName, playerId) => {
  rooms[roomName].players[playerId].pass = true;
  let pass = true;
  Object.values(rooms[roomName].players).forEach((player) => {
    if (!player.pass) {
      pass = false;
    }
  });
  rooms[roomName].game.lastEvent = { type: "pass" };
  return pass;
};

const resetPass = (roomName) => {
  Object.values(rooms[roomName].players).forEach((player) => {
    player.pass = false;
  });
};

const nextEmojiSet = (roomName) => {
  const randomEmojiSet = rooms[roomName].game.emojiSets.pop();
  resetPass(roomName);
  rooms[roomName].game.currentEmojiSet = randomEmojiSet;
};

const addPoint = (roomName, playerId) => {
  rooms[roomName].players[playerId].score += 1;
  rooms[roomName].game.lastEvent = {
    ...rooms[roomName].players[playerId],
    type: "correct",
  };
  if (
    rooms[roomName].players[playerId].score ===
    rooms[roomName].settings.scoreLimit
  ) {
    getWinners(roomName);
  }
};

function resetPoints(roomName) {
  rooms[roomName] &&
    Object.keys(rooms[roomName].players).forEach((playerId) => {
      rooms[roomName].players[playerId].score = 0;
    });
}

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
  getWinners,
  endGame,
  nextEmojiSet,
  passEmojiSet,
  resetPass,
  addPoint,
  resetPoints,
};
