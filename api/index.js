const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const users_router = require("../routes/users");
const todo_router = require("../routes/todos");
const day_router = require("../routes/days");
const habit_router = require("../routes/habits");
const goal_router = require("../routes/goals");
const category_router = require("../routes/categories");

const app = express();

// Use CORS middleware with a specific origin
app.use(cors({
  origin: 'https://goalgrid.vercel.app', // Allow only your frontend domain
}));

app.use(express.json());

// Vercel serverless function export
app.get("/", (req, res) => {
  res.json({ message: "it home bro" });
});

// MongoDB connection
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on("open", () => {
  console.log("Connected to MongoDB");
});

// Handle MongoDB connection error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Use route handlers
app.use("/users", users_router);
app.use("/todos", todo_router);
app.use("/days", day_router);
app.use("/categories", category_router);
app.use("/habits", habit_router);
app.use("/goals", goal_router);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Vercel expects the handler to be exported
module.exports = app;
