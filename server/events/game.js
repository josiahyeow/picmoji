const rooms = require("../data/rooms");
const Game = require("../actions/game");
const Player = require("../actions/player");
const Players = require("../actions/players");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");
const hintTimer = require("../utils/hint-timer");

function gameEvents(io, socket) {
  socket.on("start-game", (roomName) => {
    try {
      Game.start(roomName);
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
      Game.end(roomName);
      io.to(roomName).emit("game-ended");
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("pass-emojiset", (roomName) => {
    try {
      const allPassed = Player.passEmojiSet(roomName, socket.id);
      const player = Players.get(roomName, socket.id);
      io.to(roomName).emit("new-chat-message", {
        text: `${player.name} passed`,
        player: { ...player, emoji: "🙅" },
        correct: false,
        system: true,
      });
      if (allPassed) {
        Game.nextEmojiSet(roomName);
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
      const correct = Game.checkGuess(roomName, guess);
      if (correct) {
        Player.addPoint(roomName, socket.id);
        if (rooms.getRoom(roomName).settings.mode === "pictionary") {
          Game.nextDrawer(roomName);
        }
        const emojiSet = Game.nextEmojiSet(roomName);
        hintTimer(roomName, emojiSet.answer, io);
        sendRoomUpdate(io, roomName);
      }
      io.to(roomName).emit("new-chat-message", {
        text: guess,
        player: Players.get(roomName, socket.id),
        correct,
      });
    } catch (e) {
      resetRoom(socket, e);
    }
  });
}

module.exports = gameEvents;
