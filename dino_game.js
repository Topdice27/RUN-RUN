// Get canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants
const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;
const GROUND_HEIGHT = 50;
const GAME_SPEED = 10;
const GRAVITY = 1;

// Images
const dino_img = new Image();
dino_img.src = 'dino.png';

const cactus_img = new Image();
cactus_img.src = 'cactus.png';

// Game variables
let dino = {
    x: 50,
    y: SCREEN_HEIGHT - GROUND_HEIGHT - dino_img.height,
    dy: 0,
    width: 50,
    height: 50,
    grounded: true
};

let groundY = SCREEN_HEIGHT - GROUND_HEIGHT;
let obstacles = [];
let score = 0;

function addObstacle() {
    obstacles.push({
        x: SCREEN_WIDTH,
        y: SCREEN_HEIGHT - GROUND_HEIGHT - cactus_img.height,
        width: cactus_img.width,
        height: cactus_img.height
    });
}

function displayScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score, 10, 30);
}

function checkCollision() {
    let dinoRect = {x: dino.x, y: dino.y, width: dino.width, height: dino.height};
    for (let obstacle of obstacles) {
        let obstacleRect = {x: obstacle.x, y: obstacle.y, width: obstacle.width, height: obstacle.height};
        if (dinoRect.x < obstacleRect.x + obstacleRect.width &&
            dinoRect.x + dinoRect.width > obstacleRect.x &&
            dinoRect.y < obstacleRect.y + obstacleRect.height &&
            dinoRect.y + dinoRect.height > obstacleRect.y) {
            return true;
        }
    }
    return false;
}

// Event listener for spacebar
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && dino.grounded) {
        dino.dy = -15;
        dino.grounded = false;
    }
});

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Update
    dino.dy += GRAVITY;
    dino.y += dino.dy;

    if (dino.y > groundY - dino.height) {
        dino.y = groundY - dino.height;
        dino.dy = 0;
        dino.grounded = true;
    }

    if (Math.random() < 0.01) {
        addObstacle();
    }

    for (let obstacle of obstacles) {
        obstacle.x -= GAME_SPEED;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.shift();
            score++;
        }
    }

    if (checkCollision()) {
        alert('Game Over! Your score: ' + score);
        resetGame();
    }

    // Draw
    ctx.drawImage(dino_img, dino.x, dino.y);
    for (let obstacle of obstacles) {
        ctx.drawImage(cactus_img, obstacle.x, obstacle.y);
    }
    displayScore();

    // Loop
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    dino = {
        x: 50,
        y: SCREEN_HEIGHT - GROUND_HEIGHT - dino_img.height,
        dy: 0,
        width: 50,
        height: 50,
        grounded: true
    };
    groundY = SCREEN_HEIGHT - GROUND_HEIGHT;
    obstacles = [];
    score = 0;
}

// Start game loop
gameLoop();
