const Rooms = require("../actions/rooms");
const logRoom = require("./log-room");

function sendRoomUpdate(io, roomName) {
  try {
    const room = Rooms.get(roomName);
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
