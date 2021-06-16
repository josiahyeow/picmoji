const Players = require("../actions/players");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");

function playerEvents(io, socket) {
  socket.on("player-joined", ({ room, player }) => {
    const roomName = room.name;
    const roomPassword = room.password || "";
    try {
      socket.join(roomName);
      const createdPlayer = Players.add(
        { roomName, roomPassword },
        socket.id,
        player
      );
      socket.emit("joined-room", createdPlayer);
      io.to(roomName).emit("new-chat-message", {
        text: `${player && player.name} joined, say hello`,
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
      Players.remove(roomName, socket.id);
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
      Players.removeFromAllRooms(socket);
    } catch (e) {
      resetRoom(socket, e);
    }
  });
}

module.exports = playerEvents;
