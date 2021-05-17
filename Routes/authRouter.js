const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

//basic auth routes

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
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);

    res.status(201).send(accessToken);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
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
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).send(accessToken);
    } else {
      res.status(500).send("Incorrect Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/users", authenticateToken, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, { user }) => {
    if (err) return res.status(403);

    req.user = user;
    next();
  });
}
module.exports = router;
