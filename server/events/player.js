const rooms = require("../data/rooms");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");

function playerEvents(io, socket) {
  socket.on("new-player", (roomName, player) => {
    try {
      socket.join(roomName);
      rooms.addPlayer(roomName, socket.id, player);
      socket.emit("joined-room", socket.id);
      io.to(roomName).emit("new-chat-message", {
        text: `${player.name} joined, say hello`,
        player: { emoji: "👋", name: "BOT" },
        correct: false,
        system: true,
      });
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("player-left", (roomName, player) => {
    try {
      rooms.removePlayer(roomName, socket.id);
      socket.leave(roomName);
      io.to(roomName).emit("new-chat-message", {
        text: `${player.name} left, adios`,
        player: { emoji: "🏃‍♂️", name: "BOT" },
        correct: false,
        system: true,
      });
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("disconnect", () => {
    try {
      rooms.removePlayerFromAllRooms(socket);
    } catch (e) {
      resetRoom(socket, e);
    }
  });
}

module.exports = playerEvents;
