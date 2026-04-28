import { keyOf } from "./utils.js";

export function createSnake(startX, startY) {
  // Start with length 3 heading right
  const body = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];

  return {
    body,
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    pendingGrowth: 0,
  };
}

export function setNextDirection(snake, dir) {
  // Prevent reversing directly into yourself
  const { x, y } = snake.dir;
  if (dir.x === -x && dir.y === -y) return;
  snake.nextDir = dir;
}

export function moveSnake(snake) {
  snake.dir = snake.nextDir;

  const head = snake.body[0];
  const newHead = { x: head.x + snake.dir.x, y: head.y + snake.dir.y };
  snake.body.unshift(newHead);

  if (snake.pendingGrowth > 0) {
    snake.pendingGrowth -= 1;
  } else {
    snake.body.pop();
  }

  return newHead;
}

export function growSnake(snake, amount = 1) {
  snake.pendingGrowth += amount;
}

export function snakeOccupancySet(snake) {
  const set = new Set();
  for (const p of snake.body) set.add(keyOf(p.x, p.y));
  return set;
}

export function isSelfCollision(snake) {
  const [head, ...rest] = snake.body;
  for (const p of rest) {
    if (p.x === head.x && p.y === head.y) return true;
  }
  return false;
}
``
