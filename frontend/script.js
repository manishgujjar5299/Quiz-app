const categorySelection = document.getElementById("categorySelection");
const categoriesDropdown = document.getElementById("categories");
const difficultyDropdown = document.getElementById("difficulty");
const startQuizButton = document.getElementById("startQuiz");
const quizContainer = document.getElementById("quizContainer");
const quiz = document.getElementById("quiz");
const submitBtn = document.getElementById("submit");
const result = document.getElementById("result");
const leaderboardContainer = document.getElementById("leaderboard");
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

let currentQuiz = 0;
let score = 0;
let quizData = [];
let timeLeft = 60;
let timerInterval;

// Dark Mode Toggle
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

function loadDarkModePref() {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    if (savedMode) {
        body.classList.add('dark-mode');
    }
}

darkModeToggle.addEventListener('click', toggleDarkMode);
document.addEventListener('DOMContentLoaded', loadDarkModePref);

// Timer Functions
function startTimer() {
    const timerDisplay = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
}

// Performance Message
function getPerformanceMessage(score, total) {
    const percentage = (score / total) * 100;
    
    if (percentage === 100) return "Perfect Score! 🏆";
    if (percentage >= 90) return "Excellent! 👏";
    if (percentage >= 75) return "Great Job! 👍";
    if (percentage >= 50) return "Good Effort! 💪";
    return "Keep Practicing! 📚";
}

// Fetch Questions
async function fetchQuestions(category, difficulty) {
    try {
        const response = await fetch(`/questions?category=${category}&difficulty=${difficulty}`);
        if (!response.ok) throw new Error("Failed to fetch questions");
        quizData = await response.json();
        currentQuiz = 0;
        score = 0;

        if (quizData.length === 0) {
            quiz.innerHTML = "<p>No questions available for this category.</p>";
            submitBtn.style.display = "none";
        } else {
            loadQuiz();
        }
    } catch (error) {
        quiz.innerHTML = "<p>Error loading quiz. Please try again later.</p>";
        console.error(error);
    }
}

// Load Quiz
function loadQuiz() {
    const currentData = quizData[currentQuiz];
    quiz.innerHTML = `
        <h2>Q${currentQuiz + 1}: ${currentData.question}</h2>
        ${currentData.options.map(
            (option) => `<label><input type="radio" name="answer" value="${option}"/> ${option}</label><br>`
        ).join("")}
    `;
    submitBtn.style.display = "block";
    resetTimer();
    startTimer();
}

// Get Selected Answer
function getSelected() {
    const answers = document.querySelectorAll('input[name="answer"]');
    return [...answers].find(answer => answer.checked)?.value || null;
}

// Submit Quiz
submitBtn.addEventListener("click", async () => {
    const selected = getSelected();
    if (!selected) {
        alert("Please select an answer before submitting.");
        return;
    }

    const currentQuestion = quizData[currentQuiz];
    const selectedLabel = document.querySelector(`label:has(input[value="${selected}"])`);

    if (selected === currentQuestion.correct) {
        score++;
        selectedLabel.classList.add('correct-answer');
    } else {
        selectedLabel.classList.add('wrong-answer');
        document.querySelector(`label:has(input[value="${currentQuestion.correct}"])`).classList.add('correct-answer');
    }

    currentQuiz++;
    clearInterval(timerInterval);

    if (currentQuiz < quizData.length) {
        setTimeout(loadQuiz, 1000);
    } else {
        const name = prompt("Enter your name for the leaderboard:");
        if (name) await submitScore(name, score);
        
        result.innerHTML = `You scored ${score}/${quizData.length}!<br>
        ${getPerformanceMessage(score, quizData.length)}`;
        
        quiz.innerHTML = "";
        submitBtn.style.display = "none";
    }
});

// Submit Score
async function submitScore(name, score) {
    try {
        await fetch(`/leaderboard`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, score }),
        });
        fetchLeaderboard();
    } catch (error) {
        console.error(error);
    }
}

// Fetch Leaderboard
async function fetchLeaderboard() {
    try {
        const response = await fetch(`/leaderboard`);
        const data = await response.json();
        leaderboardContainer.innerHTML = `
            <h2>Leaderboard</h2>
            <ol>${data.map(entry => `<li>${entry.name} - ${entry.score}</li>`).join("")}</ol>
        `;
    } catch (error) {
        console.error(error);
    }
}

// Start Quiz
startQuizButton.addEventListener("click", () => {
    const category = categoriesDropdown.value;
    const difficulty = difficultyDropdown.value;
    
    if (!category) {
        alert("Please select a category.");
        return;
    }

    categorySelection.style.display = "none";
    quizContainer.style.display = "block";
    fetchQuestions(category, difficulty);
});