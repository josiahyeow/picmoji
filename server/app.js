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

app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

function sendRoomUpdate(roomName) {
  const room = rooms.getRoom(roomName);
  console.log(room);
  io.to(roomName).emit("room-update", room);
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

  socket.on("send-game-message", (roomName, guess, answer) => {
    const correct =
      guess.toLowerCase().replace(/\s/g, "") ===
      answer.toLowerCase().replace(/\s/g, "");
    if (correct) {
      rooms.addPoint(roomName, socket.id);
      const room = rooms.getRoom(roomName);
      if (room.game) {
        rooms.nextEmojiSet(roomName);
        sendRoomUpdate(roomName);
      } else {
        endGame(roomName);
      }
    }
    io.to(roomName).emit("new-chat-message", {
      text: guess,
      player: rooms.getPlayer(roomName, socket.id),
      correct,
    });
  });

  const endGame = (roomName) => {
    rooms.resetPoints(roomName);
    io.to(roomName).emit("game-ended");
    sendRoomUpdate(roomName);
  };

  // Chat events
  socket.on("send-chat-message", (roomName, message) => {
    io.to(roomName).emit("new-chat-message", {
      text: message,
      player: rooms.getPlayer(roomName, socket.id),
    });
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
