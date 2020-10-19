const socketIO = require("socket.io");
const playerEvents = require("./events/player");
const lobbyEvents = require("./events/lobby");
const gameEvents = require("./events/game");
const helperEvents = require("./events/helper");

const socket = (server) => {
  const io = socketIO(server, {
    perMessageDeflate: false,
    pingTimeout: 15000,
  });

  io.on("connection", (socket) => {
    playerEvents(io, socket);
    lobbyEvents(io, socket);
    gameEvents(io, socket);
    helperEvents(io, socket);
  });
};

module.exports.listen = socket;
