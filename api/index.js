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
const friend_router = require("../routes/friends")
const note_router = require("../routes/notes")
const journal_router = require("../routes/journals")
const subscription_router = require("../routes/subscriptions")
const credential_router = require("../routes/credentials")
const media_router = require("../routes/medias")
const room_router = require("../routes/rooms")

const app = express()

app.use(
  cors({
    origin: "*" // Allow requests from your frontend origin
  })
)

app.use(express.json())

if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
}

const db = mongoose.connection

app.get("/", (req, res) => {
  res.json({ message: "it home bro" })
})

db.on("open", () => {
  console.log("Connected to MongoDB")
})

// REST API routes
app.use("/users", users_router)
app.use("/todos", todo_router)
app.use("/days", day_router)
app.use("/categories", category_router)
app.use("/habits", habit_router)
app.use("/goals", goal_router)
app.use("/chat", chat_router)
app.use("/friends", friend_router)
app.use("/notes", note_router)
app.use("/journals", journal_router)
app.use("/subscriptions", subscription_router)
app.use("/credentials", credential_router)
app.use("/medias", media_router)
app.use("/rooms", room_router)

// Default export for Vercel to use
module.exports = app
