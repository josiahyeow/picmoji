const rooms = require("../data/rooms");
const logRoom = require("./log-room");

function sendRoomUpdate(io, roomName) {
  try {
    const room = rooms.getRoom(roomName);
    logRoom(room);
    io.to(roomName).emit("room-update", room);
  } catch (e) {
    console.error(e);
  }
}

function resetRoom(socket, error) {
  console.error(error);
  socket.emit("room-disconnected", { error: error.message });
}

module.exports = { sendRoomUpdate, resetRoom };
