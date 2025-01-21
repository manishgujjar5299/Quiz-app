// Get DOM elements
const categorySelection = document.getElementById("categorySelection");
const categoriesDropdown = document.getElementById("categories");
const startQuizButton = document.getElementById("startQuiz");
const quizContainer = document.getElementById("quizContainer");
const quiz = document.getElementById("quiz");
const submitBtn = document.getElementById("submit");
const result = document.getElementById("result");

let currentQuiz = 0;
let score = 0;
let quizData = [];

// Fetch questions by category
async function fetchQuestions(category) {
  try {
    const response = await fetch(`http://localhost:3000/questions?category=${category}`);
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    quizData = await response.json();
    if (quizData.length === 0) {
      quiz.innerHTML = "<p>No questions available for this category.</p>";
      submitBtn.style.display = "none";
    } else {
      loadQuiz(); // Load the first question
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    quiz.innerHTML = "<p>Error loading quiz. Please try again later.</p>";
  }
}

// Load a quiz question
function loadQuiz() {
  const currentData = quizData[currentQuiz];
  quiz.innerHTML = `
    <h2>Q${currentQuiz + 1}: ${currentData.question}</h2>
    ${currentData.options
      .map(
        (option, index) =>
          `<label><input type="radio" name="answer" value="${option}" /> ${option}</label><br />`
      )
      .join("")}
  `;
  submitBtn.style.display = "block";
}

// Get the selected answer
function getSelected() {
  const answers = document.querySelectorAll('input[name="answer"]');
  let selected = null;
  answers.forEach((answer) => {
    if (answer.checked) {
      selected = answer.value;
    }
  });
  return selected;
}

// Handle quiz submission
submitBtn.addEventListener("click", () => {
  const selected = getSelected();
  if (!selected) {
    alert("Please select an answer before submitting.");
    return;
  }

  if (selected === quizData[currentQuiz].correct) {
    score++;
  }

  currentQuiz++;
  if (currentQuiz < quizData.length) {
    loadQuiz(); // Load next question
  } else {
    result.textContent = `You scored ${score}/${quizData.length}!`;
    submitBtn.style.display = "none";
    quiz.innerHTML = ""; // Clear quiz container
  }
});

// Start quiz on category selection
startQuizButton.addEventListener("click", () => {
  const selectedCategory = categoriesDropdown.value;
  if (!selectedCategory) {
    alert("Please select a category.");
    return;
  }

  categorySelection.style.display = "none"; // Hide category selection
  quizContainer.style.display = "block"; // Show quiz container
  fetchQuestions(selectedCategory); // Fetch questions for the selected category
});
