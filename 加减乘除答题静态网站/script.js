let totalQuestions = 0;
let correctAnswers = 0;
let currentAnswer = 0;
let remainingAttempts = 0;

function startQuiz() {
    const maxAttempts = parseInt(document.getElementById('maxAttempts').value);
    remainingAttempts = maxAttempts;
    totalQuestions = 0;
    correctAnswers = 0;
    document.getElementById('total').innerText = totalQuestions;
    document.getElementById('correct').innerText = correctAnswers;
    document.getElementById('accuracy').innerText = '0.00';
    document.getElementById('attempts').innerText = `剩余机会: ${remainingAttempts}`;
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    
    generateQuestion();
}

function resetQuiz() {
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('setup').classList.remove('hidden');
    totalQuestions = 0;
    correctAnswers = 0;
    currentAnswer = 0;
    remainingAttempts = 0;
    document.getElementById('total').innerText = totalQuestions;
    document.getElementById('correct').innerText = correctAnswers;
    document.getElementById('accuracy').innerText = '0';
    document.getElementById('answer').value = '';
    document.getElementById('question').innerText = '';
    document.getElementById('error-message').innerText = '';
    document.getElementById('correct-answer').style.display = 'none';
}

function generateQuestion() {
    const max = parseInt(document.getElementById('maxValue').value);
    const operation = document.getElementById('operation').value;
    let num1, num2;

    // 重置剩余机会为设定的次数
    remainingAttempts = parseInt(document.getElementById('maxAttempts').value); // 获取设定的机会次数
    document.getElementById('attempts').innerText = `剩余机会: ${remainingAttempts}`; // 更新显示

    switch (operation) {
        case '+':
            num1 = pseudoRandom(max + 1);
            num2 = pseudoRandom(max + 1 - num1);
            currentAnswer = num1 + num2;
            break;
        case '-':
            num1 = pseudoRandom(max + 1);
            num2 = pseudoRandom(num1 + 1);
            currentAnswer = num1 - num2;
            break;
        case '*':
            // 确保乘法的答案在指定范围内
            const sqrtMax = Math.floor(Math.sqrt(max)); // 计算 sqrt(max) 并取整
            do {
                num1 = pseudoRandom(sqrtMax + 1); // 生成的数不超过 sqrt(max)
                num2 = pseudoRandom(sqrtMax + 1); // 生成的数不超过 sqrt(max)
                currentAnswer = num1 * num2;
            } while (currentAnswer > max);
            break;
        case '/':
            // 确保被除数大于除数，且被除数不超过指定的最大值，并且能整除
            do {
                num1 = pseudoRandom(max + 1); // 确保被除数是整数
                num2 = pseudoRandom(max - 1) + 1; // 避免除以0
                currentAnswer = num1 / num2
            } while (num1 > max || num1 <= num2 || num1 % num2 != 0);
            break;
    }

    const question = `${num1} ${operation} ${num2}`;
    document.getElementById('question').innerText = `题目: ${question}`;

    // 更新统计信息，包括正确率
    updateStats();
}

function submitAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    const submitButton = document.querySelector('button[onclick="submitAnswer()"]');
    submitButton.disabled = true; // 禁用提交按钮

    if (userAnswer === currentAnswer) {
        correctAnswers++;
        totalQuestions++;
        remainingAttempts = 0;
        document.getElementById('answer').value = '';
        document.getElementById('attempts').innerText = `剩余机会: ${remainingAttempts}`;
        document.getElementById('error-message').innerText = '答对了！';
        document.getElementById('correct-answer').style.display = 'none';

        setTimeout(() => {
            document.getElementById('error-message').innerText = '';
            generateQuestion();
            submitButton.disabled = false; // 重新启用提交按钮
        }, 500);
    } else {
        remainingAttempts--;
        document.getElementById('error-message').innerText = '答错了！';
        document.getElementById('attempts').innerText = `剩余机会: ${remainingAttempts}`;

        if (remainingAttempts < 0) {
            document.getElementById('attempts').innerText = `剩余机会: 0`;
            document.getElementById('correct-answer-value').innerText = currentAnswer;
            document.getElementById('correct-answer').style.display = 'block';
            setTimeout(() => {
                document.getElementById('error-message').innerText = '';
                remainingAttempts = parseInt(document.getElementById('maxAttempts').value);
                generateQuestion();
                document.getElementById('correct-answer').style.display = 'none';
                totalQuestions++;
                updateStats();
                submitButton.disabled = false; // 重新启用提交按钮
            }, 2000);
        } else {
            submitButton.disabled = false; // 如果还有机会，立即重新启用提交按钮
        }
    }

    updateStats();
    document.getElementById('answer').value = '';
}

function updateStats() {
    document.getElementById('total').innerText = totalQuestions;
    document.getElementById('correct').innerText = correctAnswers;
    const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0; // 计算正确率
    document.getElementById('accuracy').innerText = accuracy;
    document.getElementById('attempts').innerText = `剩余机会: ${remainingAttempts}`; // 更新剩余机会显示
}

function pseudoRandom(max) {
    // 使用 Math.random() 生成伪随机数
    return Math.floor(Math.random() * max);
} 