const SPRITES = [
  { name: "chef-henn", file: "/assets/henn-sprites/chef-henn.png", width: 56, height: 56, duration: 24, delay: 0 },
  { name: "dino-henn", file: "/assets/henn-sprites/dino-henn.png", width: 62, height: 62, duration: 28, delay: 3 },
  { name: "warrior-henn", file: "/assets/henn-sprites/warrior-henn.png", width: 56, height: 56, duration: 23, delay: 6 },
  { name: "wizard-henn", file: "/assets/henn-sprites/wizard-henn.png", width: 56, height: 56, duration: 27, delay: 9 },
  { name: "explorer-henn", file: "/assets/henn-sprites/explorer-henn.png", width: 56, height: 56, duration: 25, delay: 12 },
  { name: "tron-henn", file: "/assets/henn-sprites/tron-henn.png", width: 56, height: 56, duration: 21, delay: 15 },
  { name: "cowboy-henn", file: "/assets/henn-sprites/cowboy-henn.png", width: 56, height: 56, duration: 24, delay: 18 },
  { name: "cat-henn", file: "/assets/henn-sprites/cat-henn.png", width: 64, height: 64, duration: 29, delay: 21 },

  { name: "pirate-henn", file: "/assets/henn-sprites/pirate-henn.png", width: 56, height: 56, duration: 24, delay: 24 },
  { name: "gamer-henn", file: "/assets/henn-sprites/gamer-henn.png", width: 56, height: 56, duration: 23, delay: 27 },
  { name: "magic-carpet-henn", file: "/assets/henn-sprites/magic-carpet-henn.png", width: 60, height: 60, duration: 25, delay: 30 },
  { name: "bard-henn", file: "/assets/henn-sprites/bard-henn.png", width: 56, height: 56, duration: 24, delay: 33 },
  { name: "ghost-henn", file: "/assets/henn-sprites/ghost-henn.png", width: 56, height: 56, duration: 22, delay: 36 },
  { name: "fisherman-henn", file: "/assets/henn-sprites/fisherman-henn.png", width: 56, height: 56, duration: 26, delay: 39 },
  { name: "robot-henn", file: "/assets/henn-sprites/robot-henn.png", width: 56, height: 56, duration: 22, delay: 42 },
  { name: "caveman-henn", file: "/assets/henn-sprites/caveman-henn.png", width: 56, height: 56, duration: 25, delay: 45 }
];

// helper function
function spawnEffect(parent, className, left, top, duration) {
  const effect = document.createElement("div");
  effect.className = className;
  effect.style.left = `${left}px`;
  effect.style.top = `${top}px`;
  parent.appendChild(effect);

  setTimeout(() => effect.remove(), duration);
}

function makeRunner(sprite, index) {
  const el = document.createElement("div");
  el.className = `henn-sprite-runner ${sprite.name}${index % 2 ? " alt-step" : ""}`;
  el.style.backgroundImage = `url("${sprite.file}")`;
  el.style.width = `${sprite.width}px`;
  el.style.height = `${sprite.height}px`;

  const topOffsets = {
    "cat-henn": 2,
    "dino-henn": 0,
    "magic-carpet-henn": 0
  };

  el.style.top = `${topOffsets[sprite.name] ?? 4}px`;

  const spacing = 90;
  el.style.left = `${-90 - index * spacing}px`;

el.style.animationDuration = `${sprite.duration}s, 0.32s`;
el.style.animationDelay = `${sprite.delay}s, 0s`;
  el.dataset.name = sprite.name;
  return el;
}

function seedRunners() {
  const track = document.getElementById("hennMarchTrack");
  if (!track) return;

  track.innerHTML = "";

  SPRITES.forEach((sprite, index) => {
    track.appendChild(makeRunner(sprite, index));
  });
}

function bonkRunner(victim) {
  if (!victim || victim.classList.contains("bonked")) return;

  spawnEffect(
    victim.parentElement,
    "henn-bonk-star",
    victim.offsetLeft + victim.offsetWidth * 0.35,
    victim.offsetTop + victim.offsetHeight * 0.25,
    500
  );

  victim.classList.add("bonked");
  victim.style.transform = "translateX(20px) translateY(-8px) rotate(10deg)";

  setTimeout(() => {
    victim.classList.remove("bonked");
    victim.style.transform = "";
    victim.style.animation = "none";
    void victim.offsetHeight;

    const sprite = SPRITES.find(s => s.name === victim.dataset.name);
    if (!sprite) return;

    const walkAnim = victim.classList.contains("alt-step") ? "henn-walk-b" : "henn-walk-a";
    victim.style.animation = `henn-march ${sprite.duration}s linear infinite, ${walkAnim} 0.32s ease-in-out infinite`;
    victim.style.animationDelay = `0s, 0s`;
  }, 700);
}

