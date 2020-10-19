const rooms = require("../data/rooms");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");
const hintTimer = require("../utils/hint-timer");

function gameEvents(io, socket) {
  socket.on("start-game", (roomName) => {
    try {
      rooms.startGame(roomName);
      hintTimer(
        roomName,
        rooms.getRoom(roomName).game.currentEmojiSet.answer,
        io
      );
      sendRoomUpdate(io, roomName);
      io.to(roomName).emit("error-message", "");
    } catch (e) {
      console.error(e.message);
      io.to(roomName).emit("error-message", e.message);
    }
  });

  socket.on("end-game", (roomName) => {
    try {
      rooms.endGame(roomName);
      io.to(roomName).emit("game-ended");
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("pass-emojiset", (roomName) => {
    try {
      const passed = rooms.passEmojiSet(roomName, socket.id);
      const player = rooms.getPlayer(roomName, socket.id);
      io.to(roomName).emit("new-chat-message", {
        text: `${player.name} passed`,
        player: { ...player, emoji: "🙅" },
        correct: false,
        system: true,
      });
      if (passed) {
        const room = rooms.getRoom(roomName);
        room.game && hintTimer(roomName, room.game.currentEmojiSet.answer, io);
      }
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("send-game-message", (roomName, guess) => {
    try {
      let answer;
      let correct = false;
      const room = rooms.getRoom(roomName);
      if (room.game) {
        answer = room.game.currentEmojiSet.answer;
        correct =
          guess.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") ===
          answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      }
      if (correct) {
        rooms.addPoint(roomName, socket.id);
        if (room.game) {
          const emojiSet = rooms.nextEmojiSet(roomName, io);
          hintTimer(roomName, emojiSet.answer, io);
          sendRoomUpdate(io, roomName);
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
}

module.exports = gameEvents;
