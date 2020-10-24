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

      if (message === "/pictionary") {
        rooms.setGameMode(roomName, "pictionary");
        io.to(roomName).emit("new-chat-message", {
          text: "Game mode set to pictionary",
          player: { emoji: "👋", name: "BOT" },
          correct: false,
          system: true,
        });
      }
      if (message === "/classic") {
        rooms.setGameMode(roomName, "classic");
        io.to(roomName).emit("new-chat-message", {
          text: "Game mode set to classic",
          player: { emoji: "👋", name: "BOT" },
          correct: false,
          system: true,
        });
      }

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
