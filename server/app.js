const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const path = require("path");

const port = process.env.PORT || 5000;
const index = require("./routes/index");

const app = express();
app.use(cors());
// app.use(index);
app.use(express.static(path.join(__dirname, "build")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

const io = socketIO(server);

let rooms = {};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/room", (req, res) => {
  const roomName = req.query.roomName;
  if (roomName in rooms) {
    res.status(200).send({ room: rooms[roomName] });
  } else {
    res.status(404).send({ error: `Room ${roomName} not found` });
  }
});

app.post("/room", (req, res) => {
  const roomName = req.body.roomName;
  console.log(rooms);
  if (roomName in rooms) {
    res.status(409).send({ message: `Room ${roomName} already exists` });
  } else {
    rooms[roomName] = { players: {} };
    res.status(200).send({ error: `Room created: ${roomName}` });
  }
});

app.post("/join", (req, res) => {
  const roomName = req.body.roomName;
  if (roomName in rooms) {
    res.status(200).send({ message: `Room ${roomName} found, joining...` });
  } else {
    res.status(404).send({ error: `Room ${roomName} not found` });
  }
});

io.on("connection", (socket) => {
  socket.on("new-player", (room, name) => {
    console.log("new player", room, name);
    socket.join(room);
    rooms[room].players[socket.id] = name;
    io.to(room).emit("player-joined", name, rooms[room].players);
    console.log(rooms);
  });
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    getUserRooms(socket).forEach((room) => {
      const oldUser = rooms[room].players[socket.id];
      delete rooms[room].players[socket.id];
      socket.to(room).emit("player-left", oldUser, rooms[room].players);
    });
    cleanRooms();
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.players[socket.id] != null) names.push(name);
    return names;
  }, []);
}

// Remove rooms with no players
function cleanRooms() {
  Object.keys(rooms).forEach((key) => {
    if (Object.keys(rooms[key].players).length == 0) delete rooms[key];
  });
}

server.listen(port, () => console.log(`Listening on port ${port}`));
