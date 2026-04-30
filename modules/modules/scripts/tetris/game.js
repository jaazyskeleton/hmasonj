export function startTetris(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('scoreBoard');
    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 25;
    const OFFSET_X = (canvas.width - COLS * BLOCK_SIZE) / 2;
    const OFFSET_Y = (canvas.height - ROWS * BLOCK_SIZE) / 2;

    let board, player, dropCounter, lastTime, isGameOver, dropInterval, score;

    const COLORS = [null, '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'];
    const PIECES = 'ILJOTSZ';

    function createPiece(type) {
        if (type === 'I') return [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]];
        if (type === 'L') return [[0, 2, 0], [0, 2, 0], [0, 2, 2]];
        if (type === 'J') return [[0, 3, 0], [0, 3, 0], [3, 3, 0]];
        if (type === 'O') return [[4, 4], [4, 4]];
        if (type === 'Z') return [[5, 5, 0], [0, 5, 5], [0, 0, 0]];
        if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
        if (type === 'T') return [[0, 7, 0], [7, 7, 7], [0, 0, 0]];
    }

    function updateScore() {
        scoreElement.innerText = `Score: ${score}`;
    }

    function init() {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        player = { pos: { x: 3, y: 0 }, matrix: createPiece(PIECES[Math.floor(Math.random() * PIECES.length)]) };
        dropCounter = 0;
        dropInterval = 1000;
        lastTime = 0;
        score = 0;
        isGameOver = false;
        updateScore();
        update();
    }

    function draw() {
        ctx.fillStyle = '#f4f4f4';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.fillRect(OFFSET_X, OFFSET_Y, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        
        drawMatrix(board, { x: 0, y: 0 });
        drawMatrix(player.matrix, player.pos);
        if (isGameOver) drawGameOver();
    }

    function drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = COLORS[value];
                    ctx.fillRect((x + offset.x) * BLOCK_SIZE + OFFSET_X, (y + offset.y) * BLOCK_SIZE + OFFSET_Y, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect((x + offset.x) * BLOCK_SIZE + OFFSET_X, (y + offset.y) * BLOCK_SIZE + OFFSET_Y, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }

    function drawGameOver() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press 'R' to Restart", canvas.width / 2, canvas.height / 2 + 40);
    }

    function collide(board, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) return true;
            }
        }
        return false;
    }

    function merge(board, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) board[y + player.pos.y][x + player.pos.x] = value;
            });
        });
    }

    function playerReset() {
        player.matrix = createPiece(PIECES[Math.floor(Math.random() * PIECES.length)]);
        player.pos.y = 0;
        player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
        if (collide(board, player)) isGameOver = true;
    }

    function playerDrop() {
        player.pos.y++;
        if (collide(board, player)) {
            player.pos.y--;
            merge(board, player);
            playerReset();
            arenaSweep();
        }
        dropCounter = 0;
    }

    function rotate(matrix) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
        matrix.forEach(row => row.reverse());
    }

    function arenaSweep() {
        let rowCount = 0;
        outer: for (let y = ROWS - 1; y >= 0; --y) {
            for (let x = 0; x < COLS; ++x) {
                if (board[y][x] === 0) continue outer;
            }
            const row = board.splice(y, 1)[0].fill(0);
            board.unshift(row);
            ++y;
            rowCount++;
        }
        
        if (rowCount > 0) {
            // Scoring: 1: 100, 2: 300, 3: 500, 4: 800
            const scores = [0, 100, 300, 500, 800];
            score += scores[rowCount];
            updateScore();
        }
    }

    function update(time = 0) {
        if (isGameOver) { draw(); return; }
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) playerDrop();
        draw();
        requestAnimationFrame(update);
    }

    document.addEventListener('keydown', event => {
        if (isGameOver && event.keyCode === 82) init();
        if (isGameOver) return;

        if (event.keyCode === 37) { // Left
            player.pos.x--; 
            if (collide(board, player)) player.pos.x++; 
        }
        if (event.keyCode === 39) { // Right
            player.pos.x++; 
            if (collide(board, player)) player.pos.x--; 
        }
        if (event.keyCode === 40) { // Down
            dropInterval = 50; 
        }
        if (event.keyCode === 38 || event.keyCode === 32) { // Up/Space
            const pos = player.pos.x;
            let offset = 1;
            rotate(player.matrix);
            while (collide(board, player)) {
                player.pos.x += offset;
                offset = -(offset + (offset > 0 ? 1 : -1));
                if (offset > player.matrix[0].length) {
                    rotate(player.matrix); rotate(player.matrix); rotate(player.matrix);
                    player.pos.x = pos;
                    return;
                }
            }
        }
    });

    document.addEventListener('keyup', event => {
        if (event.keyCode === 40) dropInterval = 1000;
    });

    init();
}