var express = require("express");
var router = express.Router();

const rooms = require("../actions/rooms");

router.get("/", (req, res) => {
  const roomName = req.query.roomName;
  try {
    const room = rooms.get(roomName);
    res.status(200).send({ room });
  } catch (e) {
    res.status(404).send({ error: `Could not get room. ${e}` });
  }
});

router.post("/", (req, res) => {
  const roomName = req.body.roomName;
  const roomPassword = req.body.roomPassword || "";
  console.log(req.body);
  try {
    rooms.create(roomName, roomPassword);
    res.status(200).send({ success: `Room created: ${roomName}` });
  } catch (e) {
    res.status(409).send({ error: `Could not create room. ${e}` });
  }
});

router.post("/join", (req, res) => {
  const roomName = req.body.roomName;
  const roomPassword = req.body.roomPassword || "";
  try {
    const room = rooms.get(roomName);
    if (room.password !== roomPassword) {
      throw new Error("Incorrect password.");
    }
    res.status(200).send({ success: `Room ${roomName} found, joining...` });
  } catch (e) {
    if (e.message === "Incorrect password.") {
      res.status(401).send({ error: e.message });
    } else {
      res.status(404).send({ error: `Could not join room. ${e}` });
    }
  }
});

module.exports = router;
