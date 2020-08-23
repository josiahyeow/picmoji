const socketIO = require("socket.io");
const rooms = require("./data/rooms");

const socket = (server) => {
  const io = socketIO(server);

  function sendRoomUpdate(roomName) {
    try {
      const room = rooms.getRoom(roomName);
      console.log(room);
      io.to(roomName).emit("room-update", room);
    } catch (e) {
      console.error(e);
    }
  }

  io.on("connection", (socket) => {
    socket.on("new-player", (roomName, player) => {
      socket.join(roomName);
      rooms.addPlayer(roomName, socket.id, player);
      sendRoomUpdate(roomName);
    });
    socket.on("player-left", (roomName) => {
      rooms.removePlayer(roomName, socket.id);
      socket.leave(roomName);
      sendRoomUpdate(roomName);
    });
    socket.on("disconnect", () => {
      rooms.removePlayerFromAllRooms(socket);
    });

    // Settings events
    socket.on("update-setting", (roomName, setting, value) => {
      if (setting === "scoreLimit") {
        rooms.updateScoreLimit(roomName, value);
      }
      if (setting === "categories") {
        rooms.updateCategories(roomName, value);
      }
      sendRoomUpdate(roomName);
    });

    // Game events
    socket.on("start-game", (roomName) => {
      rooms.startGame(roomName);
      sendRoomUpdate(roomName);
    });

    socket.on("pass-emojiset", (roomName) => {
      rooms.passEmojiSet(roomName, socket.id);
      sendRoomUpdate(roomName);
    });

    const endGame = (roomName) => {
      rooms.endGame(roomName);
      io.to(roomName).emit("game-ended");
      sendRoomUpdate(roomName);
    };

    socket.on("end-game", (roomName) => {
      endGame(roomName);
    });

    socket.on("send-game-message", (roomName, guess, answer) => {
      const correct =
        guess.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") ===
        answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      if (correct) {
        rooms.addPoint(roomName, socket.id);
        const room = rooms.getRoom(roomName);
        if (room.game) {
          rooms.nextEmojiSet(roomName);
          io.to(roomName).emit("emoji-guessed");
          sendRoomUpdate(roomName);
        } else {
          const winners = rooms.getWinners(roomName);
          io.to(roomName).emit("winners", winners);
        }
      }
      io.to(roomName).emit("new-chat-message", {
        text: guess,
        player: rooms.getPlayer(roomName, socket.id),
        correct,
      });
    });

    // Chat events
    socket.on("send-chat-message", (roomName, message) => {
      io.to(roomName).emit("new-chat-message", {
        text: message,
        player: rooms.getPlayer(roomName, socket.id),
      });
    });
  });
};

module.exports.listen = socket;
