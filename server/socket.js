const socketIO = require("socket.io");
const rooms = require("./data/rooms");

const socket = (server) => {
  const io = socketIO(server, {
    perMessageDeflate: false,
    pingTimeout: 15000,
  });

  function sendRoomUpdate(roomName) {
    try {
      const room = rooms.getRoom(roomName);
      console.log(room);
      io.to(roomName).emit("room-update", room);
    } catch (e) {
      console.error(e.message);
    }
  }

  function resetRoom(roomName, error) {
    console.error(error.message);
    io.to(roomName).emit("room-disconnected", { error: error.message });
  }

  io.on("connection", (socket) => {
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
        sendRoomUpdate(roomName);
      } catch (e) {
        resetRoom(roomName, e);
      }
    });
    socket.on("player-left", (roomName) => {
      try {
        rooms.removePlayer(roomName, socket.id);
        socket.leave(roomName);
        sendRoomUpdate(roomName);
      } catch (e) {
        resetRoom(roomName, e);
      }
    });
    socket.on("disconnect", () => {
      try {
        rooms.removePlayerFromAllRooms(socket);
      } catch (e) {
        resetRoom(roomName, e);
      }
    });

    // Settings events
    socket.on("update-setting", (roomName, setting, value) => {
      try {
        if (setting === "scoreLimit") {
          rooms.updateScoreLimit(roomName, value);
        }
        if (setting === "categories") {
          rooms.updateCategories(roomName, value);
        }
        sendRoomUpdate(roomName);
      } catch (e) {
        resetRoom(roomName, e);
      }
    });

    // Game events
    socket.on("start-game", (roomName) => {
      try {
        rooms.startGame(roomName);
        sendRoomUpdate(roomName);
      } catch (e) {
        resetRoom(roomName, e);
      }
    });

    socket.on("pass-emojiset", (roomName) => {
      try {
        rooms.passEmojiSet(roomName, socket.id);
        const player = rooms.getPlayer(roomName, socket.id);
        io.to(roomName).emit("new-chat-message", {
          text: `${player.name} passed emojiset`,
          player: { ...player, emoji: "🙅" },
          correct: false,
          system: true,
        });
        sendRoomUpdate(roomName);
      } catch (e) {
        resetRoom(roomName, e);
      }
    });

    const endGame = (roomName) => {
      try {
        rooms.endGame(roomName);
        io.to(roomName).emit("game-ended");
        sendRoomUpdate(roomName);
      } catch (e) {
        resetRoom(roomName, e);
      }
    };

    socket.on("end-game", (roomName) => {
      try {
        endGame(roomName);
      } catch (e) {
        resetRoom(roomName, e);
      }
    });

    socket.on("send-game-message", (roomName, guess, answer) => {
      try {
        const correct =
          guess.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") ===
          answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");

        if (correct && !rooms.emojiSetDeciphered(roomName, socket.id)) {
          rooms.addPoint(roomName, socket.id);
          const room = rooms.getRoom(roomName);
          if (room.game) {
            rooms.nextEmojiSet(roomName);
            io.to(roomName).emit("emoji-guessed");
            sendRoomUpdate(roomName);
          } else {
            rooms.getWinners(roomName);
          }
        }
        io.to(roomName).emit("new-chat-message", {
          text: guess,
          player: rooms.getPlayer(roomName, socket.id),
          correct,
        });
      } catch (e) {
        resetRoom(roomName, e);
      }
    });

    // Chat events
    socket.on("send-chat-message", (roomName, message) => {
      try {
        io.to(roomName).emit("new-chat-message", {
          text: message,
          player: rooms.getPlayer(roomName, socket.id),
        });
      } catch (e) {
        resetRoom(roomName, e);
      }
    });
  });
};

module.exports.listen = socket;
