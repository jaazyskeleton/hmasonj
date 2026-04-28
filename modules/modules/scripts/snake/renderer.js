export function createRenderer(root, config) {space-between}";
  header.style.alignItems = "center";
  header.style.gap = "12px";
  header.style.flexWrap = "wrap";

  const title = document.createElement("div");
  title.innerHTML = `
    <div style="font-size: 18px; font-weight: 700; color: ${config.text};">Snake</div>
    <div style="font-size: 12px; opacity: .8; color: ${config.text};">
      Arrows/WASD • Space = pause • Enter = restart • Swipe on mobile
    </div>
  `;

  const stats = document.createElement("div");
  stats.style.display = "flex";
  stats.style.gap = "12px";
  stats.style.alignItems = "baseline";
  stats.style.color = config.text;

  const scoreEl = document.createElement("div");
  scoreEl.style.fontWeight = "700";
  scoreEl.textContent = "Score: 0";

  const bestEl = document.createElement("div");
  bestEl.style.opacity = "0.85";
  bestEl.textContent = "Best: 0";

  stats.append(scoreEl, bestEl);
  header.append(title, stats);

  const canvas = document.createElement("canvas");
  canvas.width = config.cols * config.cellSize;
  canvas.height = config.rows * config.cellSize;
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.borderRadius = "12px";
  canvas.style.background = config.bg;
  canvas.style.border = "1px solid rgba(0,0,0,0.08)";
  canvas.style.touchAction = "none";

  const footer = document.createElement("div");
  footer.style.display = "flex";
  footer.style.justifyContent = "space-between";
  footer.style.gap = "10px";
  footer.style.flexWrap = "wrap";
  footer.style.alignItems = "center";

  const messageEl = document.createElement("div");
  messageEl.style.color = config.text;
  messageEl.style.opacity = "0.9";
  messageEl.style.fontSize = "13px";
  messageEl.textContent = "";

  const btns = document.createElement("div");
  btns.style.display = "flex";
  btns.style.gap = "8px";

  const pauseBtn = document.createElement("button");
  pauseBtn.textContent = "Pause";
  styleBtn(pauseBtn);

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart";
  styleBtn(restartBtn);

  btns.append(pauseBtn, restartBtn);
  footer.append(messageEl, btns);

  wrap.append(header, canvas, footer);
  root.append(wrap);

  const ctx = canvas.getContext("2d");

  function draw(state) {
    // Background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = config.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x <= config.cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * config.cellSize + 0.5, 0);
      ctx.lineTo(x * config.cellSize + 0.5, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= config.rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * config.cellSize + 0.5);
      ctx.lineTo(canvas.width, y * config.cellSize + 0.5);
      ctx.stroke();
    }

    // Food
    if (state.food) {
      const { x, y } = state.food;
      roundedCell(ctx, x, y, config.cellSize, config.food, 7);
    }

    // Snake
    state.snake.body.forEach((p, idx) => {
      const color = idx === 0 ? config.snakeHead : config.snake;
      roundedCell(ctx, p.x, p.y, config.cellSize, color, 6);
    });

    // Overlay if paused or over
    if (state.status !== "running") {
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        state.status === "paused" ? "Paused" : (state.status === "won" ? "You win!" : "Game Over"),
        canvas.width / 2,
        canvas.height / 2 - 6
      );
      ctx.font = "14px Arial";
      ctx.fillText("Space = Resume/Pause • Enter = Restart", canvas.width / 2, canvas.height / 2 + 18);
    }
  }

  function updateHud({ score, best, status }) {
    scoreEl.textContent = `Score: ${score}`;
    bestEl.textContent = `Best: ${best}`;
    pauseBtn.textContent = status === "paused" ? "Resume" : "Pause";
  }

  function setMessage(msg) {
    messageEl.textContent = msg || "";
  }

  return {
    canvas,
    draw,
    updateHud,
    setMessage,
    pauseBtn,
    restartBtn,
  };
}

function roundedCell(ctx, x, y, size, fill, radius) {
  const px = x * size;
  const py = y * size;
  const r = Math.min(radius, size / 2);

  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(px + r, py);
  ctx.arcTo(px + size, py, px + size, py + size, r);
  ctx.arcTo(px + size, py + size, px, py + size, r);
  ctx.arcTo(px, py + size, px, py, r);
  ctx.arcTo(px, py, px + size, py, r);
  ctx.closePath();
  ctx.fill();
}

function styleBtn(btn) {
  btn.style.padding = "8px 12px";
  btn.style.borderRadius = "10px";
  btn.style.border = "1px solid rgba(0,0,0,0.15)";
  btn.style.background = "white";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
}
``
  const wrap = document.createElement("div");
  wrap.style.display = "grid";
  wrap.style.gap = "10px";
  wrap.style.maxWidth = "720px";
  wrap.style.margin = "0 auto";
  wrap.style.padding = "14px";
  wrap.style.borderRadius = "14px";
  wrap.style.boxShadow = "0 8px 22px rgba(0,0,0,0.12)";
  wrap.style.background = "rgba(255,255,255,0.6)";
  wrap.style.backdropFilter = "blur(6px)";

  const header = document.createElement("div");
  header.style.display = "flex";
