const express = require("express");
const app = express();
const cors = require("cors");
const questions = require("../backend/db/questions.json");

app.use(cors());
app.use(express.json());

// Root endpoint to handle the default GET request
app.get("/", (req, res) => {
  res.send("Welcome to the Quiz App API");
});

// Endpoint to fetch questions by category
app.get("/questions", (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  
  const filteredQuestions = questions.filter((q) => q.category === category);
  res.json(filteredQuestions);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
