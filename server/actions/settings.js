const { get, update } = require("../actions/rooms");
const { updateGameEvent } = require("./event");

function getMode(roomName) {
  const room = get(roomName);
  return room.settings.mode;
}

function setGameMode(roomName, mode) {
  const room = get(roomName);
  room.settings.mode = mode;
  update(room);
}

const updateScoreLimit = (roomName, newScoreLimit) => {
  const room = get(roomName);
  room.settings.scoreLimit = Number(newScoreLimit);
  updateGameEvent(roomName, "score-limit-updated");
  update(room);
};

const updateCategories = (roomName, updatedCategories) => {
  const room = get(roomName);
  room.settings.selectedCategories = updatedCategories;
  updateGameEvent(roomName, "categories-updated");
  update(room);
};

module.exports = { getMode, setGameMode, updateScoreLimit, updateCategories };
