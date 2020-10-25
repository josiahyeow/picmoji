const { getRoom, updateRoom } = require("../data/rooms");

function updateGameEvent(roomName, event) {
  const room = getRoom(roomName);
  if (room.game) {
    room.game.lastEvent = { type: event };
  } else {
    room.lastEvent = { type: event };
  }
  updateRoom(room);
}

module.exports = {
  updateGameEvent,
};
