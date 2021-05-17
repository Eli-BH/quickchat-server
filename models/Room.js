const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
});

module.exports = mongoose.model("Room", roomSchema);
