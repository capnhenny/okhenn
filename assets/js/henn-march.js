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
{  name: "bard-henn",
  file: "/assets/henn-sprites/bard-henn.png",
  alt: "/assets/henn-sprites/alt-step-sprites/bard-henn-alt-step.png",  width: 56,  height: 56,  duration: 24,  delay: 33 },
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
el.style.setProperty("--sprite-a", `url("${sprite.file}")`);
el.style.setProperty("--sprite-b", `url("${sprite.alt || sprite.file}")`);
  el.style.width = `${sprite.width}px`;
  el.style.height = `${sprite.height}px`;

  const topOffsets = {
    "cat-henn": 2,
    "dino-henn": 0,
    "magic-carpet-henn": 0
  };

  el.style.top = `${topOffsets[sprite.name] ?? 4}px`;

  const spacing = 78;
  el.style.left = `${-90 - index * spacing}px`;

  el.style.animationDuration = `${sprite.duration}s, 0.32s`;
  el.style.animationDelay = `${sprite.delay}s, 0s`;
  el.dataset.name = sprite.name;

  if (sprite.name === "fisherman-henn") {
    const prop = document.createElement("div");
    prop.className = "henn-held-bobber";
    el.appendChild(prop);
  }

  if (sprite.name === "pirate-henn") {
    const parrot = document.createElement("div");
    parrot.className = "henn-parrot-loop";
    el.appendChild(parrot);
  }

  if (sprite.name === "gamer-henn") {
    const coin = document.createElement("div");
    coin.className = "henn-held-coin";
    el.appendChild(coin);
  }

if (sprite.name === "cat-henn") {
  const cat = document.createElement("div");
  cat.className = "henn-companion-cat";
  el.appendChild(cat);
}
  
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

  const spriteName = victim.dataset.name;

  spawnEffect(
    victim.parentElement,
    "henn-bonk-star",
    victim.offsetLeft + victim.offsetWidth * 0.35,
    victim.offsetTop + victim.offsetHeight * 0.2,
    500
  );

  victim.classList.add("bonked", "henn-defeated");
  victim.style.animation = "none";
  void victim.offsetHeight;

  setTimeout(() => {
    victim.remove();
    setTimeout(() => respawnRunner(spriteName), 700 + Math.random() * 1200);
  }, 900);
}

            function bonkNearby(attacker, range = 70) {
              const attackersRect = attacker.getBoundingClientRect();
              const runners = document.querySelectorAll(".henn-sprite-runner");
            
              for (const target of runners) {
                if (target === attacker || target.classList.contains("bonked")) continue;
            
                const rect = target.getBoundingClientRect();
                const ahead =
                  rect.left > attackersRect.left &&
                  rect.left - attackersRect.right < range &&
                  Math.abs(rect.top - attackersRect.top) < 30;
            
                if (ahead) {
                  bonkRunner(target);
                  return true;
                }
              }
            
              return false;
            }

            function bonkUnderneath(attacker, xRange = 34, yRange = 28) {
              const a = attacker.getBoundingClientRect();
              const runners = document.querySelectorAll(".henn-sprite-runner");
            
              for (const target of runners) {
                if (target === attacker || target.classList.contains("bonked")) continue;
            
                const r = target.getBoundingClientRect();
            
                const closeX = Math.abs((r.left + r.width / 2) - (a.left + a.width / 2)) < xRange;
                const closeY = Math.abs(r.top - a.top) < yRange;
            
                if (closeX && closeY) {
                  bonkRunner(target);
                  return true;
                }
              }
            
              return false;
            }

