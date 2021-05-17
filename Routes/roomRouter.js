const express = require("express");
const Room = require("../models/Room");

const router = express.Router();

router.post("/newroom", async (req, res) => {
  try {
    const { roomName } = req.body;

    const existingRoom = await Room.findOne({ name: roomName });
    if (existingRoom) return res.status(409).send("Room already exists");

    const room = await new Room({ name: roomName });

    room.save();
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/getrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});

    if (!rooms) return res.status(404).send("No rooms");

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
