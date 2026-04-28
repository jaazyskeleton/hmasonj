const DIRS = {
  ArrowUp:    { x: 0, y: -1 },
  ArrowDown:  { x: 0, y: 1 },
  ArrowLeft:  { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

export function attachInput({ element, onDirection, onTogglePause, onRestart }) {
  const handler = (e) => {
    const key = e.key;

    if (key === " " || key === "Spacebar") {
      e.preventDefault();
      onTogglePause?.();
      return;
    }
    if (key === "Enter") {
      onRestart?.();
      return;
    }

    const dir = DIRS[key];
    if (dir) {
      e.preventDefault();
      onDirection(dir);
    }
  };

  window.addEventListener("keydown", handler, { passive: false });

  // Simple swipe controls for touch/mobile
  let startX = 0, startY = 0, tracking = false;

  const onTouchStart = (e) => {
    if (!e.touches?.length) return;
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (!tracking) return;
    tracking = false;

    const t = e.changedTouches?.[0];
    if (!t) return;

    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    const threshold = 24;

    if (ax < threshold && ay < threshold) return;

    if (ax > ay) onDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    else onDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
  };

  element.addEventListener("touchstart", onTouchStart, { passive: true });
  element.addEventListener("touchend", onTouchEnd, { passive: true });

  return () => {
    window.removeEventListener("keydown", handler);
    element.removeEventListener("touchstart", onTouchStart);
    element.removeEventListener("touchend", onTouchEnd);
  };
}
