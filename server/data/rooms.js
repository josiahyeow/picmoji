var _ = require("lodash");

let emojis = {};
let rooms = {};

const DEFAULT_SCORE_LIMIT = 10;
const DEFAULT_SELECTED_CATEGORIES = {
  general: { name: "General", icon: "💬", include: true },
  movies: { name: "Movies", icon: "🍿", include: false },
  tv: { name: "TV Shows", icon: "📺", include: false },
  songs: { name: "Music", icon: "🎵", include: false },
  places: { name: "Places", icon: "🌏", include: false },
  brands: { name: "Brands", icon: "🛍", include: false },
  anime: { name: "Anime", icon: "🇯🇵", include: false },
  koreaboo: { name: "Koreaboo", icon: "🇰🇷", include: false },
};

const GAME_MODES = {
  CLASSIC: "classic",
  PICTIONARY: "pictionary",
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
          mode: GAME_MODES.CLASSIC,
        },
        lastEvent: { type: "Room created" },
      };
      return rooms[roomName];
    }
  } catch (e) {
    throw e;
  }
};

function addRoom(room) {
  rooms = { ...rooms, [room.name]: room };
}

const cleanRooms = () => {
  // Object.keys(rooms).forEach((key) => {
  //   if (Object.keys(rooms[key].players).length === 0) delete rooms[key];
  // });
  // console.log("Rooms left: ", rooms);
  return true;
};

function getRooms() {
  return rooms;
}

function killRooms() {
  rooms = {};
}

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
  } else {
    rooms[roomName].lastEvent = { type: event };
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
    // console.log("Added player", rooms[roomName].players);
    return rooms[roomName].players;
  } catch (e) {
    throw e;
  }
};

const getPlayer = (roomName, playerId) => {
  return rooms[roomName] && rooms[roomName].players[playerId];
};

const removePlayer = (roomName, playerId) => {
  try {
    const player = rooms[roomName].players[playerId];
    delete rooms[roomName].players[playerId];
    if (player.host) setHost(roomName);
    updateGameEvent(roomName, "player-left");
    return rooms[roomName].players;
  } catch (e) {
    return true;
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
    return true;
  } finally {
    cleanRooms();
  }
};

// Settings actions
const updateScoreLimit = (roomName, newScoreLimit) => {
  rooms[roomName].settings.scoreLimit = Number(newScoreLimit);
  updateGameEvent(roomName, "score-limit-updated");
};

