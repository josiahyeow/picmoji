const Rooms = require("./rooms");
const { GAME_MODES } = require("../utils/constants");
const { updateGameEvent } = require("./event");
const Players = require("./players");
const Game = require("./game");

function passEmojiSet(roomName, playerId) {
  try {
    const room = Rooms.get(roomName);
    room.players[playerId].pass = true;
    let pass = true;
    Object.values(room.players).forEach((player) => {
      if (!player.pass) {
        pass = false;
      }
    });
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
    room.players[playerId].score += 1;
    room.game.lastEvent = {
      ...room.players[playerId],
      type: "correct",
    };
    if (room.players[playerId].score === room.settings.scoreLimit) {
      Game.getWinners(roomName);
    }
    if (room.settings.mode === GAME_MODES.PICTIONARY) {
      const drawer = room.game.drawer;
      room.players[drawer].score += 2;
    }
    Rooms.update(roomName);
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
