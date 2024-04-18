const API_URL = 'https://opentdb.com/api.php?amount=5&type=multiple'; // Fetch 5 multiple choice questions

let currentQuestionIndex = 0;

let score = 0;

let timeLeft = 30;

let timer;

document.getElementById('fetchButton').addEventListener('click', fetchQuestions);

function fetchQuestions() {

  fetch(API_URL)

    .then(response => response.json())

    .then(data => {

      renderQuestions(data.results);

      startTimer();

    })

    .catch(error => console.error('Error fetching trivia questions:', error));

}

function renderQuestions(questions) {

  const questionContainer = document.getElementById('questionContainer');

  questionContainer.innerHTML = '';

  questions.forEach((question, index) => {

    const questionElement = document.createElement('div');

    questionElement.classList.add('question');

    questionElement.innerHTML = `

      <p>${question.question}</p>

      <ul>

        ${question.incorrect_answers.map(answer => `<li>${answer}</li>`).join('')}

        <li>${question.correct_answer}</li>

      </ul>

      <div id="timer${index}" class="timer">Time remaining: <span class="time">30</span> seconds</div>

    `;

    questionContainer.appendChild(questionElement);

  });

}

function startTimer() {

  timer = setInterval(() => {

    const timeElements = document.querySelectorAll('.time');

    timeElements.forEach(timeElement => {

      let time = parseInt(timeElement.textContent);

      time--;

      if (time < 0) {

        clearInterval(timer);

        checkAnswer('');

      } else {

        timeElement.textContent = time;

      }

    });

  }, 1000);

}

function checkAnswer(selectedAnswer) {

  clearInterval(timer);

  const currentQuestion = document.querySelector(`#questionContainer .question:nth-child(${currentQuestionIndex + 1})`);

  const userAnswer = selectedAnswer || currentQuestion.querySelector('input[name="answer"]:checked')?.value;

  const correctAnswer = currentQuestion.querySelector('li:last-child').textContent;

  if (!userAnswer) {

    alert('Time is up! Moving to the next question...');

  } else if (userAnswer === correctAnswer) {

    score += 5;

    alert('Correct!');

  } else {

    alert(`Incorrect. The correct answer is ${correctAnswer}.`);

  }

  currentQuestionIndex++;

  if (currentQuestionIndex < 5) {

    setTimeout(() => {

      renderQuestions();

      startTimer();

    }, 1000);

  } else {

    setTimeout(() => {

      showScore();

    }, 1000);

  }

}

function showScore() {

  const questionContainer = document.getElementById('questionContainer');

  questionContainer.innerHTML = `<p>Quiz completed! Your total score is: ${score}</p>`;

}