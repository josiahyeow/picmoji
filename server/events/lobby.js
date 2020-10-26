const Rooms = require("../actions/rooms");
const Players = require("../actions/players");
const Settings = require("../actions/settings");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");

function lobbyEvents(io, socket) {
  socket.on("update-setting", (roomName, setting, value) => {
    try {
      if (setting === "scoreLimit") {
        Settings.updateScoreLimit(roomName, value);
      }
      if (setting === "categories") {
        Settings.updateCategories(roomName, value);
      }
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("send-chat-message", (roomName, message) => {
    try {
      Rooms.get(roomName);

      if (message === "/pictionary") {
        Settings.setGameMode(roomName, "pictionary");
        io.to(roomName).emit("new-chat-message", {
          text: "Game mode set to pictionary",
          player: { emoji: "✏", name: "BOT" },
          correct: false,
          system: true,
        });
      }
      if (message === "/classic") {
        Settings.setGameMode(roomName, "classic");
        io.to(roomName).emit("new-chat-message", {
          text: "Game mode set to classic",
          player: { emoji: "👋", name: "BOT" },
          correct: false,
          system: true,
        });
      }

      io.to(roomName).emit("new-chat-message", {
        text: message,
        player: Players.get(roomName, socket.id),
      });
    } catch (e) {
      resetRoom(socket, e);
    }
  });
}

module.exports = lobbyEvents;
