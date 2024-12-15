const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreText = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

canvas.width = 400;
canvas.height = 600;

// Load assets
const birdImage = new Image();
birdImage.src = 'https://i.postimg.cc/nhPzVY9j/flappy-bird-new.png'; // Transparent bird image must be ensured

const pipeImage = new Image();
pipeImage.src = 'https://i.postimg.cc/vTZF6kpQ/pipe-new.png'; // Transparent pipe

const backgroundImage = new Image();
backgroundImage.src = 'https://i.postimg.cc/1tJ47PWk/platform-game-background-template-1298309-35723.avif';

// Game state
let isGameRunning = false;
let bird, pipes, score, gameSpeed, gravity;

// Bird
class Bird {
  constructor() {
    this.x = 50;
    this.y = canvas.height / 2;
    this.size = 20;
    this.velocity = 0;
    this.flapStrength = -6;
  }

  update() {
    this.velocity += gravity;
    this.y += this.velocity;
    this.y = Math.max(0, Math.min(this.y, canvas.height - this.size)); // Prevent going off-screen
  }

  draw() {
    ctx.drawImage(birdImage, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
  }

  flap() {
    this.velocity = this.flapStrength;
  }
}

// Pipe
class Pipe {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update() {
    this.x -= gameSpeed;
  }

  draw() {
    ctx.drawImage(pipeImage, this.x, this.y, this.width, this.height);
  }
}

function startGame() {
  // Initialize game variables
  bird = new Bird();
  pipes = [];
  score = 0;
  gameSpeed = 2;
  gravity = 0.4;
  isGameRunning = true;

  startScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';

  spawnPipes();
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (!isGameRunning) return;

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Draw background

  bird.update();
  bird.draw();

  // Update pipes
  pipes.forEach((pipe, index) => {
    pipe.update();
    pipe.draw();

    // Remove pipes off-screen
    if (pipe.x + pipe.width < 0) pipes.splice(index, 1);

    // Check for collision
    if (
      bird.x + bird.size > pipe.x &&
      bird.x - bird.size < pipe.x + pipe.width &&
      bird.y + bird.size > pipe.y &&
      bird.y - bird.size < pipe.y + pipe.height
    ) {
      endGame();
    }
  });

  // Add new pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    spawnPipes();
  }

  // Draw score on the top-right corner
  ctx.fillStyle = 'yellow'; // Change score color to yellow
  ctx.font = '24px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(`Score: ${score}`, canvas.width - 20, 40);

  score++;
  requestAnimationFrame(gameLoop);
}

function spawnPipes() {
  const gapHeight = 200;
  const pipeWidth = 80; // Adjusted to align with the transparent pipe
  const topHeight = Math.random() * (canvas.height / 2);
  const bottomY = topHeight + gapHeight;

  pipes.push(new Pipe(canvas.width, 0, pipeWidth, topHeight));
  pipes.push(new Pipe(canvas.width, bottomY, pipeWidth, canvas.height - bottomY));
}

function endGame() {
  isGameRunning = false;
  finalScoreText.textContent = `Score: ${score}`;
  gameOverScreen.style.display = 'block';
}

canvas.addEventListener('click', () => {
  if (isGameRunning) bird.flap();
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);