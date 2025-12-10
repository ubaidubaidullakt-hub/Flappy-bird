const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    gravity: 0.6,
    lift: -10,
    velocity: 0
};

let pipes = [];
let score = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function createPipe() {
    let gap = 150;
    let topHeight = Math.random() * (canvas.height - gap);
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap,
        width: 60
    });
}

setInterval(createPipe, 2000);

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
        pipe.x -= 4;

        // Collision
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            gameOver = true;
        }

        if (pipe.x + pipe.width < bird.x && !pipe.scored) {
            score++;
            pipe.scored = true;
        }
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y <= 0 || bird.y >= canvas.height - bird.height) {
        gameOver = true;
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Score: " + score, 20, 50);
}

window.addEventListener("touchstart", () => {
    bird.velocity = bird.lift;
});

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "60px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    updateBird();
    drawScore();

    requestAnimationFrame(gameLoop);
}

gameLoop();