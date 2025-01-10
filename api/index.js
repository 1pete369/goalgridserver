const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const users_router = require("../routes/users")
const todo_router = require("../routes/todos")
const day_router = require("../routes/days")
const habit_router = require("../routes/habits")
const goal_router = require("../routes/goals")
const category_router = require("../routes/categories")
const chat_router = require("../routes/chat")

const app = express()

app.use(cors())

app.use(express.json())

mongoose.connect(process.env.DB_URL)

const db = mongoose.connection

app.get("/", (req, res) => {
  res.json({ message: "it home bro" })
})

db.on("open", () => {
  console.log("Connected to MongoDB")
})

// Pusher setup
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

// REST API routes
app.use("/users", users_router)
app.use("/todos", todo_router)
app.use("/days", day_router)
app.use("/categories", category_router)
app.use("/habits", habit_router)
app.use("/goals", goal_router)
app.use("/chat", chat_router)

app.post("/send-message", (req, res) => {
  const { message, roomName, username, createdAt, uid, userProfileImage, name, id } = req.body;

  console.log("Message to send:", req.body);

  // Trigger the message event to Pusher
  pusher.trigger("chat-channel", "new-message", {
    message,        // Plain message string
    roomName,       // Room name
    username,       // Username
    createdAt,      // Date
    uid,            // User ID
    userProfileImage, // Profile Image URL
    name,
    id            // User Name
  });

  res.status(200).json({ success: true });
});


app.listen(3001, () => {
  console.log("Server running on http://localhost:3001")
})

module.exports = app;
