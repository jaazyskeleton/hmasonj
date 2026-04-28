export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function randInt(min, maxExclusive) {
  return Math.floor(Math.random() * (maxExclusive - min)) + min;
}

export function keyOf(x, y) {
  return `${x},${y}`;
}
