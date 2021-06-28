var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let popup = document.getElementById("popup1");
let play = document.getElementById("play");

let score = 0;

let brickRowCount = 9;
let brickColCount = 5;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 10,
  dx: 0,
};

const brickInfo = {
  w: 75,
  h: 30,
  padding: 5,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
  ctx.fillStyle = "#526";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "rgb(56,68,95)";
  ctx.fill();
  ctx.closePath();
}

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColCount; j++) {
    let x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    let y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#849" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
}

function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // left and right collision
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  // top collision
  if (ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // bottom collision
  if (ball.y + ball.size > canvas.height) {
    messageDisplay("You Lost");
  }

  // paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;

          score++;
        }
      }
    });
  });

  if (score == brickRowCount * brickColCount) {
    messageDisplay("You Won");
  }
}

// Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.w / 2;
  }
}

function messageDisplay(text) {
  popup.classList.add("show");
  popup.childNodes[1].childNodes[1].innerText =
    text + ` with a score of ${score}`;
  score = 0;
  reset();
  document.removeEventListener("mousemove");
}

function reset() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
    });
  });
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  drawBall();
  drawBricks();
  drawPaddle();
}

function update() {
  movePaddle();
  moveBall();

  requestAnimationFrame(update);
  // Draw everything
  draw();
}

update();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
document.addEventListener("mousemove", mouseMoveHandler);

play.addEventListener("click", () => {
  popup.classList.remove("show");
  update();
  document.addEventListener("mousemove", mouseMoveHandler);
});
