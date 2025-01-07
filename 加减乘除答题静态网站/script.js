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
            num1 = pseudoRandom(max + 1); // 生成 0 到 max 的整数
            num2 = pseudoRandom(max + 1); // 生成 0 到 max 的整数
            currentAnswer = num1 * num2;
            break;
        case '/':
            num2 = pseudoRandom(max - 1) + 1; // 避免除以0
            currentAnswer = pseudoRandom(max + 1);
            num1 = currentAnswer * num2;
            break;
    }

    const question = `${num1} ${operation} ${num2}`;
    document.getElementById('question').innerText = `题目: ${question}`;
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
    // 使用当前时间戳和一个简单的算法生成伪随机数
    const seed = Date.now() % 1000; // 取当前时间的毫秒部分作为种子
    return (seed % max);
} 