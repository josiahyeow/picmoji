const Rooms = require("./rooms");
const { updateGameEvent } = require("./event");

function add({ roomName, roomPassword = "" }, playerId, { name, emoji }) {
  try {
    const room = Rooms.get(roomName);
    if (room.password !== roomPassword) {
      throw new Error("Password is incorrect.");
    }
    const oldPlayer = Object.values(room.players).find(
      (player) => player.name === name
    );
    if (oldPlayer) {
      room.players[playerId] = { ...oldPlayer, id: playerId };
      remove(roomName, oldPlayer.id);
    } else {
      room.players[playerId] = {
        id: playerId,
        name,
        emoji,
        score: 0,
        pass: false,
        host: false,
      };
    }
    setHost(roomName, playerId);
    updateGameEvent(roomName, "player-joined");
    Rooms.update(room);
    return get(roomName, playerId);
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

function kick(roomName, playerName) {
  try {
    const players = Rooms.get(roomName).players;
    const playerId = Object.keys(players).find(
      (key) => players[key].name === playerName
    );
    if (playerId) {
      remove(roomName, playerId);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw e;
  }
}

const removeFromAllRooms = (socket) => {
  const rooms = Rooms.getAll();
  const getUserRooms = (socket) => {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.players[socket.id] != null) names.push(name);
      return names;
    }, []);
  };

  try {
    getUserRooms(socket).forEach((roomName) => {
      try {
        remove(roomName, socket.id);
      } finally {
        socket.to(roomName).emit("room-update", rooms[roomName]);
      }
    });
  } catch (e) {
    return true;
  }
};

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

function resetDrawer(roomName) {
  const room = Rooms.get(roomName);
  Object.values(room.players).forEach((player) => {
    player.drawer = false;
  });
  Rooms.update(room);
}

module.exports = {
  add,
  get,
  remove,
  kick,
  removeFromAllRooms,
  setHost,
  resetPass,
  resetPoints,
  resetDrawer,
};
