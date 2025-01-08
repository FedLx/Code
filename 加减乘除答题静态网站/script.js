let totalQuestions = 0;
let correctAnswers = 0;
let currentAnswer = 0;
let remainingAttempts = 0;

function startQuiz() {
    initializeQuiz();
    toggleVisibility('setup', 'quiz');
    generateQuestion();
}

function resetQuiz() {
    resetStats();
    toggleVisibility('quiz', 'setup');
    clearUI();
}

function generateQuestion() {
    const max = parseInt(document.getElementById('maxValue').value);
    const operation = document.getElementById('operation').value;
    let num1, num2;

    resetAttempts();
    updateAttemptsUI();

    ({ num1, num2, currentAnswer } = generateNumbers(max, operation));

    const question = `${num1} ${operation} ${num2}`;
    document.getElementById('question').innerText = `题目: ${question}`;

    updateStats();
}

function submitAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    const submitButton = document.querySelector('button[onclick="submitAnswer()"]');
    submitButton.disabled = true;

    if (userAnswer === currentAnswer) {
        handleCorrectAnswer(submitButton);
    } else {
        handleIncorrectAnswer(submitButton);
    }

    updateStats();
    document.getElementById('answer').value = '';
}

function updateStats() {
    document.getElementById('total').innerText = totalQuestions;
    document.getElementById('correct').innerText = correctAnswers;
    const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;
    document.getElementById('accuracy').innerText = accuracy;
    updateAttemptsUI();
}

function pseudoRandom(max) {
    return Math.floor(Math.random() * max);
}

function initializeQuiz() {
    const maxAttempts = parseInt(document.getElementById('maxAttempts').value);
    remainingAttempts = maxAttempts;
    totalQuestions = 0;
    correctAnswers = 0;
    updateStats();
}

function resetStats() {
    totalQuestions = 0;
    correctAnswers = 0;
    currentAnswer = 0;
    remainingAttempts = 0;
}

function clearUI() {
    document.getElementById('total').innerText = totalQuestions;
    document.getElementById('correct').innerText = correctAnswers;
    document.getElementById('accuracy').innerText = '0';
    document.getElementById('answer').value = '';
    document.getElementById('question').innerText = '';
    document.getElementById('error-message').innerText = '';
    document.getElementById('correct-answer').style.display = 'none';
}

function toggleVisibility(hideId, showId) {
    document.getElementById(hideId).classList.add('hidden');
    document.getElementById(showId).classList.remove('hidden');
}

function resetAttempts() {
    remainingAttempts = parseInt(document.getElementById('maxAttempts').value);
}

function updateAttemptsUI() {
    document.getElementById('attempts').innerText = `剩余机会: ${remainingAttempts}`;
}

function generateNumbers(max, operation) {
    let num1, num2, answer;
    switch (operation) {
        case '+':
            num1 = pseudoRandom(max + 1);
            num2 = pseudoRandom(max + 1 - num1);
            answer = num1 + num2;
            break;
        case '-':
            num1 = pseudoRandom(max + 1);
            num2 = pseudoRandom(num1 + 1);
            answer = num1 - num2;
            break;
        case '*':
            const sqrtMax = Math.floor(Math.sqrt(max));
            do {
                num1 = pseudoRandom(sqrtMax + 1);
                num2 = pseudoRandom(sqrtMax + 1);
                answer = num1 * num2;
            } while (answer > max);
            break;
        case '/':
            do {
                num1 = pseudoRandom(max + 1);
                num2 = pseudoRandom(max - 1) + 1;
                answer = num1 / num2;
            } while (num1 > max || num1 <= num2 || num1 % num2 !== 0);
            break;
    }
    return { num1, num2, currentAnswer: answer };
}

function handleCorrectAnswer(submitButton) {
    correctAnswers++;
    totalQuestions++;
    remainingAttempts = 0;
    document.getElementById('answer').value = '';
    updateAttemptsUI();
    document.getElementById('error-message').innerText = '答对了！';
    document.getElementById('correct-answer').style.display = 'none';

    setTimeout(() => {
        document.getElementById('error-message').innerText = '';
        generateQuestion();
        submitButton.disabled = false;
    }, 500);
}

function handleIncorrectAnswer(submitButton) {
    remainingAttempts--;
    document.getElementById('error-message').innerText = '答错了！';
    updateAttemptsUI();

    if (remainingAttempts < 0) {
        document.getElementById('attempts').innerText = `剩余机会: 0`;
        document.getElementById('correct-answer-value').innerText = currentAnswer;
        document.getElementById('correct-answer').style.display = 'block';
        setTimeout(() => {
            document.getElementById('error-message').innerText = '';
            resetAttempts();
            generateQuestion();
            document.getElementById('correct-answer').style.display = 'none';
            totalQuestions++;
            updateStats();
            submitButton.disabled = false;
        }, 2000);
    } else {
        submitButton.disabled = false;
    }
} 