const express = require("express");
const app = express();
const cors = require("cors");
const questions = require("./db/questions.json");

app.use(cors());
app.use(express.json());

let leaderboard = [];

// Get Questions with Difficulty Filter
app.get("/questions", (req, res) => {
    const { category, difficulty } = req.query;
    const filteredQuestions = questions.filter(
        q => q.category === category && q.difficulty === difficulty
    );
    res.json(filteredQuestions);
});

// Leaderboard
app.get("/leaderboard", (req, res) => {
    res.json(leaderboard.slice(0, 10)); // Top 10 scores
});

app.post("/leaderboard", (req, res) => {
    const { name, score } = req.body;
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    res.status(201).json({ message: "Score added!" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

app.get("/", (req, res) => {
    res.send("Welcome to the Quiz App API");
});