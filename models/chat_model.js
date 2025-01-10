const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  id : String,
  uid : String,
  username: { type: String, required: true },
  name :String,
  userProfileImage : String,
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  type : String,
  roomName: String
});

module.exports = mongoose.model("Chat", ChatSchema);
