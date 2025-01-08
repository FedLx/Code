let totalQuestions = 0;
let correctAnswers = 0;
let currentAnswer = 0;
let remainingAttempts = 0;
let timerInterval;
let timeRemaining = 0;

function startQuiz() {
    try {
        initializeQuiz();
        toggleVisibility('setup', 'quiz');
        generateQuestion();
        if (document.getElementById('enableTimer').checked) {
            startTimer();
        }
    } catch (error) {
        console.error("Error starting quiz:", error);
    }
}

function resetQuiz() {
    try {
        resetStats();
        toggleVisibility('quiz', 'setup');
        clearUI();
        clearInterval(timerInterval);
        timeRemaining = 0;
        updateTimerUI();
    } catch (error) {
        console.error("Error resetting quiz:", error);
    }
}

function generateQuestion() {
    const max = parseInt(document.getElementById('maxValue').value);
    const operation = document.getElementById('operation').value;
    if (isNaN(max) || !operation) {
        console.error("Invalid input for max value or operation.");
        return;
    }

    let num1, num2;
    resetAttempts(); // 初始化剩余机会
    updateAttemptsUI();

    // 生成新的随机数
    ({ num1, num2, currentAnswer } = generateNumbers(max, operation));

    const question = `${num1} ${operation} ${num2}`;
    document.getElementById('question').innerText = `题目: ${question}`;

    updateStats();
}

function submitAnswer() {
    if (document.getElementById('enableTimer').checked && timeRemaining <= 0) {
        document.getElementById('error-message').innerText = '时间到！请等待下一题。';
        return;
    }

    const userAnswer = parseFloat(document.getElementById('answer').value);
    if (isNaN(userAnswer)) {
        document.getElementById('error-message').innerText = '请输入有效的数字';
        return;
    }

    const submitButton = document.querySelector('button[onclick="submitAnswer()"]');
    submitButton.disabled = true;

    if (userAnswer === currentAnswer) {
        clearInterval(timerInterval);
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

function initializeQuiz() {
    const maxAttempts = parseInt(document.getElementById('maxAttempts').value);
    if (isNaN(maxAttempts) || maxAttempts < 1) {
        console.error("Invalid max attempts value.");
        return;
    }
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
        default:
            console.error("Unsupported operation.");
            return { num1: 0, num2: 0, currentAnswer: 0 };
    }
    return { num1, num2, currentAnswer: answer };
}

function pseudoRandom(max) {
    return Math.floor(Math.random() * max);
}

function handleCorrectAnswer(submitButton) {
    correctAnswers++;
    totalQuestions++;
    document.getElementById('answer').value = '';
    updateAttemptsUI();
    document.getElementById('error-message').innerText = '答对了！';
    document.getElementById('correct-answer').style.display = 'none';

    setTimeout(() => {
        document.getElementById('error-message').innerText = '';
        generateQuestion();
        // 检查是否启用计时器
        if (document.getElementById('enableTimer').checked) {
            clearInterval(timerInterval); // 停止当前计时器
            startTimer(); // 重新开始计时
        }
        document.getElementById('correct-answer').style.display = 'none';
        updateStats();
        submitButton.disabled = false; // 重新启用提交按钮
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
            if (document.getElementById('enableTimer').checked) {
                clearInterval(timerInterval);
                startTimer();
            }
            document.getElementById('correct-answer').style.display = 'none';
            totalQuestions++;
            updateStats();
            submitButton.disabled = false;
        }, 2000);
    } else {
        submitButton.disabled = false;
    }
}

function startTimer() {
    timeRemaining = parseInt(document.getElementById('timerSeconds').value);
    if (isNaN(timeRemaining) || timeRemaining < 1) {
        console.error("Invalid timer seconds value.");
        return;
    }
    updateTimerUI();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerUI();
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function updateTimerUI() {
    const timerElement = document.getElementById('timer');
    if (timeRemaining > 0) {
        timerElement.innerText = `剩余时间: ${timeRemaining} 秒`;
    } else {
        timerElement.innerText = '';
    }
}

function handleTimeOut() {
    const resetButton = document.querySelector('button[onclick="resetQuiz()"]');
    resetButton.disabled = true;

    document.getElementById('error-message').innerText = `时间到！正确答案是: ${currentAnswer}`;
    document.getElementById('correct-answer').style.display = 'none';
    setTimeout(() => {
        document.getElementById('error-message').innerText = '';
        generateQuestion();
        if (document.getElementById('enableTimer').checked) {
            clearInterval(timerInterval);
            startTimer();
        }
        resetButton.disabled = false;
        totalQuestions++;
        updateStats();
    }, 2000);
}

function toggleTimerInput() {
    const timerSettings = document.getElementById('timerSettings');
    const enableTimer = document.getElementById('enableTimer').checked;
    timerSettings.style.display = enableTimer ? 'block' : 'none';
} 