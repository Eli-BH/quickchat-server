require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/authRouter");
const roomRoutes = require("./Routes/roomRouter");
const socket = require("socket.io");
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server running");
});

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//the connection is the access to our server
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  //random id from socket io
  console.log(socket.id, "User connected");

  socket.on("joinRoom", (data) => {
    socket.join(data);
    console.log(`User has entered ${data} room.`);
  });

  socket.on("sendMessage", (data) => {
    console.log(data);
    socket.to(data.room).emit("receiveMessage", data.content);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});
