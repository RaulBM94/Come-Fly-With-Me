var score = 0


/*
 * BIRD
 * -- Manejo de nuestro personaje
 */
function Bird() {
  this.x= 100
  this.y= 185
  this.direction= null
  this.sprite= document.querySelector('#bird')
  this.sprite.style.top = this.y + 'px'
  this.sprite.style.left = this.x + 'px'

  this.move = function() {
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
 * ENEMIES
 * -- Array de enemigos
 */
function Enemies() {
  this.blueBirds = []

  this.addEnemy = () => {
    const newEnemy = new Enemy()
    this.blueBirds.push(newEnemy)
    gameBoard.appendChild(newEnemy.sprite)
  }

  this.checkCollisionWithBird = function() {
    let collisions = false
    for (let i=0; i<this.blueBirds.length; i++) {
      if (this.blueBirds[i].checkCollision()) {
        return true
      }
    }
    return false;
  }

  this.move = function() {
    this.blueBirds.forEach(enemy => {
      enemy.move()
    })
  }

  this.removeAll = function() {
    this.blueBirds.forEach(function (enemy) {
      gameBoard.removeChild(enemy.sprite)
    })

    this.blueBirds = []
  }
}
const enemies = new Enemies()


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
  this.checkCollision = function() {
    return (
      this.x < bird.x + 40 &&
      this.y < bird.y + 30 &&
      this.x + 45 > bird.x &&
      this.y + 50 > bird.y)
  }

  this.move()
}

var gameBoard = document.getElementById('gameboard')
var level = document.querySelector('#level');


function gameOver() {

  // Paramos todos los timers
  clearInterval(game_timerId)
  clearInterval(enemies_timerId)
  clearInterval(timer_timerId)

  alert(`Game Over`)
  restart()
}

function checkCollisions() {
  if (enemies.checkCollisionWithBird()) {
    gameOver()
  }
}


function restart() {
  bird = new Bird()
  enemies.removeAll()
  resetTimer()
  score = 0
  startButton.style= '';
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
 * -- start: arranca el juego, pajaro, enemigo y cronómetro
 */
let game_timerId
let enemies_timerId
let timer_timerId

function start() {
  // Movimiento del pájaro
  game_timerId = setInterval(function () {
    bird.move()
    enemies.move()
    checkCollisions()
  }, 20)

  // Generación de enemigos
  enemies_timerId = setInterval(enemies.addEnemy, 2000)

  // Arranca Cronómetro
  timer_timerId = setInterval(displayTimer, 1000);
}

const startButton = document.getElementById('start')
startButton.addEventListener('click', function () {
  startButton.style.display = 'none';
  start();
})
