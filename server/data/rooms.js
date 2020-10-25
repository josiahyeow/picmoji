const {
  DEFAULT_SCORE_LIMIT,
  DEFAULT_SELECTED_CATEGORIES,
  GAME_MODES,
} = require("../utils/constants");

let emojis = {};
let rooms = {};

function setEmojis(fetchedEmojis) {
  emojis.emojiSets = fetchedEmojis;
}

// Room actions
function getRoom(roomName) {
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
}

function createRoom(roomName) {
  try {
    const rooms = getRooms();
    if (roomName in rooms) {
      throw new Error(`Room ${roomName} already exists.`);
    } else {
      const newRoom = {
        name: roomName,
        players: {},
        settings: {
          scoreLimit: DEFAULT_SCORE_LIMIT,
          selectedCategories: DEFAULT_SELECTED_CATEGORIES,
          mode: GAME_MODES.CLASSIC,
        },
        lastEvent: { type: "Room created" },
      };
      updateRoom(newRoom);
      return rooms[roomName];
    }
  } catch (e) {
    throw e;
  }
}

function updateRoom(updatedRoom) {
  try {
    rooms[updatedRoom.name] = updatedRoom;
    return rooms[updatedRoom.name];
  } catch (e) {
    throw e;
  }
}

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

function getEmojis() {
  return emojis;
}

module.exports = {
  setEmojis,
  getRoom,
  createRoom,
  updateRoom,
  addRoom,
  cleanRooms,
  getRooms,
  getEmojis,
  killRooms,
};
