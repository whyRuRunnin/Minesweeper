let gameActive;
const startMessage = () => `Click on any cell to start`;
const losingMessage = () => `YOU STEPPED ON A MINE, YOU LOST :(`;
const winningMessage = () => `CONGRATULATIONS, YOU WON!`;
const flagsLeft = (numberFlags) => `You have ${10 - numberFlags} flags left to place`;
const gameUnfinished = () => `You have not finished the game yet`;
const displayMessage = document.querySelector(".gameStatus");
displayMessage.innerHTML = startMessage();

let components = {
    bomb: '💣',
    flag: '🚩',
}

// Create cells of the grid
for (let i = 0; i < 100; ++i) {
    var div = document.createElement("div");
    div.className = "cell";
    div.id = i;
    document.getElementById("gameContainer").appendChild(div);
}

// Initialize matrix 
let gameStatus = new Array(10).fill(0).map(() => new Array(10).fill(0));
let bombPlacement = [""];

// Load Page, Place bombs 
document.addEventListener("DOMContentLoaded", function() {
    placeBombs();
    gameActive = true;
});

function placeBombs() {
    for (let k = 0; k < 10; ++k) {
        let randomBombRow = parseInt(Math.random() * 10);
        let randomBombCol = parseInt(Math.random() * 10);
        let cond = 0;
        let randomBomb = randomBombRow * 10 + randomBombCol;
        while (cond === 0) {
            cond = 1;
            if (bombPlacement.includes(randomBomb)) {
                cond = 0;
                randomBombRow = parseInt(Math.random() * 10);
                randomBombCol = parseInt(Math.random() * 10);
                randomBomb = randomBombRow * 10 + randomBombCol;
            }
        }
        bombPlacement[k] = randomBomb;
        gameStatus[randomBombRow][randomBombCol] = "BOMB";
    }
    numberBombs();
}

function numberBombs() {
    for (let row = 0; row < 10; ++row) {
        for (let col = 0; col < 10; ++col) {
            if (gameStatus[row][col] === "BOMB") {
                // topRow
                if (row - 1 >= 0 && col - 1 >= 0 && gameStatus[row - 1][col - 1] !== "BOMB") {
                    ++gameStatus[row - 1][col - 1];
                }
                if (row - 1 >= 0 && gameStatus[row - 1][col] !== "BOMB") {
                    ++gameStatus[row - 1][col];
                }
                if (row - 1 > 0 && col + 1 <= 9 && gameStatus[row - 1][col + 1] !== "BOMB") {
                    ++gameStatus[row - 1][col + 1];
                }
                // middleRow 
                if (col - 1 >= 0 && gameStatus[row][col - 1] !== "BOMB") {
                    ++gameStatus[row][col - 1];
                }
                if (col + 1 <= 9 && gameStatus[row][col + 1] !== "BOMB") {
                    ++gameStatus[row][col + 1];
                }
                // botRow 
                if (row + 1 <= 9 && col - 1 >= 0 && gameStatus[row + 1][col - 1] !== "BOMB") {
                    ++gameStatus[row + 1][col - 1];
                }
                if (row + 1 <= 9 && gameStatus[row + 1][col] !== "BOMB") {
                    ++gameStatus[row + 1][col];
                }
                if (row + 1 <= 9 && col + 1 <= 9 && gameStatus[row + 1][col + 1] !== "BOMB") {
                    ++gameStatus[row + 1][col + 1];
                }
            }
        }
    }

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

function placeFlag(rightClickBox, rightClickIndex) {
    let box = document.getElementById(rightClickIndex);
    if (box.textContent != components.flag) {
        if (numberFlags < 10) {
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
    start();

    if (gameActive) {
        if (clickBoxIndex < 10) {
            smallIndex(clickBoxIndex, cell);
            return;
        }
        bigIndex(clickBoxIndex, cell);
    }
}

function smallIndex(clickBoxIndex, cell) {
    let row = 0;
    let col = clickBoxIndex;
    if (cell.style.backgroundColor != "white") {
        cell.style.backgroundColor = "white";
        ++clearCells;
    }
    checkCell(row, col, cell);
}

function bigIndex(clickBoxIndex, cell) {
    let index = clickBoxIndex;
    let digits = index.toString().split('');
    let rowAndCol = digits.map(Number);
    let row = rowAndCol[0];
    let col = rowAndCol[1];
    if (cell.style.backgroundColor != "white") {
        cell.style.backgroundColor = "white";
        ++clearCells;
    }
    checkCell(row, col, cell);
}


let clearCells = 0;

// Find whether the cell contains a bomb, or a number.
function checkCell(row, col, cell) {
    let a = gameStatus[row][col];
    if (row < 0 || col < 0) {
        return;
    }
    if (typeof(a) === "string") {
        lostGame(cell);
        return;
    }
    if (a == 0) {
        cell.style.backgroundColor = "white";
        return;
    }
    if (a > 0) {
        cell.style.backgroundColor = "white";
        cell.textContent = a;
        return;
    }
}
// What to do if a bomb has been stepped on
function lostGame(cell) {
    cell.textContent = components.bomb;
    gameActive = false;
    pause();
    displayMessage.innerHTML = losingMessage();
    return;
}
// See if person has won or if the game has not ended.
function validate() {
    if (gameActive && clearCells === 90 && numberFlags === 10) {
        gameActive = false;
        displayMessage.innerHTML = winningMessage();
        pause();
    } else {
        displayMessage.innerHTML = gameUnfinished();
        pause();
    }
}
// Restart 
function restartGame() {
    gameStatus = Array(10).fill(0).map(() => Array(10).fill(0));
    gameActive = true;
    displayMessage.innerHTML = startMessage();
    placeBombs();
    document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
    document.querySelectorAll(".cell").forEach(a => a.style.backgroundColor = "#ccc");
}

// buttons 
document.getElementById("resetGame").addEventListener("click", reset);
document.getElementById("finishGame").addEventListener("click", validate);

// TIMER 
"use strict";

let hour = 0;
let minute = 0;
let second = 0;
let millisecond = 0;
let cron;

function start() {
    if (gameActive) {
        pause();
        cron = setInterval(() => { timer(); }, 10);
    }
}

function pause() {
    clearInterval(cron);
}

function reset() {
    hour = 0;
    minute = 0;
    second = 0;
    millisecond = 0;
    document.getElementById('hour').innerText = '00';
    document.getElementById('minute').innerText = '00';
    document.getElementById('second').innerText = '00';
    document.getElementById('millisecond').innerText = '000';
    restartGame();
    pause();
}

function timer() {
    if ((millisecond += 10) == 1000) {
        millisecond = 0;
        second++;
    }
    if (second == 60) {
        second = 0;
        minute++;
    }
    if (minute == 60) {
        minute = 0;
        hour++;
    }
    document.getElementById('hour').innerText = returnData(hour);
    document.getElementById('minute').innerText = returnData(minute);
    document.getElementById('second').innerText = returnData(second);
    document.getElementById('millisecond').innerText = returnData(millisecond);
}

function returnData(input) {
    return input > 10 ? input : `0${input}`;
}