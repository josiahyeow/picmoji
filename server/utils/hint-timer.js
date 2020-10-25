const Rooms = require("../actions/rooms");
const Game = require("../actions/game");

function hintTimer(roomName, answer, io) {
  try {
    let maxHints = answer.length - Math.floor(answer.length / 2);
    let hintsLeft = maxHints;
    const timer = setInterval(() => {
      const room = Rooms.get(roomName);
      let currentEmojiSet;
      if (room.game) {
        currentEmojiSet = room.game.currentEmojiSet.answer;
      }
      if (hintsLeft <= 0 || currentEmojiSet !== answer || !room.game) {
        clearInterval(timer);
      } else if (hintsLeft < maxHints) {
        const hint = Game.updateHint(roomName);
        io.to(roomName).emit("hint-update", hint);
      }
      hintsLeft -= 1;
    }, 10000);
    return timer;
  } catch (e) {
    console.error(e);
  }
}

module.exports = hintTimer;
