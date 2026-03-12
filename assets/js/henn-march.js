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

            // helper function
            function spawnEffect(parent, className, left, top, duration) {
              const effect = document.createElement("div");
              effect.className = className;
              effect.style.left = left + "px";
              effect.style.top = top + "px";
              parent.appendChild(effect);
            
              setTimeout(() => effect.remove(), duration);
            }

function makeRunner(sprite, index) {
  const el = document.createElement("div");
  el.className = `henn-sprite-runner ${sprite.name}${index % 2 ? " alt-step" : ""}`;
  el.style.backgroundImage = `url("${sprite.file}")`;
  el.style.width = `${sprite.width}px`;
  el.style.height = `${sprite.name === "cat-henn" ? 64 : 56}px`;
  el.style.top = `${sprite.name === "cat-henn" ? 6 : 10}px`;
  
  const spacing = 90;
  el.style.left = `${-90 - index * spacing}px`;
  
  el.style.animationDuration = `${sprite.duration}s, 0.32s`;
  el.style.animationDelay = `${index * 1.6}s, 0s`;
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

  const visible = runners.filter(el => {
    if (el.classList.contains("bonked")) return false;

    const rect = el.getBoundingClientRect();
    return rect.right > 0 && rect.left < window.innerWidth;
  });

  if (visible.length < 1) return;

  const victim = visible[Math.floor(Math.random() * visible.length)];
  const rect = victim.getBoundingClientRect();
  
  spawnEffect(
    victim.parentElement,
    "henn-bonk-star",
    victim.offsetLeft + rect.width * 0.45,
    victim.offsetTop + rect.height * 0.35,
    500
  );
  
  victim.classList.add("bonked");
  victim.style.transform = "translateX(26px) translateY(-10px) rotate(14deg)";

  setTimeout(() => {
    victim.classList.remove("bonked");
    victim.style.transform = "";
    victim.style.animation = "none";
    void victim.offsetHeight;

    const sprite = SPRITES.find(s => s.name === victim.dataset.name);
    const walkAnim = victim.classList.contains("alt-step") ? "henn-walk-b" : "henn-walk-a";
    victim.style.animation = `henn-march ${sprite.duration}s linear infinite, ${walkAnim} 0.32s ease-in-out infinite`;
    victim.style.animationDelay = `0s, 0s`;
  }, 900);
}

document.addEventListener("DOMContentLoaded", () => {
  seedRunners();

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
                  if (Math.random() < 0.15) {
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
                  if (Math.random() < 0.16) {
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
                  if (Math.random() < 0.12) {
                    spawnEffect(
                      catLady.parentElement,
                      "henn-cat-run",
                      catLady.offsetLeft,
                      catLady.offsetTop + 40,
                      1200
                    );
                  }
                });
              
                // dino stomp
                document.querySelectorAll(".dino-henn").forEach(dino => {
                  if (Math.random() < 0.14 && !dino.classList.contains("henn-leap")) {
                    dino.classList.add("henn-leap");
                    setTimeout(() => {
                      dino.classList.remove("henn-leap");
                    }, 900);
                  }
                });
              
                // explorer compass confusion
                document.querySelectorAll(".explorer-henn").forEach(explorer => {
                  if (Math.random() < 0.14) {
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
                  if (Math.random() < 0.14) {
                    spawnEffect(
                      chef.parentElement,
                      "henn-pancake",
                      chef.offsetLeft + 28,
                      chef.offsetTop + 18,
                      1000
                    );
                  }
                });
              
                // warrior sword slash
                document.querySelectorAll(".warrior-henn").forEach(warrior => {
                  if (Math.random() < 0.14) {
                    console.log("WARRIOR FOUND", warrior);
              
                    spawnEffect(
                      warrior.parentElement,
                      "henn-slash",
                      warrior.offsetLeft + 10,
                      warrior.offsetTop + 5,
                      2000
                    );
                  }
                });
              
                // tron neon pulse
                document.querySelectorAll(".tron-henn").forEach(tron => {
                  if (Math.random() < 0.15) {
                    spawnEffect(
                      tron.parentElement,
                      "henn-tron-pulse",
                      tron.offsetLeft + 20,
                      tron.offsetTop + 14,
                      600
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
}, 2200);

                          });
