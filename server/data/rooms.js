var _ = require("lodash");

let emojis = {};
let rooms = {};

const DEFAULT_SCORE_LIMIT = 10;
const DEFAULT_SELECTED_CATEGORIES = {
  general: { name: "General", icon: "💬", include: true },
  movies: { name: "Movies", icon: "🍿", include: false },
  tv: { name: "TV Shows", icon: "📺", include: false },
  places: { name: "Places", icon: "🌏", include: false },
  anime: { name: "Anime", icon: "🇯🇵", include: false },
  koreaboo: { name: "Koreaboo", icon: "🇰🇷", include: false },
  brands: { name: "Brands", icon: "🛍", include: false },
};

function setEmojis(fetchedEmojis) {
  emojis.emojiSets = fetchedEmojis;
}

// Room actions
const getRoom = (roomName) => {
  try {
    const room = rooms[roomName];
    if (room) {
      return room;
    } else {
      throw new Error(`Room ${roomName} could not be found.`);
    }
  } catch (e) {
    throw e;
  }
};

const createRoom = (roomName) => {
  try {
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
  } catch (e) {
    throw e;
  }
};

const cleanRooms = () => {
  Object.keys(rooms).forEach((key) => {
    if (Object.keys(rooms[key].players).length === 0) delete rooms[key];
  });
  console.log("Rooms left: ", rooms);
};

function setHost(roomName) {
  const hostExists = Object.values(rooms[roomName].players).find(
    (player) => player.host === true
  );
  const randomPlayerId = Object.keys(rooms[roomName].players).pop();
  if (!hostExists) {
    rooms[roomName].players[randomPlayerId].host = true;
  } else {
    rooms[roomName].players[randomPlayerId].host = false;
  }
}

function updateGameEvent(roomName, event) {
  if (rooms[roomName].game) {
    rooms[roomName].game.lastEvent = { type: event };
  }
}

// User actions
const addPlayer = (roomName, playerId, { name, emoji }) => {
  try {
    rooms[roomName].players[playerId] = {
      name,
      emoji,
      score: 0,
      pass: false,
      host: false,
    };
    setHost(roomName, playerId);
    updateGameEvent(roomName, "player-joined");
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
    if (player.host) setHost(roomName);
    updateGameEvent(roomName, "player-left");
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
    getUserRooms(socket).forEach((roomName) => {
      try {
        removePlayer(roomName, socket.id);
      } finally {
        socket.to(roomName).emit("room-update", rooms[roomName]);
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
  rooms[roomName].game.previousEmojiSet = {
    category: "",
    emojiSet: "",
    answer: "",
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
  resetPass(roomName);
  if (rooms[roomName]) {
    rooms[roomName].game = null;
  }
};

const passEmojiSet = (roomName, playerId) => {
  try {
    rooms[roomName].players[playerId].pass = true;
    let pass = true;
    Object.values(rooms[roomName].players).forEach((player) => {
      if (!player.pass) {
        pass = false;
      }
    });
    if (pass) {
      updateGameEvent(roomName, "pass");
      nextEmojiSet(roomName);
      resetPass(roomName);
    } else {
      updateGameEvent(roomName, "pass-request");
    }
    return pass;
  } catch (e) {
    console.error(e);
    throw new Error("Could not pass emoji set", e);
  }
};

function resetPass(roomName) {
  Object.values(rooms[roomName].players).forEach((player) => {
    player.pass = false;
  });
}

function nextEmojiSet(roomName) {
  const randomEmojiSet = rooms[roomName].game.emojiSets.pop();
  resetPass(roomName);
  rooms[roomName].game.previousEmojiSet = rooms[roomName].game.currentEmojiSet;
  rooms[roomName].game.currentEmojiSet = randomEmojiSet;
}

const addPoint = (roomName, playerId) => {
  try {
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
  } catch (e) {
    throw new Error("Could not add point");
  }
};

function resetPoints(roomName) {
  rooms[roomName] &&
    Object.keys(rooms[roomName].players).forEach((playerId) => {
      rooms[roomName].players[playerId].score = 0;
    });
}

module.exports = {
  setEmojis,
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
