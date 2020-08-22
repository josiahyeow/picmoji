var express = require("express");
var router = express.Router();

const rooms = require("../data/rooms");

router.get("/", (req, res) => {
  const roomName = req.query.roomName;
  try {
    const room = rooms.getRoom(roomName);
    res.status(200).send({ room });
  } catch (e) {
    res.status(404).send({ error: `Could not get room. ${e}` });
  }
});

router.post("/", (req, res) => {
  const roomName = req.body.roomName;
  try {
    rooms.createRoom(roomName);
    res.status(200).send({ success: `Room created: ${roomName}` });
  } catch (e) {
    res.status(409).send({ error: `Could not create room. ${e}` });
  }
});

router.post("/join", (req, res) => {
  const roomName = req.body.roomName;
  try {
    rooms.getRoom(roomName);
    res.status(200).send({ success: `Room ${roomName} found, joining...` });
  } catch (e) {
    res.status(404).send({ error: `Could not join room. ${e}` });
  }
});

module.exports = router;
