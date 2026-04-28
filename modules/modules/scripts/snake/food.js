import { randInt, keyOf } from "./utils.js";

export function spawnFood(cols, rows, occupiedSet) {
  // Try random spots first, then fallback to scan
  for (let i = 0; i < 200; i++) {
    const x = randInt(0, cols);
    const y = randInt(0, rows);
    if (!occupiedSet.has(keyOf(x, y))) return { x, y };
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!occupiedSet.has(keyOf(x, y))) return { x, y };
    }
  }

  // No free space: snake filled the board (win condition)
  return null;
}
