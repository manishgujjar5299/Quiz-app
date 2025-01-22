const express = require("express");
const app = express();
const cors = require("cors");
const questions = require("./db/questions.json");

app.use(cors());
app.use(express.json());

let leaderboard = []; // Array to store leaderboard data

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Quiz App API");
});

// Fetch questions by category
app.get("/questions", (req, res) => {
  const category = req.query.category;
  const filteredQuestions = questions.filter((q) => q.category === category);
  res.json(filteredQuestions);
});

// Get leaderboard data
app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

// Add user score to leaderboard
app.post("/leaderboard", (req, res) => {
  const { name, score } = req.body;
  if (!name || score === undefined) {
    return res.status(400).json({ error: "Name and score are required." });
  }
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score); // Sort by score (descending)
  res.status(201).json({ message: "Score added to leaderboard!" });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
