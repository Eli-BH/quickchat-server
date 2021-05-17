const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(409).send("User already exits");

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const user = await new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPass,
    });

    await user.save();

    res.status(201).send("User created");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    //look for the user in the database
    const user = await User.findOne({ email: req.body.email });

    //return not found if user not found in the db
    if (!user) return res.status(404).send("User not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);

    //compare the password to the hashed password
    if (validPass) {
      res.status(200).send(user);
    } else {
      res.status(500).send("Incorrect Credentials");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
