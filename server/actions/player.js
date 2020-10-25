const { getAll, get, update } = require("./rooms");
const { GAME_MODES } = require("../utils/constants");
const { updateGameEvent } = require("./event");
const Players = require("./players");
const Game = require("./game");

const removeFromAllRooms = (socket) => {
  const rooms = getAll();
  const getUserRooms = (socket) => {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.players[socket.id] != null) names.push(name);
      return names;
    }, []);
  };

  try {
    getUserRooms(socket).forEach((roomName) => {
      try {
        Players.remove(roomName, socket.id);
      } finally {
        socket.to(roomName).emit("room-update", rooms[roomName]);
      }
    });
  } catch (e) {
    return true;
  }
};

function passEmojiSet(roomName, playerId) {
  try {
    const room = get(roomName);
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
    update(room);
    return pass;
  } catch (e) {
    console.error(e);
    throw new Error("Could not pass emoji set", e);
  }
}

function addPoint(roomName, playerId) {
  try {
    const room = get(roomName);
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
    update(roomName);
  } catch (e) {
    console.log(e);
    throw new Error("Could not add point", e.message);
  }
}

module.exports = {
  removeFromAllRooms,
  passEmojiSet,
  addPoint,
};
