// /api/index.js

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

db.on("open", () => {
  console.log("Connected to MongoDB");
});

// Default response when the root endpoint is called
module.exports = async (req, res) => {
  if (req.method === "GET") {
    res.status(200).json({ message: "Welcome to the app!" });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
