const rooms = require("../data/rooms");
const { resetRoom, sendRoomUpdate } = require("../utils/update-room");

function pictionaryEvents(io, socket) {
  socket.on("send-game-emoji", (roomName, emojiSet) => {
    try {
      rooms.updateEmojiSet(roomName, emojiSet);
      io.to(roomName).emit("new-game-emoji", emojiSet);
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });
}

module.exports = pictionaryEvents;
