const { db } = require("../firebase");

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
function get(roomName) {
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

function create(roomName, roomPassword = "") {
  try {
    const rooms = getAll();
    if (roomName in rooms) {
      throw new Error(`Room ${roomName} already exists.`);
    } else {
      const newRoom = {
        name: roomName,
        password: roomPassword,
        players: {},
        settings: {
          scoreLimit: DEFAULT_SCORE_LIMIT,
          selectedCategories: DEFAULT_SELECTED_CATEGORIES,
          mode: GAME_MODES.CLASSIC,
        },
        lastEvent: { type: "Room created" },
      };
      update(newRoom);
      return rooms[roomName];
    }
  } catch (e) {
    throw e;
  }
}

function update(updatedRoom) {
  try {
    db.collection("rooms").doc(updatedRoom.name).set(updatedRoom);
  } catch (e) {
    console.error(e);
  } finally {
    try {
      rooms[updatedRoom.name] = updatedRoom;
      return rooms[updatedRoom.name];
    } catch (e) {
      throw e;
    }
  }
}

function add(room) {
  rooms = { ...rooms, [room.name]: room };
}

const cleanRooms = () => {
  // Object.keys(rooms).forEach((key) => {
  //   if (Object.keys(rooms[key].players).length === 0) delete rooms[key];
  // });
  // console.log("Rooms left: ", rooms);
  return true;
};

function getAll() {
  return rooms;
}

function killAll() {
  rooms = {};
}

function getEmojis() {
  return emojis;
}

module.exports = {
  setEmojis,
  get,
  create,
  update,
  add,
  cleanRooms,
  getAll,
  getEmojis,
  killAll,
};
