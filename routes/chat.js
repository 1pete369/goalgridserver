const express = require("express");
const pusher = require("../utils/pusher");
const Chat = require("../models/chat_model");

const router = express.Router();

// Get messages for a specific channel (roomName)
router.get("/get-messages/:roomName", async (req, res) => {
  const roomName = req.params.roomName;

  try {
    const messages = await Chat.find({ roomName })
      // .skip((page - 1) * limit) // Skip messages based on page number
      // .limit(Number(limit)) // Limit the number of messages
      // .sort({ createdAt: -1 }); // Sort by most recent messages

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});


// router.get('/get-messages/:roomName', async (req, res) => {
//   const { roomName } = req.params;
//   const { page = 1, limit = 20 } = req.query;  // Get page and limit from query params

//   try {
//     const skip = (page - 1) * limit;

//     // Fetch the messages with pagination
//     const messages = await Chat.find({ roomName })
//       .sort({ createdAt: -1 })  // Sort by creation date (newest first)
//       .skip(skip)
//       .limit(Number(limit));

//     // Get the total number of messages to determine if there are more
//     const totalMessages = await Chat.countDocuments({ roomName });
//     const hasMore = totalMessages > page * limit;  // If there are more messages, hasMore will be true

//     res.json({
//       messages,
//       hasMore,  // Send the hasMore flag in the response
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching messages", error });
//   }
// });


// Handle sending a new message to a specific channel (roomName) and trigger Pusher event
router.post("/send-message", async (req, res) => {
  const {
    id,
    message,
    mediaUrl,
    mediaType,
    roomName,
    createdAt,
    uid,
    type
  } = req.body;

  try {
    // Trigger Pusher event on the specified roomName (channel)
    pusher.trigger(roomName, "new-message", {
      id,
      message,
      mediaUrl,
      mediaType,
      roomName,
      createdAt,
      uid,
      type
    });

    // Save message to MongoDB with the roomName
    const messageToSave = new Chat({
      id,
      message,
      mediaUrl,
      mediaType,
      roomName,
      createdAt,
      uid,
      type
    });
    await messageToSave.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
