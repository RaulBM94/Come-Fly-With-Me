var score = 0


/*
 * BIRD
 * -- Manejo de nuestro personaje
 */
function Bird() {
  this.x = 100
  this.y = 185
  this.direction = null
  this.sprite = document.querySelector('#bird')
  this.sprite.style.top = this.y + 'px'
  this.sprite.style.left = this.x + 'px'
  this.sprite.style.display = ''
  this.move = function () {
    // pajaro hacia arriba
    if (this.direction === 'up' && this.y >= 40) {
      this.y -= 10
      this.sprite.style.top = this.y + 'px'
    }
    //pajaro hacia debajo
    if (this.direction === 'down' && this.y <= 300) {
      this.y += 10
      this.sprite.style.top = this.y + 'px'
    }
  }

}
let bird = new Bird()

document.addEventListener('keydown', function (e) {
  switch (e.code) {
    case 'ArrowUp':
      bird.direction = 'up';
      break;
    case 'ArrowDown':
      bird.direction = 'down';
      break;
  }
})
document.addEventListener('keyup', function (e) {
  if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    bird.direction = null
  }
})

/*
 * ENEMY
 * -- Genera un enemigo
 */
function Enemy() {
  this.x = 535;
  this.y = Math.floor(Math.random() * 340);

  var newEnemy = document.createElement('div');
  newEnemy.classList.add("enemy")
  newEnemy.style.top = this.y + 'px'

  this.sprite = newEnemy

  this.move = function () {
    if (this.x >= -57) {
      this.x --
      this.sprite.style.left = this.x + 'px'
    } else {
      gameBoard.removeChild(this.sprite)
      enemies.blueBirds.shift()
      score++
      document.getElementById('score').innerHTML = score
    }
  }

  // is Enemy collisioning with bird?
  this.checkCollision = function () {
    return (
      this.x < bird.x + 40 &&
      this.y < bird.y + 30 &&
      this.x + 45 > bird.x &&
      this.y + 50 > bird.y)
  }

  this.move()
}


/*
 * ENEMIES
 * -- Array de enemigos
 */
function Enemies(max) {
  this.blueBirds = []
  this.MAX_ENEMIES = max

  this.addEnemy = () => {
    const newEnemy = new Enemy()
    this.blueBirds.push(newEnemy)
    gameBoard.appendChild(newEnemy.sprite)
    this.MAX_ENEMIES--
  }

  this.checkCollisionWithBird = function () {
    let collisions = false
    for (let i = 0; i < this.blueBirds.length; i++) {
      if (this.blueBirds[i].checkCollision()) {
        return true
      }
    }
    return false;
  }

  this.move = function () {
    this.blueBirds.forEach(enemy => {
      enemy.move()
    })
  }

  this.removeAll = function () {
    this.blueBirds.forEach(function (enemy) {
      gameBoard.removeChild(enemy.sprite)
    })
    this.blueBirds = []
  }
}


const enemies = new Enemies(2)

var resetButton = document.getElementById('restartButton')
var reset = document.getElementById('restart')
var replayButton = document.getElementById('replayButton')
var winner = document.getElementById('winner')

function displayButtonWinner() {
  //fondo estatico
  gameBoard.style.backgroundImage = 'url("../assets/fondo_est??tico.png")'
  //eliminar visualizaci??n p??jaro
  bird.sprite.style.display = 'none'
  //eliminar visualizaci??n enemigos
  enemies.removeAll()
  //aparici??n de pantalla y bot??n
  winner.style.display = ''
}

function displayButtonLoser() {
  //fondo estatico
  gameBoard.style.backgroundImage = 'url("../assets/fondo_est??tico.png")'
  //eliminar visualizaci??n p??jaro
  bird.sprite.style.display = 'none'
  //eliminar visualizaci??n enemigos
  enemies.removeAll()
  //aparici??n de pantalla y bot??n
  reset.style.display = ''
}

var gameBoard = document.getElementById('gameboard')
var level = document.querySelector('#level');

