const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const path = require("path");
const rooms = require("./rooms/rooms");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

const io = socketIO(server);

app.get("/room", (req, res) => {
  const roomName = req.query.roomName;
  try {
    const room = rooms.getRoom(roomName);
    res.status(200).send({ room });
  } catch (e) {
    res.status(404).send({ error: `Could not get room. ${e}` });
  }
});

app.post("/room", (req, res) => {
  const roomName = req.body.roomName;
  try {
    rooms.createRoom(roomName);
    res.status(200).send({ success: `Room created: ${roomName}` });
  } catch (e) {
    res.status(409).send({ error: `Could not create room. ${e}` });
  }
});

app.post("/join", (req, res) => {
  const roomName = req.body.roomName;
  try {
    rooms.getRoom(roomName);
    res.status(200).send({ success: `Room ${roomName} found, joining...` });
  } catch (e) {
    res.status(404).send({ error: `Could not join room. ${e}` });
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

io.on("connection", (socket) => {
  socket.on("new-player", (room, player) => {
    console.log("new player", room, player.name);
    socket.join(room);
    const updatedPlayers = rooms.addPlayer(room, socket.id, player);
    io.to(room).emit("player-joined", player.name, updatedPlayers);
  });
  socket.on("player-left", (roomName, player) => {
    console.log(`${player.name} left room ${roomName}`);
    const updatedPlayers = rooms.removePlayer(roomName, socket.id);
    io.to(roomName).emit("player-left", player.name, updatedPlayers);
  });
  socket.on("disconnect", () => {
    rooms.removePlayerFromAllRooms(socket);
  });

  // Settings events
  socket.on("update-setting", (room, setting, value, action) => {
    if (setting === "scoreLimit") {
      rooms.updateScoreLimit(room, value);
    }
    if (setting === "categories") {
      rooms.updateCategories(room, value);
    }
    io.to(room).emit("setting-updated", setting, value);
  });

  // Game events
  socket.on("start-game", (roomName) => {
    const game = rooms.startGame(roomName);
    io.to(roomName).emit("game-started", game);
  });

  socket.on("send-game-message", (roomName, guess, answer) => {
    if (guess.toLowerCase() === answer.toLowerCase()) {
      const players = rooms.addPoint(roomName, socket.id);
      io.to(roomName).emit("updated-scores", players);
      const emojiSet = rooms.getEmojiSet(roomName);
      if (emojiSet) {
        io.to(roomName).emit("new-emojiset", emojiSet);
      } else {
        endGame(roomName);
      }
    }
    io.to(roomName).emit("new-chat-message", {
      text: guess,
      player: rooms.getPlayer(roomName, socket.id),
      correct: guess === answer,
    });
  });

  const endGame = (roomName) => {
    io.to(roomName).emit("game-ended");
    const players = rooms.resetPoints(roomName);
    io.to(roomName).emit("updated-scores", players);
  };

  // Chat events
  socket.on("send-chat-message", (roomName, message) => {
    console.log(roomName, message);
    io.to(roomName).emit("new-chat-message", {
      text: message,
      player: rooms.getPlayer(roomName, socket.id),
    });
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
