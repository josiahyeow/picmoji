const { getRoom, updateRoom } = require("../data/rooms");
const { updateGameEvent } = require("./event");

function add(roomName, playerId, { name, emoji }) {
  try {
    const room = getRoom(roomName);
    room.players[playerId] = {
      name,
      emoji,
      score: 0,
      pass: false,
      host: false,
    };
    setHost(roomName, playerId);
    updateGameEvent(roomName, "player-joined");
    updateRoom(room);
    return room.players;
  } catch (e) {
    throw e;
  }
}

function get(roomName, playerId) {
  const room = getRoom(roomName);
  return room.players[playerId];
}

function remove(roomName, playerId) {
  try {
    const room = getRoom(roomName);
    const player = get(roomName, playerId);
    delete room.players[playerId];
    if (player.host) setHost(roomName);
    updateGameEvent(roomName, "player-left");
    updateRoom(room);
    return room.players;
  } catch (e) {
    return true;
  }
}

function setHost(roomName) {
  const room = getRoom(roomName);
  const hostExists = Object.values(room.players).find(
    (player) => player.host === true
  );
  const randomPlayerId = Object.keys(room.players).pop();
  if (!hostExists) {
    room.players[randomPlayerId].host = true;
  } else {
    room.players[randomPlayerId].host = false;
  }
  updateRoom(room);
}

function resetPass(roomName) {
  const room = getRoom(roomName);
  Object.values(room.players).forEach((player) => {
    player.pass = false;
  });
  updateRoom(room);
}

function resetPoints(roomName) {
  const room = getRoom(roomName);
  room &&
    Object.keys(room.players).forEach((playerId) => {
      room.players[playerId].score = 0;
    });
  updateRoom(room);
}

module.exports = {
  add,
  get,
  remove,
  setHost,
  resetPass,
  resetPoints,
};
