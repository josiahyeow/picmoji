const socketIO = require("socket.io");
const rooms = require("./data/rooms");

const socket = (server) => {
  const io = socketIO(server, {
    perMessageDeflate: false,
    pingTimeout: 15000,
  });

  function logRoom(room) {
    const lobbyPlayers = Object.keys(room.players).map(
      (playerId) =>
        ` ${room.players[playerId].emoji} ${room.players[playerId].name}`
    );
    const gamePlayers = Object.keys(room.players).map(
      (playerId) =>
        ` ${room.players[playerId].emoji} ${room.players[playerId].name} - ${room.players[playerId].score}, ${room.players[playerId].pass}`
    );
    if (!room.game) {
      console.log(
        `[${room.name}] | lobby | players:${lobbyPlayers} | ${
          room.settings && room.settings.scoreLimit
        }, ${Object.values(room.settings && room.settings.selectedCategories)
          .filter((category) => category.include === true)
          .map((category) => category.name)}`
      );
    } else {
      console.log(
        `[${room.name}] | game | ${
          room.game.lastEvent.type
        } | players: ${gamePlayers} | ${JSON.stringify(
          room.game.currentEmojiSet
        )}`
      );
      if (room.game.winners) {
        console.log(
          `[${room.name}] | game | finished | players:${gamePlayers}`
        );
      }
    }
  }

  function sendRoomUpdate(roomName) {
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
        resetRoom(socket, e);
      }
    });
    socket.on("player-left", (roomName) => {
      try {
        rooms.removePlayer(roomName, socket.id);
        socket.leave(roomName);
        sendRoomUpdate(roomName);
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
        resetRoom(socket, e);
      }
    });

    // Game events
    socket.on("start-game", (roomName) => {
      try {
        rooms.startGame(roomName);
        sendRoomUpdate(roomName);
        io.to(roomName).emit("error-message", "");
      } catch (e) {
        console.error(e.message);
        io.to(roomName).emit("error-message", e.message);
      }
    });

    socket.on("pass-emojiset", (roomName) => {
      try {
        rooms.passEmojiSet(roomName, socket.id);
        const player = rooms.getPlayer(roomName, socket.id);
        io.to(roomName).emit("new-chat-message", {
          text: `${player.name} passed`,
          player: { ...player, emoji: "🙅" },
          correct: false,
          system: true,
        });
        sendRoomUpdate(roomName);
      } catch (e) {
        resetRoom(socket, e);
      }
    });

    const endGame = (roomName) => {
      try {
        rooms.endGame(roomName);
        io.to(roomName).emit("game-ended");
        sendRoomUpdate(roomName);
      } catch (e) {
        resetRoom(socket, e);
      }
    };

    socket.on("end-game", (roomName) => {
      try {
        endGame(roomName);
      } catch (e) {
        resetRoom(socket, e);
      }
    });

    socket.on("send-game-message", (roomName, guess, answer) => {
      try {
        const room = rooms.getRoom(roomName);
        const correct =
          guess.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") ===
          room.game.currentEmojiSet.answer
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, "");

        if (correct) {
          rooms.addPoint(roomName, socket.id);
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
        resetRoom(socket, e);
      }
    });

    // Chat events
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

    socket.on("repair-room", (room) => {
      rooms.addRoom(room);
      io.to(room.name).emit("room-repaired");
    });

    socket.on("kill-rooms", () => {
      rooms.killRooms();
    });
  });
};

module.exports.listen = socket;
