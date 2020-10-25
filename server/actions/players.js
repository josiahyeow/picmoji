const Rooms = require("./rooms");
const { updateGameEvent } = require("./event");

function add(roomName, playerId, { name, emoji }) {
  try {
    const room = Rooms.get(roomName);
    room.players[playerId] = {
      name,
      emoji,
      score: 0,
      pass: false,
      host: false,
    };
    setHost(roomName, playerId);
    updateGameEvent(roomName, "player-joined");
    Rooms.update(room);
    return room.players;
  } catch (e) {
    throw e;
  }
}

function get(roomName, playerId) {
  const room = Rooms.get(roomName);
  return room.players[playerId];
}

function remove(roomName, playerId) {
  try {
    const room = Rooms.get(roomName);
    const player = get(roomName, playerId);
    delete room.players[playerId];
    if (player.host) setHost(roomName);
    updateGameEvent(roomName, "player-left");
    Rooms.update(room);
    return room.players;
  } catch (e) {
    return true;
  }
}

function setHost(roomName) {
  const room = Rooms.get(roomName);
  const hostExists = Object.values(room.players).find(
    (player) => player.host === true
  );
  const randomPlayerId = Object.keys(room.players).pop();
  if (!hostExists) {
    room.players[randomPlayerId].host = true;
  } else {
    room.players[randomPlayerId].host = false;
  }
  Rooms.update(room);
}

function resetPass(roomName) {
  const room = Rooms.get(roomName);
  Object.values(room.players).forEach((player) => {
    player.pass = false;
  });
  Rooms.update(room);
}

function resetPoints(roomName) {
  const room = Rooms.get(roomName);
  room &&
    Object.keys(room.players).forEach((playerId) => {
      room.players[playerId].score = 0;
    });
  Rooms.update(room);
}

module.exports = {
  add,
  get,
  remove,
  setHost,
  resetPass,
  resetPoints,
};
