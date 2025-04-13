// 游戏配置
const config = {
    gridSize: 20,
    initialSpeed: 200,
    speedIncrease: 5
};

// 游戏状态
let snake = [];
let food = { x: 0, y: 0 };
let direction = 'right';
let score = 0;
let gameLoop = null;
let currentSpeed = config.initialSpeed;

// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

// 初始化游戏
function initGame() {
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    direction = 'right';
    score = 0;
    currentSpeed = config.initialSpeed;
    generateFood();
    updateScore();
}

// 生成食物
function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / config.gridSize));
    food.y = Math.floor(Math.random() * (canvas.height / config.gridSize));
    
    // 确保食物不会生成在蛇身上
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = Math.floor(Math.random() * (canvas.width / config.gridSize));
        food.y = Math.floor(Math.random() * (canvas.height / config.gridSize));
    }
}

// 更新分数
function updateScore() {
    scoreElement.textContent = `分数: ${score}`;
    document.getElementById('finalScore').textContent = `最终分数: ${score}`;
}

// 游戏主循环
function gameStep() {
    const head = { x: snake[0].x, y: snake[0].y };

    // 根据方向移动蛇头
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // 检查碰撞
    if (isCollision(head)) {
        gameOver();
        return;
    }

    // 移动蛇
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
        // 加快游戏速度
        currentSpeed = Math.max(50, currentSpeed - config.speedIncrease);
        clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, currentSpeed);
    } else {
        snake.pop();
    }

    // 绘制游戏画面
    draw();
}

// 碰撞检测
function isCollision(head) {
    // 检查是否撞墙
    if (head.x < 0 || head.x >= canvas.width / config.gridSize ||
        head.y < 0 || head.y >= canvas.height / config.gridSize) {
        return true;
    }

    // 检查是否撞到自己
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            config.gridSize - 1,
            config.gridSize - 1
        );
    });

    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(
        food.x * config.gridSize,
        food.y * config.gridSize,
        config.gridSize - 1,
        config.gridSize - 1
    );
}

// 开始游戏
function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    initGame();
    gameLoop = setInterval(gameStep, currentSpeed);
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    gameOverScreen.style.display = 'flex';
}

// 重新开始游戏
function restartGame() {
    startGame();
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const newDirection = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right'
    }[key];

    if (newDirection) {
        // 防止180度转向
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        if (opposites[newDirection] !== direction) {
            direction = newDirection;
        }
    }
});