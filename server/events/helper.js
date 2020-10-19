const rooms = require("../data/rooms");

function helperEvents(io, socket) {
  socket.on("repair-room", (room) => {
    rooms.addRoom(room);
    io.to(room.name).emit("room-repaired");
  });

  socket.on("kill-rooms", () => {
    rooms.killRooms();
  });
}

module.exports = helperEvents;
