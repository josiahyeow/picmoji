// { players: { arandomsocketid: {name: 'Jack', emoji: ':)'}},
//   settings: { scoreLimit: 10, selectedCategories: ['brands', 'places']}
// }

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
    rooms[roomName] = { players: {}, settings: {} };
    return rooms[roomName];
  }
};

const cleanRooms = () => {
  Object.keys(rooms).forEach((key) => {
    if (Object.keys(rooms[key].players).length == 0) delete rooms[key];
  });
};

// User actions
const addPlayer = (roomName, playerId, { name, emoji }) => {
  rooms[roomName].players[playerId] = { name, emoji };
  return rooms[roomName].players;
};

const removePlayer = (roomName, playerId) => {
  delete rooms[roomName].players[playerId];
  cleanRooms();
};

// Settings actions
const updateScoreLimit = (roomName, newScoreLimit) => {
  rooms[roomName].settings.scoreLimit = newScoreLimit;
};

const updateCategories = (roomName, updatedCategories) => {
  rooms[roomName].settings.selectedCategories = updatedCategories;
};

module.exports = {
  getRoom,
  createRoom,
  cleanRooms,
  addPlayer,
  removePlayer,
  updateScoreLimit,
  updateCategories,
};