function respawnRunner(name) {
  const track = document.getElementById("hennMarchTrack");
  if (!track) return;

  const sprite = SPRITES.find(s => s.name === name);
  if (!sprite) return;

  const index = Math.floor(Math.random() * 2);
  const runner = makeRunner(sprite, index);

  runner.style.left = "-100px";
  track.appendChild(runner);
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

function launchProjectile({
  shooter,
  className,
  startX,
  startY,
  speed = 5,
  arc = 0,
  life = 1200,
  targetSelector = ".henn-sprite-runner",
  onHit
}) {
  if (!shooter || !shooter.parentElement) return;

  const proj = document.createElement("div");
  proj.className = className;
  proj.style.left = `${startX}px`;
  proj.style.top = `${startY}px`;
  shooter.parentElement.appendChild(proj);

  const startTime = performance.now();
  let distance = 0;

  const interval = setInterval(() => {
    distance += speed;
    const elapsed = performance.now() - startTime;

    proj.style.transform = `translateX(${distance}px) translateY(${Math.sin(distance / 18) * arc}px)`;

    const projRect = proj.getBoundingClientRect();
    const targets = document.querySelectorAll(targetSelector);

    for (const target of targets) {
      if (target === shooter || target.classList.contains("bonked")) continue;

      const rect = target.getBoundingClientRect();
      const hit =
        projRect.right > rect.left &&
        projRect.left < rect.right &&
        projRect.bottom > rect.top &&
        projRect.top < rect.bottom;

      if (hit) {
        clearInterval(interval);
        proj.remove();
        if (onHit) onHit(target);
        else bonkRunner(target);
        return;
      }
    }

    if (elapsed > life || startX + distance > window.innerWidth + 80) {
      clearInterval(interval);
      proj.remove();
    }
  }, 16);
}

function launchCatAttack(catLady) {
  if (!catLady || !catLady.parentElement) return;

  const held = catLady.querySelector(".henn-companion-cat");
  catLady.dataset.catAttacking = "1";
  if (held) held.style.opacity = "0";

  const cat = document.createElement("div");
  cat.className = "henn-cat-runner";
  cat.style.left = `${catLady.offsetLeft + 8}px`;
  cat.style.top = `${catLady.offsetTop + 30}px`;
  catLady.parentElement.appendChild(cat);

  let distance = 0;
  const speed = 7;

  const interval = setInterval(() => {
    distance += speed;
    cat.style.transform = `translateX(${distance}px) translateY(${Math.sin(distance / 10) * 2}px)`;

    const catRect = cat.getBoundingClientRect();
    const runners = document.querySelectorAll(".henn-sprite-runner");

    for (const target of runners) {
      if (target === catLady || target.classList.contains("bonked")) continue;

      const rect = target.getBoundingClientRect();
      const hit =
        catRect.right > rect.left &&
        catRect.left < rect.right &&
        catRect.bottom > rect.top &&
        catRect.top < rect.bottom;

      if (hit) {
        cat.style.transform += " scaleX(1.1)";
        cat.classList.add("attacking");

        spawnEffect(
          catLady.parentElement,
          "henn-slash",
          target.offsetLeft + 14,
          target.offsetTop + 10,
          500
        );

        bonkRunner(target);

        clearInterval(interval);
        setTimeout(() => {
          cat.remove();
          if (held) held.style.opacity = "";
          catLady.dataset.catAttacking = "0";
        }, 180);
        return;
      }
    }

    if (catLady.offsetLeft + distance > window.innerWidth + 60) {
      clearInterval(interval);
      cat.remove();
      if (held) held.style.opacity = "";
      catLady.dataset.catAttacking = "0";
    }
  }, 16);
}

function animateCompanionCats() {
  document.querySelectorAll(".cat-henn").forEach(catLady => {
    const cat = catLady.querySelector(".henn-companion-cat");
    if (!cat || catLady.classList.contains("bonked")) return;
    if (catLady.dataset.catAttacking === "1") return;

    const burst = Math.random() < 0.28;

    if (burst) {
      cat.classList.add("bursting");
      cat.style.left = `${14 + Math.random() * 16}px`;
      cat.style.top = `${30 + Math.random() * 4}px`;

      setTimeout(() => {
        cat.classList.remove("bursting");
      }, 500);
    } else {
      cat.classList.remove("bursting");
      cat.style.left = `${6 + Math.random() * 10}px`;
      cat.style.top = `${31 + Math.random() * 3}px`;
    }
  });
}

function chaosRoll() {

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
                launchProjectile({
                  shooter: cowboy,
                  className: "henn-bullet",
                  startX: cowboy.offsetLeft + 40,
                  startY: cowboy.offsetTop + 24,
                  speed: 8,
                  arc: 0,
                  life: 700
                });
              }
            });

                      // cat chaos
                      document.querySelectorAll(".cat-henn").forEach(catLady => {
                        if (Math.random() < 0.12) {
                          launchCatAttack(catLady);
                        }
                      });

                    // dino stomp
                    document.querySelectorAll(".dino-henn").forEach(dino => {
                      if (Math.random() < 0.14 && !dino.classList.contains("henn-stomp")) {
                        dino.classList.add("henn-stomp");
                    
                        // landing hit check near the end of the stomp
                        setTimeout(() => {
                          spawnEffect(
                            dino.parentElement,
                            "henn-dust",
                            dino.offsetLeft + 14,
                            dino.offsetTop + 36,
                            700
                          );
                    
                          bonkUnderneath(dino, 34, 28);
                    
                          dino.classList.remove("henn-stomp");
                        }, 520);
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
              bonkNearby(warrior, 60);
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
                      if (Math.random() < 0.10) {
                        const held = pirate.querySelector(".henn-parrot-loop");
                        if (held) held.style.opacity = "0";
                    
                        launchProjectile({
                          shooter: pirate,
                          className: "henn-parrot",
                          startX: pirate.offsetLeft + 30,
                          startY: pirate.offsetTop + 4,
                          speed: 5.4,
                          arc: 10,
                          life: 1000
                        });
                    
                        setTimeout(() => {
                          if (held) held.style.opacity = "";
                        }, 1000);
                      }
                    });

                                  // gamer coin toss
                                document.querySelectorAll(".gamer-henn").forEach(gamer => {
                                  const held = gamer.querySelector(".henn-held-coin");
                                  if (!held) return;
                                
                                  // coin pop
                                  if (Math.random() < 0.08) {
                                    spawnEffect(
                                      gamer.parentElement,
                                      "henn-coin-pop",
                                      gamer.offsetLeft + 30,
                                      gamer.offsetTop - 4,
                                      600
                                    );
                                  }
                                
                                  // thrown coin
                                  if (Math.random() < 0.08) {
                                    held.style.opacity = "0";
                                
                                    launchProjectile({
                                      shooter: gamer,
                                      className: "henn-coin",
                                      startX: gamer.offsetLeft + 30,
                                      startY: gamer.offsetTop + 4,
                                      speed: 6.2,
                                      arc: 8,
                                      life: 900
                                    });
                                
                                    setTimeout(() => {
                                      held.style.opacity = "";
                                    }, 900);
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
                  if (Math.random() < 0.12 && !fisher.classList.contains("casting")) {
                    fisher.classList.add("casting");
                
                    const held = fisher.querySelector(".henn-held-bobber");
                    if (held) held.style.opacity = "0";
                
                    launchProjectile({
                      shooter: fisher,
                      className: "henn-bobber",
                      startX: fisher.offsetLeft + 30,
                      startY: fisher.offsetTop + 18,
                      speed: 4.8,
                      arc: 12,
                      life: 900
                    });
                
                    setTimeout(() => {
                      if (held) held.style.opacity = "";
                      fisher.classList.remove("casting");
                    }, 900);
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
                    bonkNearby(caveman, 55);
                  }
                });
}

document.addEventListener("DOMContentLoaded", () => {
  seedRunners();
  chaosRoll();
  animateCompanionCats();

  setInterval(() => {
    animateCompanionCats();
  }, 700);

  setInterval(() => {
    setTimeout(() => {
      chaosRoll();
    }, Math.random() * 800);
  }, 2200);
});