const updateCategories = (roomName, updatedCategories) => {
  rooms[roomName].settings.selectedCategories = updatedCategories;
  updateGameEvent(roomName, "categories-updated");
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

function getMode(roomName) {
  return rooms[roomName].settings.mode;
}

const startGame = (roomName) => {
  try {
    const categorySelected = Object.values(
      rooms[roomName].settings.selectedCategories
    ).find((category) => category.include === true);
    if (!categorySelected) {
      throw new Error("Please include at least 1 category to start the game.");
    }
    const gameEmojiSets = getEmojis(
      rooms[roomName].settings.selectedCategories
    );
    rooms[roomName].game = {
      emojiSets: gameEmojiSets,
      scoreLimit: rooms[roomName].settings.scoreLimit,
      lastEvent: { type: "start" },
    };
    const mode = rooms[roomName].settings.mode;
    nextEmojiSet(roomName);
    if (mode === GAME_MODES.PICTIONARY) {
      initialiseDrawers(roomName);
      nextDrawer(roomName);
    }
    return rooms[roomName].game;
  } catch (e) {
    throw e;
  }
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
      resetPass(roomName);
      updateGameEvent(roomName, "pass");
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

function updateHint(roomName) {
  try {
    if (rooms[roomName].game) {
      const emojiSet = rooms[roomName].game.currentEmojiSet;
      const hint = makeHint(emojiSet).hint;
      return hint;
    }
  } catch (e) {
    throw e;
  }
}

function nextEmojiSet(roomName) {
  resetPass(roomName);
  const randomEmojiSet = rooms[roomName].game.emojiSets.pop();
  randomEmojiSet.firstHint = true;
  const emojiSet = makeHint(randomEmojiSet);

  if (rooms[roomName].game.currentEmojiSet) {
    rooms[roomName].game.previousEmojiSet =
      rooms[roomName].game.currentEmojiSet;
  } else {
    rooms[roomName].game.previousEmojiSet = {
      emojiSet: "",
      answer: "",
      hint: "",
      category: "",
    };
  }
  if (getMode(roomName) === GAME_MODES.PICTIONARY) {
    emojiSet.emojiSet = "";
  }
  rooms[roomName].game.currentEmojiSet = emojiSet;
  return emojiSet;
}

function nextRound(roomName) {
  rooms[roomName].game.round += 1;
  initialiseDrawers(roomName);
  nextDrawer(roomName);
}

function initialiseDrawers(roomName) {
  rooms[roomName].game.drawers = Object.keys(rooms[roomName].players);
}

function nextDrawer(roomName) {
  const currentDrawer = rooms[roomName].game.drawer;
  if (currentDrawer) rooms[roomName].players[currentDrawer].drawer = false;
  const drawers = rooms[roomName].game.drawers;
  if (drawers.length > 0) {
    const nextDrawer = rooms[roomName].game.drawers.pop();
    rooms[roomName].game.drawer = nextDrawer;
    rooms[roomName].players[nextDrawer].drawer = true;
  } else {
    nextRound(roomName);
  }
}

function updateEmojiSet(roomName, emojiSet) {
  updateGameEvent(roomName, "updateEmojiSet");
  rooms[roomName].game.currentEmojiSet.emojiSet = emojiSet;
}

function setGameMode(roomName, mode) {
  rooms[roomName].settings.mode = mode;
}

function makeHint(emojiSet) {
  if (!emojiSet.showLetters) {
    emojiSet.showLetters = [];
  }
  const answerLetters = Array.from(emojiSet.answer);
  const randomLetter = Math.floor(
    Math.random() * Math.floor(answerLetters.length)
  );
  !emojiSet.firstHint && emojiSet.showLetters.push(randomLetter);
  let hintLetters = [];
  answerLetters.map((letter, index) => {
    if (
      (emojiSet.showLetters.includes(index) && !emojiSet.firstHint) ||
      !/[a-z0-9]/gi.test(letter)
    ) {
      hintLetters.push(letter);
    } else {
      hintLetters.push("_");
    }
  });
  emojiSet.firstHint = false;
  emojiSet.hint = hintLetters.join("");
  return emojiSet;
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
    if (getMode(roomName) === GAME_MODES.PICTIONARY) {
      const drawer = rooms[roomName].game.drawer;
      rooms[roomName].players[drawer].score += 2;
    }
  } catch (e) {
    throw new Error("Could not add point", e.message);
  }
};

function resetPoints(roomName) {
  rooms[roomName] &&
    Object.keys(rooms[roomName].players).forEach((playerId) => {
      rooms[roomName].players[playerId].score = 0;
    });
}

function checkGuess(roomName, guess) {
  const ALPHA_NUM_REGEX = /[^a-zA-Z0-9]/g;
  try {
    let answer;
    let correct = false;
    const room = getRoom(roomName);
    if (room.game) {
      answer = room.game.currentEmojiSet.answer;
      correct =
        guess.toLowerCase().replace(ALPHA_NUM_REGEX, "") ===
        answer.toLowerCase().replace(ALPHA_NUM_REGEX, "");
    }
    return correct;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  setEmojis,
  getRoom,
  createRoom,
  addRoom,
  cleanRooms,
  getRooms,
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
  updateHint,
  resetPass,
  addPoint,
  resetPoints,
  checkGuess,
  killRooms,

  setGameMode,
  updateEmojiSet,
  nextDrawer,
};