function bonkOneOccasionally() {
  const runners = Array.from(document.querySelectorAll(".henn-sprite-runner"));
  if (!runners.length) return;

  const visible = runners.filter(el => {
    if (el.classList.contains("bonked")) return false;
    const rect = el.getBoundingClientRect();
    return rect.right > 0 && rect.left < window.innerWidth;
  });

  if (!visible.length) return;

  const victim = visible[Math.floor(Math.random() * visible.length)];
  bonkRunner(victim);
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
    if (Math.random() < 0.15) {
      spawnEffect(
        wizard.parentElement,
        "henn-sparkle",
        wizard.offsetLeft + 18,
        wizard.offsetTop + 10,
        900
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
        cowboy.offsetTop + 24,
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
        catLady.offsetLeft + 10,
        catLady.offsetTop + 28,
        1200
      );
    }
  });

  // dino stomp
  document.querySelectorAll(".dino-henn").forEach(dino => {
    if (Math.random() < 0.14 && !dino.classList.contains("henn-stomp")) {
      dino.classList.add("henn-stomp");

      setTimeout(() => {
        spawnEffect(
          dino.parentElement,
          "henn-dust",
          dino.offsetLeft + 14,
          dino.offsetTop + 36,
          700
        );
        dino.classList.remove("henn-stomp");
      }, 400);
    }
  });

  // explorer compass
  document.querySelectorAll(".explorer-henn").forEach(explorer => {
    if (Math.random() < 0.14) {
      spawnEffect(
        explorer.parentElement,
        "henn-compass",
        explorer.offsetLeft + 28,
        explorer.offsetTop + 8,
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
        chef.offsetTop + 14,
        1000
      );
    }
  });

  // warrior sword slash
  document.querySelectorAll(".warrior-henn").forEach(warrior => {
    if (Math.random() < 0.14) {
      spawnEffect(
        warrior.parentElement,
        "henn-slash",
        warrior.offsetLeft + 22,
        warrior.offsetTop + 8,
        700
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

  // pirate parrot fly
  document.querySelectorAll(".pirate-henn").forEach(pirate => {
    if (Math.random() < 0.12) {
      spawnEffect(
        pirate.parentElement,
        "henn-parrot",
        pirate.offsetLeft + 26,
        pirate.offsetTop + 6,
        1200
      );
    }
  });

  // gamer coin toss
  document.querySelectorAll(".gamer-henn").forEach(gamer => {
    if (Math.random() < 0.12) {
      spawnEffect(
        gamer.parentElement,
        "henn-coin",
        gamer.offsetLeft + 30,
        gamer.offsetTop - 4,
        900
      );
    }
  });

  // magic carpet sparkle
  document.querySelectorAll(".magic-carpet-henn").forEach(rider => {
    if (Math.random() < 0.12) {
      spawnEffect(
        rider.parentElement,
        "henn-sparkle",
        rider.offsetLeft + 18,
        rider.offsetTop + 12,
        900
      );
    }
  });

  // bard music note
  document.querySelectorAll(".bard-henn").forEach(bard => {
    if (Math.random() < 0.14) {
      spawnEffect(
        bard.parentElement,
        "henn-music-note",
        bard.offsetLeft + 34,
        bard.offsetTop + 4,
        1000
      );
    }
  });

  // ghost float wisp
  document.querySelectorAll(".ghost-henn").forEach(ghost => {
    if (Math.random() < 0.12) {
      spawnEffect(
        ghost.parentElement,
        "henn-sparkle",
        ghost.offsetLeft + 18,
        ghost.offsetTop + 10,
        900
      );
    }
  });

  // fisherman cast
  document.querySelectorAll(".fisherman-henn").forEach(fisher => {
    if (Math.random() < 0.12) {
      spawnEffect(
        fisher.parentElement,
        "henn-bobber",
        fisher.offsetLeft + 32,
        fisher.offsetTop + 8,
        1200
      );
    }
  });

          // robot laser eyes
          document.querySelectorAll(".robot-henn").forEach(robot => {
            if (Math.random() < 0.14) {
              const laser = document.createElement("div");
              laser.className = "henn-laser";
          
              const startX = robot.offsetLeft + 36;
              const startY = robot.offsetTop + 18;
          
              laser.style.left = `${startX}px`;
              laser.style.top = `${startY}px`;
          
              robot.parentElement.appendChild(laser);
          
              let distance = 0;
              const speed = 6;
          
              const interval = setInterval(() => {
                distance += speed;
                laser.style.transform = `translateX(${distance}px)`;
          
                const laserRect = laser.getBoundingClientRect();
                const runners = document.querySelectorAll(".henn-sprite-runner");
          
                for (const target of runners) {
                  if (target === robot) continue;
          
                  const rect = target.getBoundingClientRect();
                  const hit =
                    laserRect.right > rect.left &&
                    laserRect.left < rect.right &&
                    laserRect.bottom > rect.top &&
                    laserRect.top < rect.bottom;
          
                  if (hit) {
                    bonkRunner(target);
                    clearInterval(interval);
                    laser.remove();
                    return;
                  }
                }
          
                if (distance > window.innerWidth) {
                  clearInterval(interval);
                  laser.remove();
                }
              }, 16);
            }
          });

  // caveman club bonk
  document.querySelectorAll(".caveman-henn").forEach(caveman => {
    if (Math.random() < 0.12) {
      spawnEffect(
        caveman.parentElement,
        "henn-slash",
        caveman.offsetLeft + 24,
        caveman.offsetTop + 8,
        650
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  seedRunners();
  chaosRoll();

  setInterval(() => {
    setTimeout(() => {
      chaosRoll();
    }, Math.random() * 800);
  }, 2200);
});
