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

    if (userAnswer === currentAnswer) {
        correctAnswers++;
        totalQuestions++; // 只有在回答正确时才增加总题数
        remainingAttempts = 0; // 答对了，重置机会
        document.getElementById('answer').value = ''; // 清空输入框
        document.getElementById('attempts').innerText = `剩余机会: ${remainingAttempts}`; // 更新剩余机会显示
        document.getElementById('error-message').innerText = '答对了！'; // 显示答对了消息
        document.getElementById('correct-answer').style.display = 'none'; // 隐藏正确答案

        setTimeout(() => {
            document.getElementById('error-message').innerText = ''; // 清空答对了消息
            generateQuestion(); // 继续生成新题目
        }, 500); // 停留 0.5 秒后继续
    } else {
        remainingAttempts--; // 答错了，减少机会
        document.getElementById('error-message').innerText = '答错了！'; // 显示错误消息
        document.getElementById('attempts').innerText = `剩余机会: ${remainingAttempts}`; // 更新剩余机会显示

        if (remainingAttempts < 0) {
            document.getElementById('attempts').innerText = `剩余机会: 0`; // 显示机会用完
            document.getElementById('correct-answer-value').innerText = currentAnswer; // 设置正确答案
            document.getElementById('correct-answer').style.display = 'block'; // 显示正确答案
            setTimeout(() => {
                document.getElementById('error-message').innerText = ''; // 清空错误消息
                remainingAttempts = parseInt(document.getElementById('maxAttempts').value); // 重置机会
                generateQuestion(); // 生成新题目
                document.getElementById('correct-answer').style.display = 'none'; // 隐藏正确答案
                totalQuestions++; // 在生成新题目时增加总题数
                updateStats(); // 更新统计信息
            }, 2000); // 延迟 2 秒后显示正确答案
        }
    }

    updateStats(); // 更新统计信息
    document.getElementById('answer').value = ''; // 清空输入框
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