function gameOver() {
  // Paramos musica y suena efecto
  bg_music.pause();
  bg_music.currentTime = 0;
  const loser = new Audio("../assets/music/Lose.mp3")
  loser.volume = 0.1;
  loser.loop = false;
  loser.play();

  // Paramos todos los timers
  clearInterval(game_timerId)
  game_timerId = null
  clearInterval(enemies_timerId)
  clearInterval(timer_timerId)

  setTimeout(displayButtonLoser, 3000)
}
var Winner = new Audio("../assets/music/Winner2.mp3")
function win() {
  bg_music.pause();
  bg_music.currentTime = 0;
  Winner.volume = 0.2;
  Winner.loop = true;
  Winner.play();

  // Paramos todos los timers
  clearInterval(game_timerId)
  game_timerId = null
  clearInterval(enemies_timerId)
  clearInterval(timer_timerId)

  displayButtonWinner()
}

function checkCollisions() {
  if (enemies.checkCollisionWithBird()) {
    gameOver()
  }
}

var LevelUp = new Audio("../assets/music/LevelUp.mp3")

function checkWin() {
  if (game_timerId !== null && enemies.MAX_ENEMIES === 0 && enemies.blueBirds.length === 0) {
    LevelUp.volume = 0.2;
    LevelUp.loop = false;
    LevelUp.play();
    setTimeout(win(),2000)
  }
}

/*
 * TIMER
 * -- displayTimer: Avanza el contador y actualiza el HTML
 */

let [seconds, minutes] = [0, 0]
let timerRef = document.querySelector('.timerDisplay')
function resetTimer() {
  [seconds, minutes] = [0, 0];
  timerRef.innerHTML = '00 : 00';
}

function displayTimer() {
  seconds++;
  if (seconds == 60) {
    seconds = 0;
    minutes++;
  }

  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;

  timerRef.innerHTML = `${m} : ${s}`;
}


/*
 * GAME
 * -- start: arranca el juego, pajaro, enemigo y cron??metro
 */
let game_timerId = null
let enemies_timerId
let timer_timerId
var bg_music = new Audio("../assets/music/bg_music.mp3")
function start() {
  bg_music.volume = 0.1;
  bg_music.loop = true;
  bg_music.play();
  // Movimiento del p??jaro
  game_timerId = setInterval(function () {
    bird.move()
    enemies.move()
    checkCollisions()
    checkWin()
  }, 20)

  // Generaci??n de enemigos
  enemies_timerId = setInterval(function () {
    if (enemies.MAX_ENEMIES !== 0) {
      enemies.addEnemy()
    }
  }, 3000)

  // Arranca Cron??metro
  timer_timerId = setInterval(displayTimer, 800);
}

const startButton = document.getElementById('start')


startButton.addEventListener('click', function () {
  startButton.style.display = 'none';
  start();
})

resetButton.addEventListener('click', function () {
  reset.style.display = 'none';
  gameBoard.style.backgroundImage = "url('../assets/fondo_animado.gif')"
  bird = new Bird()
  enemies.removeAll()
  resetTimer()
  score = 0
  document.getElementById('score').innerHTML = score
  enemies.MAX_ENEMIES = 2
  start()
})

replayButton.addEventListener('click', function () {
  Winner.pause();
  Winner.currentTime = 0;
  winner.style.display = 'none';
  gameBoard.style.backgroundImage = "url('../assets/fondo_animado.gif')"
  bird = new Bird()
  // enemies.removeAll()
  resetTimer()
  score = 0
  document.getElementById('score').innerHTML = score
  enemies.MAX_ENEMIES = 2
  start()
})

var quit_loser = document.querySelector('#quit_loser')
quit_loser.addEventListener('click', function () {
  startButton.style.display = '';
  winner.style.display = 'none';
  reset.style.display = 'none';
  gameBoard.style.backgroundImage = "url('../assets/fondo_animado.gif')"
  bird = new Bird()
  enemies.removeAll()
  resetTimer()
  score = 0
  document.getElementById('score').innerHTML = score
  enemies.MAX_ENEMIES = 2
})

var quit_win = document.querySelector('#quit_win')
quit_win.addEventListener('click', function () {
  Winner.pause();
  Winner.currentTime = 0;
  startButton.style.display = '';
  winner.style.display = 'none';
  reset.style.display = 'none';
  gameBoard.style.backgroundImage = "url('../assets/fondo_animado.gif')"
  bird = new Bird()
  enemies.removeAll()
  resetTimer()
  score = 0
  document.getElementById('score').innerHTML = score
  enemies.MAX_ENEMIES = 2
})