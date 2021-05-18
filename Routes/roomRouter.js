const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.post("/newroom", async (req, res) => {
  try {
    const existingRoom = await Room.findOne({ name: req.body.roomName });

    if (existingRoom) return res.status(409).send("Room already exists");

    const newRoom = await new Room({
      name: req.body.roomName,
    });

    newRoom.save();

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({});

    if (!rooms) return res.status(400).send("no rooms");

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/new_message", async (req, res) => {
  try {
    const currentRoom = await Room.findOne({ name: req.body.roomName });

    await currentRoom.updateOne({
      $push: {
        messages: {
          text: req.body.text,
          author: req.body.author,
          time: Date.now(),
        },
      },
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

router.get("/messages/:room", async (req, res) => {
  try {
    const room = await Room.findOne({ name: req.params.room });

    const messages = room.messages || [];

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

module.exports = router;
