const SPRITES = [
  { name: "chef-henn", file: "/assets/henn-sprites/chef-henn.png", width: 56, duration: 24, delay: 0 },
  { name: "dino-henn", file: "/assets/henn-sprites/dino-henn.png", width: 62, duration: 28, delay: 3 },
  { name: "warrior-henn", file: "/assets/henn-sprites/warrior-henn.png", width: 56, duration: 23, delay: 6 },
  { name: "wizard-henn", file: "/assets/henn-sprites/wizard-henn.png", width: 56, duration: 27, delay: 9 },
  { name: "explorer-henn", file: "/assets/henn-sprites/explorer-henn.png", width: 56, duration: 25, delay: 12 },
  { name: "tron-henn", file: "/assets/henn-sprites/tron-henn.png", width: 56, duration: 21, delay: 15 },
  { name: "cowboy-henn", file: "/assets/henn-sprites/cowboy-henn.png", width: 56, duration: 24, delay: 18 },
  { name: "cat-henn", file: "/assets/henn-sprites/cat-henn.png", width: 64, duration: 29, delay: 21 }
];

function makeRunner(sprite, index) {
  const el = document.createElement("div");
  el.className = `henn-sprite-runner ${sprite.name}`;
  el.style.backgroundImage = `url("${sprite.file}")`;
  el.style.width = `${sprite.width}px`;
  el.style.height = `${sprite.name === "cat-henn" ? 64 : 56}px`;
  el.style.top = `${sprite.name === "cat-henn" ? 2 : 6}px`;
  el.style.animationDuration = `0.38s, ${sprite.duration}s`;
  el.style.animationDelay = `0s, ${sprite.delay}s`;
  el.dataset.name = sprite.name;
  return el;
}

function seedRunners() {
  const track = document.getElementById("hennMarchTrack");
  if (!track) return;

  SPRITES.forEach((sprite, index) => {
    track.appendChild(makeRunner(sprite, index));
  });
}

function bonkOneOccasionally() {
  const runners = Array.from(document.querySelectorAll(".henn-sprite-runner"));
  if (!runners.length) return;

  const live = runners.filter(el => !el.classList.contains("bonked"));
  if (live.length < 2) return;

  const victim = live[Math.floor(Math.random() * live.length)];
  victim.classList.add("bonked");
  victim.style.transform = "translateX(40px) translateY(-18px) rotate(18deg)";

  setTimeout(() => {
    victim.classList.remove("bonked");
    victim.style.transform = "";
    // restart march animation by reflow
    victim.style.animation = "none";
    // force reflow
    void victim.offsetHeight;
    const sprite = SPRITES.find(s => s.name === victim.dataset.name);
    victim.style.animation = `henn-bob 0.38s steps(2) infinite, henn-march ${sprite.duration}s linear infinite`;
    victim.style.animationDelay = `0s, 0s`;
  }, 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  seedRunners();

  // occasional chaos
  setInterval(() => {
    if (Math.random() < 0.35) {
      bonkOneOccasionally();
    }
  }, 5000);
});
