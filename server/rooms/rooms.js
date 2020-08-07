const rooms = {};

// Room actions
const getRoom = (roomName) => {
  if (roomName in rooms) {
    return rooms[roomName];
  } else {
    throw new Error(`Room ${roomName} could not be found.`);
  }
};

const createRoom = (roomName) => {
  if (roomName in rooms) {
    throw new Error(`Room ${roomName} already exists.`);
  } else {
    rooms[roomName] = { players: {} };
    return rooms[roomName];
  }
};

const cleanRooms = () => {
  Object.keys(rooms).forEach((key) => {
    if (Object.keys(rooms[key].players).length == 0) delete rooms[key];
  });
};

// User actions
const addPlayer = (roomName, playerId, playerName) => {
  rooms[roomName].players[playerId] = playerName;
  return rooms[roomName].players;
};

const removePlayer = (roomName, playerId) => {
  delete rooms[roomName].players[playerId];
  cleanRooms();
};

module.exports = {
  getRoom,
  createRoom,
  addPlayer,
  removePlayer,
  cleanRooms,
};
