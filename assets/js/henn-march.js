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
  el.className = `henn-sprite-runner ${sprite.name}${index % 2 ? " alt-step" : ""}`;
  el.style.backgroundImage = `url("${sprite.file}")`;
  el.style.width = `${sprite.width}px`;
  el.style.height = `${sprite.name === "cat-henn" ? 64 : 56}px`;
  el.style.top = `${sprite.name === "cat-henn" ? 6 : 10}px`;
  el.style.animationDuration = `${sprite.duration}s, 0.32s`;
  el.style.animationDelay = `${sprite.delay}s, 0s`;
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
    victim.style.animation = "none";
    void victim.offsetHeight;
    
    const walkAnim = victim.classList.contains("alt-step") ? "henn-walk-b" : "henn-walk-a";
    victim.style.animation = `henn-march ${sprite.duration}s linear infinite, ${walkAnim} 0.32s steps(2) infinite`;
    victim.style.animationDelay = `0s, 0s`;
  }, 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  seedRunners();

// helper function
function spawnEffect(parent, className, left, top, duration) {
  const effect = document.createElement("div");
  effect.className = className;
  effect.style.left = left + "px";
  effect.style.top = top + "px";
  parent.appendChild(effect);

  setTimeout(() => effect.remove(), duration);
}

function chaosRoll() {

  // bonk event
  if (Math.random() < 0.35) {
    bonkOneOccasionally();
  }

            // rare JRPG party victory bounce
            if (Math.random() < 0.01) {
              document.querySelectorAll(".henn-sprite-runner").forEach(henn => {
                if (!henn.classList.contains("henn-victory")) {
                  henn.classList.add("henn-victory");
                  setTimeout(() => {
                    henn.classList.remove("henn-victory");
                  }, 800);
                }
              });
            }
          
            // wizard sparkle
            document.querySelectorAll(".wizard-henn").forEach(wizard => {
              if (Math.random() < 0.05) {
                spawnEffect(
                  wizard.parentElement,
                  "henn-sparkle",
                  wizard.offsetLeft + 20,
                  wizard.offsetTop + 20,
                  800
                );
              }
            });
          
            // cowboy bullet
            document.querySelectorAll(".cowboy-henn").forEach(cowboy => {
              if (Math.random() < 0.13) {
                spawnEffect(
                  cowboy.parentElement,
                  "henn-bullet",
                  cowboy.offsetLeft + 40,
                  cowboy.offsetTop + 30,
                  800
                );
              }
            });
          
            // cat chaos
            document.querySelectorAll(".cat-henn").forEach(catLady => {
              if (Math.random() < 0.03) {
                spawnEffect(
                  catLady.parentElement,
                  "henn-cat-run",
                  catLady.offsetLeft,
                  catLady.offsetTop + 40,
                  1200
                );
              }
            });
          
            // ninja leap
            document.querySelectorAll(".ninja-henn").forEach(ninja => {
              if (Math.random() < 0.07 && !ninja.classList.contains("henn-leap")) {
                ninja.classList.add("henn-leap");
                setTimeout(() => {
                  ninja.classList.remove("henn-leap");
                }, 900);
              }
            });
          
            // explorer compass confusion
            document.querySelectorAll(".explorer-henn").forEach(explorer => {
              if (Math.random() < 0.04) {
                spawnEffect(
                  explorer.parentElement,
                  "henn-compass",
                  explorer.offsetLeft + 24,
                  explorer.offsetTop + 10,
                  1200
                );
              }
            });
          
            // chef pancake flip
            document.querySelectorAll(".chef-henn").forEach(chef => {
              if (Math.random() < 0.04) {
                spawnEffect(
                  chef.parentElement,
                  "henn-pancake",
                  chef.offsetLeft + 28,
                  chef.offsetTop + 18,
                  1000
                );
              }
            });
          }

// occasional chaos
chaosRoll();

setInterval(() => {
  setTimeout(() => {
    chaosRoll();
  }, Math.random() * 800);
}, 3000);

                          });
