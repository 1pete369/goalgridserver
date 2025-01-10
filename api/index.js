const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { Server } = require("socket.io")
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
  res.json({ message: "It is home bro" })
})

db.on("open", () => {
  console.log("Connected to MongoDB")
})

// Socket.IO integration
const server = require('http').Server(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id)
  socket.on("sendMessage", (newMessage) => {
    io.emit("newMessage", newMessage)
  })
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id)
  })
  socket.on("connect_error", (err) => {
    console.error("Connection error:", err)
  })
})

// API routes
app.use("/users", users_router)
app.use("/todos", todo_router)
app.use("/days", day_router)
app.use("/categories", category_router)
app.use("/habits", habit_router)
app.use("/goals", goal_router)
app.use("/chat", chat_router)

// Vercel expects the handler to be exported
module.exports = (req, res) => {
  server.emit('request', req, res)
}
