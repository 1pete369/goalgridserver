// /api/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Pusher = require("pusher");

const users_router = require("../routes/users");
const todo_router = require("../routes/todos");
const day_router = require("../routes/days");
const habit_router = require("../routes/habits");
const goal_router = require("../routes/goals");
const category_router = require("../routes/categories");
const chat_router = require("../routes/chat");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection (handled within each request due to Vercel's stateless functions)

mongoose.connect(process.env.DB_URL)

const db = mongoose.connection

db.on("open", () => {
  console.log("Connected to MongoDB")
})
// Pusher setup
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the app!" });
});

// REST API routes
app.use("/users", users_router);
app.use("/todos", todo_router);
app.use("/days", day_router);
app.use("/categories", category_router);
app.use("/habits", habit_router);
app.use("/goals", goal_router);
app.use("/chat", chat_router);

// Send message route (trigger Pusher)
app.post("/send-message", (req, res) => {
  const { message, roomName, username, createdAt, uid, userProfileImage, name } = req.body;

  console.log("Received message data:", req.body);

  try {
    // Trigger the message event to Pusher
    pusher.trigger("chat-channel", "new-message", {
      message,
      roomName,
      username,
      createdAt,
      uid,
      userProfileImage,
      name,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error triggering Pusher:", error);
    res.status(500).json({ success: false, message: "Error sending message to Pusher" });
  }
});

// Vercel function handler
module.exports = app;
