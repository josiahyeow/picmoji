var _ = require("lodash");
const { getRoom, updateRoom, getEmojis } = require("../data/rooms");
const { updateGameEvent } = require("./event");
const Settings = require("./settings");
const Players = require("./players");

const { GAME_MODES } = require("../utils/constants");

function filterEmojis(selectedCategories) {
  const emojis = getEmojis();
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
}

function start(roomName) {
  try {
    const room = getRoom(roomName);
    const categorySelected = Object.values(
      room.settings.selectedCategories
    ).find((category) => category.include === true);
    if (!categorySelected) {
      throw new Error("Please include at least 1 category to start the game.");
    }
    const gameEmojiSets = filterEmojis(room.settings.selectedCategories);
    room.game = {
      emojiSets: gameEmojiSets,
      scoreLimit: room.settings.scoreLimit,
      lastEvent: { type: "start" },
    };
    const mode = room.settings.mode;
    nextEmojiSet(roomName);
    if (mode === GAME_MODES.PICTIONARY) {
      initialiseDrawers(roomName);
      nextDrawer(roomName);
    }
    updateRoom(room);
    return room.game;
  } catch (e) {
    throw e;
  }
}

function end(roomName) {
  const room = getRoom(roomName);
  Players.resetPoints(roomName);
  Players.resetPass(roomName);
  if (room) {
    room.game = null;
  }
  updateRoom(room);
}

function getWinners(roomName) {
  const room = getRoom(roomName);
  const winners = Object.values(room.players)
    .sort((a, b) => {
      if (a.score > b.score) return -1;
      if (b.score > a.score) return 1;
      return 0;
    })
    .slice(0, 4);
  room.game.winners = winners;
  updateRoom(room);
  return winners;
}

function nextEmojiSet(roomName) {
  Players.resetPass(roomName);
  const room = getRoom(roomName);
  const randomEmojiSet = room.game.emojiSets.pop();
  randomEmojiSet.firstHint = true;
  const emojiSet = makeHint(randomEmojiSet);

  if (room.game.currentEmojiSet) {
    room.game.previousEmojiSet = room.game.currentEmojiSet;
  } else {
    room.game.previousEmojiSet = {
      emojiSet: "",
      answer: "",
      hint: "",
      category: "",
    };
  }
  if (Settings.getMode(roomName) === GAME_MODES.PICTIONARY) {
    emojiSet.emojiSet = "";
  }
  room.game.currentEmojiSet = emojiSet;
  updateRoom(room);
  return emojiSet;
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

function updateHint(roomName) {
  try {
    const room = getRoom(roomName);
    if (room.game) {
      const emojiSet = room.game.currentEmojiSet;
      const hint = makeHint(emojiSet).hint;
      updateRoom(room);
      return hint;
    }
  } catch (e) {
    throw e;
  }
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

// PICTIONARY ACTIONS

function nextRound(roomName) {
  const room = getRoom(roomName);
  room.game.round += 1;
  initialiseDrawers(roomName);
  nextDrawer(roomName);
  updateRoom(room);
}

function initialiseDrawers(roomName) {
  const room = getRoom(roomName);
  room.game.drawers = Object.keys(room.players);
  updateRoom(room);
}

function nextDrawer(roomName) {
  const room = getRoom(roomName);
  const currentDrawer = room.game.drawer;
  if (currentDrawer) room.players[currentDrawer].drawer = false;
  const drawers = room.game.drawers;
  if (drawers.length > 0) {
    const nextDrawer = room.game.drawers.pop();
    room.game.drawer = nextDrawer;
    room.players[nextDrawer].drawer = true;
  } else {
    nextRound(roomName);
  }
  updateRoom(room);
}

function updateEmojiSet(roomName, emojiSet) {
  const room = getRoom(roomName);
  updateGameEvent(roomName, "updateEmojiSet");
  room.game.currentEmojiSet.emojiSet = emojiSet;
  updateRoom(room);
}

module.exports = {
  start,
  end,
  nextEmojiSet,
  getWinners,
  updateHint,
  checkGuess,
  updateEmojiSet,
  nextDrawer,
};
