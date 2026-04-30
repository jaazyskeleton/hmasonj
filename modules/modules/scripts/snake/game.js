export function startSnake(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('scoreBoard');
    const gridSize = 20;

    let snake, food, dx, dy, changingDirection, gameId, isGameOver, score;

    function updateScore() {
        if (scoreElement) scoreElement.innerText = `Score: ${score}`;
    }

    function init() {
        // Clear any existing game loop
        clearTimeout(gameId);
        
        snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }];
        dx = gridSize;
        dy = 0;
        changingDirection = false;
        isGameOver = false;
        score = 0;
        
        createFood();
        updateScore();
        main();
    }

    function main() {
        if (didGameEnd()) {
            isGameOver = true;
            drawGameOver();
            return;
        }

        gameId = setTimeout(function onTick() {
            // Reset direction lock ONLY when the tick actually processes
            changingDirection = false; 
            
            clearCanvas();
            drawFood();
            advanceSnake();
            drawSnake();
            main();
        }, 95);
    }

    function clearCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Optional: Canvas Border
        ctx.strokeStyle = "#666";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        snake.forEach(part => {
            ctx.fillStyle = 'lightgreen';
            ctx.strokeStyle = 'white';
            ctx.fillRect(part.x, part.y, gridSize, gridSize);
            ctx.strokeRect(part.x, part.y, gridSize, gridSize);
        });
    }

    function advanceSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        
        if (snake[0].x === food.x && snake[0].y === food.y) {
            score += 1;
            updateScore();
            createFood();
        } else {
            snake.pop();
        }
    }

    function didGameEnd() {
        // Check if head hit body
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
        }
        // Check if head hit walls
        const hitLeft = snake[0].x < 0;
        const hitRight = snake[0].x > canvas.width - gridSize;
        const hitTop = snake[0].y < 0;
        const hitBottom = snake[0].y > canvas.height - gridSize;
        
        return hitLeft || hitRight || hitTop || hitBottom;
    }

    function drawGameOver() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "20px Arial";
        ctx.fillText("Press 'R' to Restart", canvas.width / 2, canvas.height / 2 + 30);
    }

    function createFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
        // Ensure food doesn't spawn on snake
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) createFood();
        });
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'white';
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
        ctx.strokeRect(food.x, food.y, gridSize, gridSize);
    }

    function handleInput(event) {
        const keyPressed = event.keyCode;
        
        if (isGameOver && (keyPressed === 82 || keyPressed === 114)) {
            init();
            return;
        }

        if (changingDirection) return;

        const UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39;
        const goingUp = dy === -gridSize;
        const goingDown = dy === gridSize;
        const goingRight = dx === gridSize;
        const goingLeft = dx === -gridSize;

        if (keyPressed === LEFT && !goingRight) { dx = -gridSize; dy = 0; changingDirection = true; }
        if (keyPressed === UP && !goingDown) { dx = 0; dy = -gridSize; changingDirection = true; }
        if (keyPressed === RIGHT && !goingLeft) { dx = gridSize; dy = 0; changingDirection = true; }
        if (keyPressed === DOWN && !goingUp) { dx = 0; dy = gridSize; changingDirection = true; }
    }

    // Use a named function so we can remove it if needed, 
    // or check if it's already attached.
    document.removeEventListener("keydown", handleInput);
    document.addEventListener("keydown", handleInput);
    
    init();
}