let gameActive;
// Messages 
const startMessage = `Click on any cell to start`;
const losingMessage = "YOU STEPPED ON A MINE, YOU LOST :(";
const winningMessage = "CONGRATULATIONS, YOU WON!";
const flagsLeft = (numberFlags) => `You have ${9 - numberFlags} flags left to place`;
const gameUnfinished = "You have not finished the game yet";
const displayMessage = document.querySelector(".gameStatus");

displayMessage.innerHTML = startMessage;

let components = {
    bomb: '💣',
    flag: '🚩',
}

// Create cells of the grid
for (let i = 1; i < 10; ++i) {
    for (let j = 1; j < 10; ++j) {
        var div = document.createElement("div");
        div.className = "cell";
        div.id = 10 * i + j;
        document.getElementById("gameContainer").appendChild(div);
    }
}

// Initialize matrix 
let gameStatus = new Array(11).fill(0).map(() => new Array(11).fill(0));
let bombPlacement = [""];

// Load Page, Place bombs 
document.addEventListener("DOMContentLoaded", function() {
    placeBombs();
    gameActive = true;
});

function placeBombs() {
    for (let k = 0; k < 9; ++k) {
        let randomBombRow = parseInt(Math.random() * 9) + 1;
        let randomBombCol = parseInt(Math.random() * 9) + 1;
        let cond = 0;
        let randomBomb = randomBombRow * 10 + randomBombCol;
        while (cond === 0) {
            cond = 1;
            if (bombPlacement.includes(randomBomb)) {
                cond = 0;
                randomBombRow = parseInt(Math.random() * 9) + 1;
                randomBombCol = parseInt(Math.random() * 9) + 1;
                randomBomb = randomBombRow * 10 + randomBombCol;
            }
        }
        bombPlacement[k] = randomBomb;
        gameStatus[randomBombRow][randomBombCol] = "BOMB";

    }
    numberBombs();
}
// Handle Clicks left / right.
document.querySelectorAll(".cell").forEach(cell => cell.addEventListener("click", clickCell));
document.querySelectorAll(".cell").forEach(cell => cell.addEventListener("contextmenu", rightClickCell));

function rightClickCell(rightClickEvent) {
    rightClickEvent.preventDefault();
    const rightClickBox = rightClickEvent.target;
    let rightClickIndex = parseInt(rightClickBox.id);
    placeFlag(rightClickBox, rightClickIndex);
    displayMessage.innerHTML = flagsLeft(numberFlags);
    return false;
}

// Placing the flags on right Click
let numberFlags = 0;
let timerActive = false;

function placeFlag(rightClickBox, rightClickIndex) {
    let box = document.getElementById(rightClickIndex);
    if (!timerActive) {
        start();
        timerActive = true;
    }
    if (box.textContent != components.flag) {
        if (numberFlags < 9) {
            box.textContent = components.flag;
            ++numberFlags;
            flagsLeft(numberFlags);
            return;
        }
    }
    if (box.textContent == components.flag) {
        box.textContent = "";
        --numberFlags;
        return;
    }
    flagsLeft(numberFlags);
}
// Open the cells and display numbers 
function clickCell(clickEvent) {
    const clickBox = clickEvent.target;
    let clickBoxIndex = parseInt(clickBox.id);
    makeMove(clickBoxIndex);
}


function makeMove(clickBoxIndex) {
    let cell = document.getElementById(clickBoxIndex);
    if (!timerActive) {
        start();
        timerActive = true;
    }
    if (gameActive) {
        rowsAndCols(clickBoxIndex, cell);
    }
}


function rowsAndCols(clickBoxIndex, cell) {
    let index = clickBoxIndex;
    let digits = index.toString().split('');
    let rowAndCol = digits.map(Number);
    let row;
    let col;
    if (rowAndCol.length == 1) {
        row = 0;
        col = rowAndCol[0];
    } else {
        row = rowAndCol[0];
        col = rowAndCol[1];
    }
    if (cell.style.backgroundColor != "white") {
        cell.style.backgroundColor = "white";
        ++clearCells;
    }
    checkCell(row, col, cell);
}

function numberBombs() {
    for (let row = 1; row < 10; ++row) {
        for (let col = 1; col < 10; ++col) {
            if (gameStatus[row][col] === "BOMB") {
                let temporaryCol = col - 1;
                let temporaryRow = row - 1;
                for (let x = 0; x < 3; ++x) {
                    for (let y = 0; y < 3; ++y) {
                        if (gameStatus[temporaryRow][temporaryCol] !== "BOMB") {
                            ++gameStatus[temporaryRow][temporaryCol];
                        }
                        if (temporaryRow == row) {
                            ++y;
                            temporaryCol += 2;
                        } else {
                            ++temporaryCol;
                        }
                    }
                    temporaryCol = col - 1;
                    ++temporaryRow;
                }

            }
        }
    }
}

let clearCells = 0;

// Find whether the cell contains a bomb, or a number.
function checkCell(row, col, cell) {
    let numBombs = gameStatus[row][col];

    if (row < 1 || col < 1) {
        return;
    }
    if (typeof(numBombs) === "string") {
        lostGame(cell);
        return;
    }
    if (numBombs == 0) {
        cell.style.backgroundColor = "white";
        return;
    }
    if (numBombs > 0) {
        cell.style.backgroundColor = "white";
        cell.textContent = numBombs;
        return;
    }
}
// What to do if a bomb has been stepped on
function lostGame(cell) {
    cell.textContent = components.bomb;
    gameActive = false;
    stop();
    displayMessage.innerHTML = losingMessage;
    return;
}
// See if person has won or if the game has not ended.
function validate() {
    if (gameActive && clearCells === 72 && numberFlags === 9) {
        gameActive = false;
        displayMessage.innerHTML = winningMessage;

    } else {
        displayMessage.innerHTML = gameUnfinished;
        stop();
        timerActive = false;
    }
}
// Restart 
function restartGame() {
    gameStatus = Array(12).fill(0).map(() => Array(12).fill(0));
    gameActive = true;
    displayMessage.innerHTML = startMessage;
    placeBombs();
    document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
    document.querySelectorAll(".cell").forEach(a => a.style.backgroundColor = "#ccc");
    resetTimer();
    stop();
    timerActive = false;
}

// buttons 
document.getElementById("resetGame").addEventListener("click", restartGame);
document.getElementById("finishGame").addEventListener("click", validate);

// Timer 
let seconds = document.getElementById("second");
let minutes = document.getElementById("minute");
seconds.innerHTML = 0;
minutes.innerHTML = 0;

let sec = 1;
let min = 1;
let cron;

function myTimer() {
    if (seconds.innerHTML > 58) {
        sec = 0;
        minutes.innerHTML = min;
        ++min;
    }
    seconds.innerHTML = sec;
    sec++;
}

function stop() {
    clearInterval(cron);
    cron = null;
}

function resetTimer() {
    seconds.innerHTML = 0;
    minutes.innerHTML = 0;
    sec = 1;
    min = 1;
}

function start() {
    cron = setInterval(myTimer, 1000);
}