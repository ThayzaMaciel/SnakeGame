const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")


const audio = new Audio('../assets/audio.mp3')

const size = 30

const initialPosition = { x:300, y:300 }

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText =(+score.innerText + 10).toString().padStart(2, '0')
}

const randomNunber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
   const number = randomNunber(0, canvas.width - size)
   return Math.round(number / 30) * 30

}

const food = {
    x: randomPosition(0, 570),
    y: randomPosition(0, 570),
    color: "red"
}

let direction
let loopId
let gameSpeed = 300
let gameOverFlag = false

const drawFood = () => {
    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = food.color
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "purple"
  
    snake.forEach((position, index) => {
         if(index == snake.length -1){
            ctx.fillStyle = "violet"
         }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if(!direction) return

    const head = snake[snake.length -1]
    let newHead

    snake.shift()

    if  (direction == "right") {
        snake.push({x: head.x + size, y:head.y})
    }

    if  (direction == "left") {
        snake.push({x: head.x - size, y:head.y})
    }

    if  (direction == "down") {
        snake.push({x: head.x, y:head.y + size})
    }

    if  (direction =="up") {
        snake.push({x: head.x, y:head.y - size})
    }

}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "purple"

    for (let i = 30; i< canvas.width; i +=30) {
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 600)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)
    ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if(head.x === food.x && head.y === food.y) {
        incrementScore()
        snake.push({...head})
        
        audio.currentTime = 0
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        food.x = x
        food.y = y
        food.color = "red"
    }

}

const checkCollision = () => {
    const head = snake[snake.length -1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length -2

    const wallCollision = head .x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    } )

    if(wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    gameOverFlag = true

    menu.style.display = "flex"
    canvas.style.filter = "blur(2px)"
    finalScore.innerText = score.innerText
}

const gameLoop = () =>{
    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawSnake()
    moveSnake()
    drawFood()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, gameSpeed)
}

gameLoop()

document.addEventListener("keydown", ({key}) => {
    if (gameOverFlag) return

    
    if( key == "ArrowRight" && direction !== "left" ) {
        direction = "right"
    }

    if( key == "ArrowLeft" && direction !== "right") {
        direction = "left"
    }

    if( key == "ArrowDown" && direction !=="up") {
        direction = "down"
    }

    if( key == "ArrowUp" && direction !=="down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
    gameSpeed = 300
    gameOverFlag = false
})