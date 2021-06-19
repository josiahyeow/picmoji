const Rooms = require("./rooms");
const { GAME_MODES } = require("../utils/constants");
const { updateGameEvent } = require("./event");
const Players = require("./players");
const Game = require("./game");

function passEmojiSet(roomName, playerId) {
  try {
    const room = Rooms.get(roomName);
    room.players[playerId].pass = true;
    let pass = false;
    let passedPlayers = 0;
    Object.values(room.players).forEach((player) => {
      if (player.pass) {
        passedPlayers += 1;
      }
    });
    if (
      passedPlayers >= Math.round((Object.keys(room.players).length - 1) * 0.75)
    ) {
      pass = true;
    }
    if (pass) {
      Players.resetPass(roomName);
      updateGameEvent(roomName, "pass");
    } else {
      updateGameEvent(roomName, "pass-request");
    }
    Rooms.update(room);
    return pass;
  } catch (e) {
    console.error(e);
    throw new Error("Could not pass emoji set", e);
  }
}

function addPoint(roomName, playerId) {
  try {
    const room = Rooms.get(roomName);
    if (room.settings.mode === GAME_MODES.CLASSIC) {
      room.players[playerId].score += 1;
      if (room.players[playerId].score === room.settings.scoreLimit) {
        Game.getWinners(roomName);
      }
      room.game.lastEvent = {
        ...room.players[playerId],
        type: "correct",
      };
    }
    if (room.settings.mode === GAME_MODES.SKRIBBL) {
      const points = room.game.timeLeft * 0.3 * 100;
      room.players[playerId].guessed = true;
      room.players[playerId].score += points;
      room.game.lastEvent = {
        ...room.players[playerId],
        type: "guessed",
      };
    }
    if (room.settings.mode === GAME_MODES.PICTIONARY) {
      const drawer = room.game.drawer;
      room.players[drawer].score += 2;
      room.game.lastEvent = {
        ...room.players[playerId],
        type: "correct",
      };
    }
    Rooms.update(room);
  } catch (e) {
    console.log(e);
    throw new Error("Could not add point", e.message);
  }
}

function isHost(roomName, playerId) {
  try {
    return Rooms.get(roomName).players[playerId].host;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  passEmojiSet,
  addPoint,
  isHost,
};
