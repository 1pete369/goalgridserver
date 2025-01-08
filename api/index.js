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

const app = express()

app.use(cors())

app.use(express.json())

app.listen(process.env.PORT_NUM, (req, res) => {
  console.log("Server started on port 3001")
})

mongoose.connect(process.env.DB_URL)

const db = mongoose.connection

app.get("/", (req, res) => {
  res.json({ message: "it home bro" })
})

db.on("open", () => {
  console.log("Connected to MongoDB")
})

app.use("/users", users_router)
app.use("/todos", todo_router)
app.use("/days", day_router)
app.use("/categories", category_router)
app.use("/habits", habit_router)
app.use("/goals", goal_router)

module.exports = app
