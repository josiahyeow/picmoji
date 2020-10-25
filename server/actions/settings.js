const { getRoom, updateRoom } = require("../data/rooms");
const { updateGameEvent } = require("./event");

function getMode(roomName) {
  const room = getRoom(roomName);
  return room.settings.mode;
}

function setGameMode(roomName, mode) {
  const room = getRoom(roomName);
  room.settings.mode = mode;
  updateRoom(room);
}

const updateScoreLimit = (roomName, newScoreLimit) => {
  const room = getRoom(roomName);
  room.settings.scoreLimit = Number(newScoreLimit);
  updateGameEvent(roomName, "score-limit-updated");
  updateRoom(room);
};

const updateCategories = (roomName, updatedCategories) => {
  const room = getRoom(roomName);
  room.settings.selectedCategories = updatedCategories;
  updateGameEvent(roomName, "categories-updated");
  updateRoom(room);
};

module.exports = { getMode, setGameMode, updateScoreLimit, updateCategories };
