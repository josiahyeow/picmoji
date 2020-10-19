const rooms = require("../data/rooms");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");

function lobbyEvents(io, socket) {
  socket.on("update-setting", (roomName, setting, value) => {
    try {
      if (setting === "scoreLimit") {
        rooms.updateScoreLimit(roomName, value);
      }
      if (setting === "categories") {
        rooms.updateCategories(roomName, value);
      }
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("send-chat-message", (roomName, message) => {
    try {
      rooms.getRoom(roomName);
      io.to(roomName).emit("new-chat-message", {
        text: message,
        player: rooms.getPlayer(roomName, socket.id),
      });
    } catch (e) {
      resetRoom(socket, e);
    }
  });
}

module.exports = lobbyEvents;
