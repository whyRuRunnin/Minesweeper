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