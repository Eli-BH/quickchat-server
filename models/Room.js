const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  rooms: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Room", roomSchema);
