const bird = {
    x: 20,
    y: 185,
    direction: null,
    sprite: document.querySelector('#bird')
}

bird.sprite.style.top = bird.y + 'px'
bird.sprite.style.left = bird.x + 'px'


const timerId = setInterval(function () {
    move()
}, 50)


function move() {
    if (bird.direction === 'up' && bird.y >= 0) { moveUp() }
    if (bird.direction === 'down' && bird.y <= 370) { moveDown() }
}

function moveUp() {
    bird.y -= 5
    bird.sprite.style.top = bird.y + 'px'
}
function moveDown() {
    bird.y += 5
    bird.sprite.style.top = bird.y + 'px'
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

