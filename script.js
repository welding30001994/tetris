const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const ROWS = 15, COLS = 10, SQ = 25;
let board, piece, x, y, dropInterval = 500, lastTime = 0;

const PIECES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]] // J
];

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill("black"));
    piece = randomPiece();
    x = 3;
    y = 0;
    canvas.width = COLS * SQ;
    canvas.height = ROWS * SQ;
}

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function drawBoard() {
    board.forEach((row, r) => row.forEach((color, c) => drawSquare(c, r, color)));
}

document.addEventListener("keydown", move);
function move(e) {
    if (e.key === "ArrowLeft" && canMove(-1, 0)) x--;
    if (e.key === "ArrowRight" && canMove(1, 0)) x++;
    if (e.key === "ArrowDown" && canMove(0, 1)) y++;
    if (e.key === "ArrowUp") piece = rotate(piece);
    draw();
}

function canMove(dx, dy) {
    return piece.every((row, r) => row.every((cell, c) => {
        if (!cell) return true;
        let newX = x + c + dx;
        let newY = y + r + dy;
        return newX >= 0 && newX < COLS && newY < ROWS && (!board[newY] || board[newY][newX] === "black");
    }));
}

function rotate(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function randomPiece() {
    return PIECES[Math.floor(Math.random() * PIECES.length)];
}

function dropPiece(time = 0) {
    if (time - lastTime > dropInterval) {
        if (canMove(0, 1)) {
            y++;
        } else {
            if (y === 0) {
                alert("Game Over! Reiniciando...");
                resetGame();
            } else {
                mergePiece();
                piece = randomPiece();
                x = 3;
                y = 0;
            }
        }
        lastTime = time;
    }
    draw();
    requestAnimationFrame(dropPiece);
}

function mergePiece() {
    piece.forEach((row, r) => row.forEach((cell, c) => {
        if (cell) board[y + r][x + c] = "red";
    }));
    checkLines();
}

function checkLines() {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== "black")) {
            board.splice(r, 1);
            board.unshift(Array(COLS).fill("black"));
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    piece.forEach((row, r) => row.forEach((cell, c) => {
        if (cell) drawSquare(x + c, y + r, "red");
    }));
}

resetGame();
dropPiece();