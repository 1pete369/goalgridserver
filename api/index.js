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
app.use(cors({
  origin: 'https://goalgrid.vercel.app' // Allow requests from your frontend origin
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

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
app.post("/send-message", async (req, res) => {
  const { message, roomName, username, createdAt, uid, userProfileImage, name } = req.body;

  try {
    // Trigger the event on Pusher
    pusher.trigger("chat-room", "new-message", {
      message,
      roomName,
      username,
      createdAt,
      uid,
      userProfileImage,
      name,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error triggering Pusher:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// No need to listen for a port here
// Vercel will handle the serverless function execution 

module.exports = app;