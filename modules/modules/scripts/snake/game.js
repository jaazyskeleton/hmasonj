import { createSnake, setNextDirection, moveSnake, growSnake, snakeOccupancySet, isSelfCollision } from "./snake.js";
import { spawnFood } from "./food.js";

export class SnakeGame {
  constructor({ config, renderer, inputAttach }) {
    this.config = config;
    this.renderer = renderer;

    this.status = "running"; // running | paused | over | won
    this.score = 0;

    this.bestKey = "snake_best_score";
    this.best = Number(localStorage.getItem(this.bestKey) || 0);

    const midX = Math.floor(config.cols / 2);
    const midY = Math.floor(config.rows / 2);
    this.snake = createSnake(midX, midY);

    this.food = spawnFood(config.cols, config.rows, snakeOccupancySet(this.snake));

    this._timer = null;

    this.detachInput = inputAttach({
      element: renderer.canvas,
      onDirection: (dir) => {
        if (this.status === "over" || this.status === "won") return;
        setNextDirection(this.snake, dir);
      },
      onTogglePause: () => this.togglePause(),
      onRestart: () => this.reset(),
    });

    this.renderer.pauseBtn.addEventListener("click", () => this.togglePause());
    this.renderer.restartBtn.addEventListener("click", () => this.reset());
  }

  start() {
    this.stop();
    this._timer = setInterval(() => this.tick(), this.config.tickMs);
    this.render();
  }

  stop() {
    if (this._timer) clearInterval(this._timer);
    this._timer = null;
  }

  togglePause() {
    if (this.status === "over" || this.status === "won") return;
    this.status = this.status === "paused" ? "running" : "paused";
    this.render();
  }

  reset() {
    const midX = Math.floor(this.config.cols / 2);
    const midY = Math.floor(this.config.rows / 2);
    this.snake = createSnake(midX, midY);
    this.food = spawnFood(this.config.cols, this.config.rows, snakeOccupancySet(this.snake));
    this.score = 0;
    this.status = "running";
    this.renderer.setMessage("");
    this.render();
  }

  tick() {
    if (this.status !== "running") return;

    const head = moveSnake(this.snake);

    // Wall collision
    if (head.x < 0 || head.x >= this.config.cols || head.y < 0 || head.y >= this.config.rows) {
      this.status = "over";
      this.onEnd();
      this.render();
      return;
    }

    // Self collision
    if (isSelfCollision(this.snake)) {
      this.status = "over";
      this.onEnd();
      this.render();
      return;
    }

    // Eat food
    if (this.food && head.x === this.food.x && head.y === this.food.y) {
      growSnake(this.snake, 1);
      this.score += 10;

      const occ = snakeOccupancySet(this.snake);
      this.food = spawnFood(this.config.cols, this.config.rows, occ);

      if (!this.food) {
        this.status = "won";
        this.onEnd();
        this.render();
        return;
      }
    }

    this.render();
  }

  onEnd() {
    if (this.score > this.best) {
      this.best = this.score;
      localStorage.setItem(this.bestKey, String(this.best));
      this.renderer.setMessage("New best score!");
    } else {
      this.renderer.setMessage("");
    }
  }

  render() {
    this.renderer.updateHud({ score: this.score, best: this.best, status: this.status });
    this.renderer.draw({
      status: this.status,
      score: this.score,
      best: this.best,
      snake: this.snake,
      food: this.food,
    });
  }

  destroy() {
    this.stop();
    this.detachInput?.();
  }
}
