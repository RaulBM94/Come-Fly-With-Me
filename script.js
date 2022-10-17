//Declaración de variables
const bird = {
    x: 100,
    y: 185,
    direction: null,
    sprite: document.querySelector('#bird')
}
bird.sprite.style.top = bird.y + 'px'
bird.sprite.style.left = bird.x + 'px'

const enemy = {
    x: 570,
    y: 185,
    direction: null,
    sprite: document.querySelector('#enemy')
}
enemy.sprite.style.top = enemy.y + 'px'
enemy.sprite.style.left = enemy.x + 'px'

var gameBoard = document.getElementById('gameboard')
var timerId = 0
let int = 0;
let [milliseconds, seconds, minutes] = [0, 0, 0];
let timerRef = document.querySelector('.timerDisplay');


//Comienzo del juego
function start() {
    timerId = setInterval(function () {
        move()
        moveEnemy()
    }, 50)
    int = setInterval(displayTimer, 10);
}

start()

function move() {
    if (enemy.x <= bird.x + 30 && enemy.y >= bird.y && enemy.y <= bird.y + 30) {
        alert(`Game Over`)
        clearInterval(timerId)
        restart()
        clearInterval(int);
        [milliseconds, seconds, minutes] = [0, 0, 0];
        timerRef.innerHTML = '00 : 00 : 000 ';
    } else {
        if (bird.direction === 'up' && bird.y >= 0) { moveUp() }
        if (bird.direction === 'down' && bird.y <= 370) { moveDown() }
    }
}

function moveUp() {
    bird.y -= 5
    bird.sprite.style.top = bird.y + 'px'
}

function moveDown() {
    bird.y += 5
    bird.sprite.style.top = bird.y + 'px'
}
function moveEnemy() {
    if (enemy.x >= 5) {
        enemy.x -= 5
        enemy.sprite.style.left = enemy.x + 'px'
    } else {
        gameBoard.removeChild(enemy.sprite)
        enemy.x = 570
        gameBoard.appendChild(enemy.sprite)
    }
}

function restart() {
    bird.x = 100
    bird.y = 185
    bird.direction = null
    enemy.x = 570
    enemy.y = 185
    start()
}

document.addEventListener('keydown', function (e) {
    switch (e.code) {
        case 'ArrowUp':
            bird.direction = 'up'
            break
        case 'ArrowDown': bird.direction = 'down'
            break
    }
})
document.addEventListener('keyup', function (e) {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        bird.direction = null
    }
})


function displayTimer() {
    milliseconds += 10;
    if (milliseconds == 1000) {
        milliseconds = 0;
        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
        }
    }
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    timerRef.innerHTML = `${m} : ${s}`;
}



