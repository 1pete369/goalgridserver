const express = require("express");
const Chat = require("../models/chat_model");

const router = express.Router();

// Fetch all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Add a new message
router.post("/", async (req, res) => {
  const message = req.body;

  try {
    const newMessage = new Chat(message);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
