import { CONFIG } from "./config.js";
import { createRenderer } from "./renderer.js";
import { attachInput } from "./input.js";
import { SnakeGame } from "./game.js";

function mountSnakeIntoHereSpot() {
  // Your page has: <div class="content"> here </div>
  const content = document.querySelector(".content");
  if (!content) return;

  // Replace whatever is inside with the game UI
  content.innerHTML = "";
  content.style.display = "block";

  const root = document.createElement("div");
  root.id = "snake-root";
  content.appendChild(root);

  const renderer = createRenderer(root, CONFIG);
  const game = new SnakeGame({
    config: CONFIG,
    renderer,
    inputAttach: attachInput,
  });

  game.start();

  // Optional: pause when tab is hidden, resume when visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && game.status === "running") game.togglePause();
  });
}

// Mount when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountSnakeIntoHereSpot);
} else {
  mountSnakeIntoHereSpot();
}
