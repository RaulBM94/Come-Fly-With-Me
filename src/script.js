//Declaración de variables
const bird = {
    x: 100,
    y: 185,
    direction: null,
    sprite: document.querySelector('#bird')
}
bird.sprite.style.top = bird.y + 'px'
bird.sprite.style.left = bird.x + 'px'

var enemies = []

function enemyStyle() {
    enemies.forEach(function (enemy) {
        enemy.sprite.style.top = enemy.y + 'px'
        enemy.sprite.style.left = enemy.x + 'px'
    })
}


var gameBoard = document.getElementById('gameboard')
var timerId = 0
var timer2 = 0
let int = 0;
let [milliseconds, seconds, minutes] = [0, 0, 0];
var dodge = 0
let timerRef = document.querySelector('.timerDisplay');
var score = document.getElementById('score');
var level = document.querySelector('#level');

//Comienzo del juego

function spawnEnemy() {
    var newEnemy = document.createElement('div');
    newEnemy.classList.add("enemy")
    var enemyObj = {
        x: 570,
        y: Math.floor(Math.random() * 340),
        sprite: newEnemy
    }
    enemies.push(enemyObj)
    enemyStyle()
    gameBoard.appendChild(newEnemy)
}

function start() {
    timerId = setInterval(function () {
        move()
        moveEnemy()
    }, 100)
    int = setInterval(displayTimer, 10);
    timer2 = setInterval(spawnEnemy(), 3000)
}

start()



function move() {
    if (bird.direction === 'up' && bird.y >= 40) { moveUp() }
    if (bird.direction === 'down' && bird.y <= 300) { moveDown() }
    scoreCounter()
    enemies.forEach(function (enemy) {
        if (enemy.x < bird.x + 40 &&
            enemy.y < bird.y + 30 &&
            enemy.x + 45 > bird.x &&
            enemy.y + 50 > bird.y) {
            alert(`Game Over`)
            clearInterval(timerId)
            clearInterval(timer2)
            restart()
            clearInterval(int);
            [milliseconds, seconds, minutes] = [0, 0, 0];
            timerRef.innerHTML = '00 : 00 : 000 ';
            dodge = 0
        }
    })

}


function moveUp() {
    bird.y -= 10
    bird.sprite.style.top = bird.y + 'px'
}

function moveDown() {
    bird.y += 10
    bird.sprite.style.top = bird.y + 'px'
}

function moveEnemy() {
    enemies.forEach(function (enemy) {
        if (enemy.x >= 5) {
            enemy.x -= 5
            enemy.sprite.style.left = enemy.x + 'px'
        } else {
            gameBoard.removeChild(enemy.sprite)
            enemy.x = 570
            enemies.shift(enemy)
        }
    })
}


function restart() {
    bird.x = 100
    bird.y = 185
    bird.direction = null
    bird.sprite.style.top = bird.y + 'px'
    bird.sprite.style.left = bird.x + 'px'
    var remove = document.querySelectorAll('.enemy')
    remove.forEach(function(elem){
        gameBoard.removeChild(elem)
    })
    enemies = []
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

function scoreCounter() {
    enemies.forEach(function (enemy) {
        if (enemy.x === 5) {
            dodge++
        }
    })
    score.innerHTML = dodge
}
