const ALT_STEP_DIR = "/assets/henn-sprites/alt-step-sprites";

function altStepPath(name) {
  return `${ALT_STEP_DIR}/${name}-alt-step.png`;
}

const SPRITES = [
  { name: "chef-henn", file: "/assets/henn-sprites/chef-henn.png", alt: altStepPath("chef-henn"), width: 56, height: 56, duration: 24, delay: 0 },
  { name: "dino-henn", file: "/assets/henn-sprites/dino-henn.png", alt: altStepPath("dino-henn"), width: 62, height: 62, duration: 28, delay: 3 },
  { name: "warrior-henn", file: "/assets/henn-sprites/warrior-henn.png", alt: altStepPath("warrior-henn"), width: 56, height: 56, duration: 23, delay: 6 },
  { name: "wizard-henn", file: "/assets/henn-sprites/wizard-henn.png", alt: altStepPath("wizard-henn"), width: 56, height: 56, duration: 27, delay: 9 },
  { name: "explorer-henn", file: "/assets/henn-sprites/explorer-henn.png", alt: altStepPath("explorer-henn"), width: 56, height: 56, duration: 25, delay: 12 },
  { name: "tron-henn", file: "/assets/henn-sprites/tron-henn.png", alt: altStepPath("tron-henn"), width: 56, height: 56, duration: 21, delay: 15 },
  { name: "cowboy-henn", file: "/assets/henn-sprites/cowboy-henn.png", alt: altStepPath("cowboy-henn"), width: 56, height: 56, duration: 24, delay: 18 },
  { name: "cat-henn", file: "/assets/henn-sprites/cat-henn.png", alt: altStepPath("cat-henn"), width: 64, height: 64, duration: 29, delay: 21 },
  { name: "pirate-henn", file: "/assets/henn-sprites/pirate-henn.png", alt: altStepPath("pirate-henn"), width: 56, height: 56, duration: 24, delay: 24 },
  { name: "gamer-henn", file: "/assets/henn-sprites/gamer-henn.png", alt: altStepPath("gamer-henn"), width: 56, height: 56, duration: 23, delay: 27 },
  { name: "magic-carpet-henn", file: "/assets/henn-sprites/magic-carpet-henn.png", alt: altStepPath("magic-carpet-henn"), width: 60, height: 60, duration: 25, delay: 30 },
  { name: "bard-henn", file: "/assets/henn-sprites/bard-henn.png", alt: altStepPath("bard-henn"), width: 56, height: 56, duration: 24, delay: 33 },
  { name: "ghost-henn", file: "/assets/henn-sprites/ghost-henn.png", alt: altStepPath("ghost-henn"), width: 56, height: 56, duration: 22, delay: 36 },
  { name: "fisherman-henn", file: "/assets/henn-sprites/fisherman-henn.png", alt: altStepPath("fisherman-henn"), width: 56, height: 56, duration: 26, delay: 39 },
  { name: "robot-henn", file: "/assets/henn-sprites/robot-henn.png", alt: altStepPath("robot-henn"), width: 56, height: 56, duration: 22, delay: 42 },
  { name: "caveman-henn", file: "/assets/henn-sprites/caveman-henn.png", alt: altStepPath("caveman-henn"), width: 56, height: 56, duration: 25, delay: 45 }
];

const DEFAULT_COOLDOWN = 900;

function spawnEffect(parent, className, left, top, duration) {
  if (!parent) return;

  const effect = document.createElement("div");
  effect.className = className;
  effect.style.left = `${left}px`;
  effect.style.top = `${top}px`;
  parent.appendChild(effect);

  setTimeout(() => effect.remove(), duration);
}

function pulseAttacker(attacker, className = "henn-attacking", duration = 180) {
  if (!attacker) return;
  attacker.classList.add(className);
  setTimeout(() => attacker.classList.remove(className), duration);
}

function makeRunner(sprite, index) {
  const el = document.createElement("div");
  el.className = `henn-sprite-runner henn-clickable ${sprite.name}${index % 2 ? " alt-step" : ""}`;

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
  el.dataset.catAttacking = "0";
  el.dataset.lastTrigger = "0";

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
  const parent = victim.parentElement;

  spawnEffect(
    parent,
    "henn-bonk-star",
    victim.offsetLeft + victim.offsetWidth * 0.35,
    victim.offsetTop + victim.offsetHeight * 0.2,
    650
  );

  spawnEffect(
    parent,
    "henn-hit-flash",
    victim.offsetLeft + victim.offsetWidth * 0.18,
    victim.offsetTop + victim.offsetHeight * 0.1,
    220
  );

  victim.classList.add("bonked", "henn-defeated", "henn-hit-stop");
  victim.style.animation = "none";
  victim.style.filter = "brightness(1.35)";
  void victim.offsetHeight;

  setTimeout(() => {
    victim.classList.remove("henn-hit-stop");
    victim.style.filter = "";
  }, 120);

  setTimeout(() => {
    victim.remove();
    setTimeout(() => respawnRunner(spriteName), 700 + Math.random() * 1200);
  }, 980);
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

function launchRollingBoulder(explorer) {
  if (!explorer || !explorer.parentElement) return;

  const rock = document.createElement("div");
  rock.className = "henn-tumble-rock";

  const startX = explorer.offsetLeft + 18;
  const startY = explorer.offsetTop + 18;

  rock.style.left = `${startX}px`;
  rock.style.top = `${startY}px`;
  explorer.parentElement.appendChild(rock);

  let distance = 0;
  const speed = 3.2;          // slower
  const maxDistance = 220;    // shorter travel
  const bounceHeight = 1.2;   // subtler bounce
  const hitTargets = new Set();

  const interval = setInterval(() => {
    distance += speed;

    rock.style.transform = `translateX(${distance}px) translateY(${Math.sin(distance / 12) * bounceHeight}px)`;

    const rockRect = rock.getBoundingClientRect();
    const runners = document.querySelectorAll(".henn-sprite-runner");

    for (const target of runners) {
      if (target === explorer || target.classList.contains("bonked")) continue;
      if (hitTargets.has(target)) continue;

      const rect = target.getBoundingClientRect();
      const hit =
        rockRect.right > rect.left &&
        rockRect.left < rect.right &&
        rockRect.bottom > rect.top &&
        rockRect.top < rect.bottom;

      if (hit) {
        hitTargets.add(target);

        spawnEffect(
          explorer.parentElement,
          "henn-dust",
          target.offsetLeft + 10,
          target.offsetTop + 24,
          500
        );

        bonkRunner(target);

        rock.classList.add("impact");
        setTimeout(() => rock.classList.remove("impact"), 120);
      }
    }

    if (Math.random() < 0.16) {
      spawnEffect(
        explorer.parentElement,
        "henn-dust",
        startX + distance - 4,
        startY + 28,
        280
      );
    }

    if (distance > maxDistance) {
      clearInterval(interval);
      rock.remove();
    }
  }, 16);
}

function launchCatAttack(catLady) {
  if (!catLady || !catLady.parentElement) return;

  pulseAttacker(catLady);

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
      cat.style.left = `${8 + Math.random() * 12}px`;
      cat.style.top = `${36 + Math.random() * 4}px`;

      setTimeout(() => {
        cat.classList.remove("bursting");
      }, 500);
    } else {
      cat.classList.remove("bursting");
      cat.style.left = `${6 + Math.random() * 10}px`;
      cat.style.top = `${37 + Math.random() * 3}px`;
    }
  });
}

function canTrigger(el, cooldown = DEFAULT_COOLDOWN) {
  if (!el) return false;
  const now = Date.now();
  const last = Number(el.dataset.lastTrigger || 0);
  if (now - last < cooldown) return false;
  el.dataset.lastTrigger = String(now);
  return true;
}

/* =========================
   MOVE FUNCTIONS
========================= */

function doWizardMove(wizard) {
  pulseAttacker(wizard);

  launchProjectile({
    shooter: wizard,
    className: "henn-spell",
    startX: wizard.offsetLeft + 36,
    startY: wizard.offsetTop + 10,
    speed: 5.8,
    arc: -4,
    life: 950,
    onHit: (target) => {
      spawnEffect(
        wizard.parentElement,
        "henn-sparkle-burst",
        target.offsetLeft + 16,
        target.offsetTop + 8,
        500
      );
      bonkRunner(target);
    }
  });
}

function doCowboyMove(cowboy) {
  pulseAttacker(cowboy);
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

function doCatMove(catLady) {
  launchCatAttack(catLady);
}

function doDinoMove(dino) {
  if (dino.classList.contains("henn-stomp")) return;

  pulseAttacker(dino);
  dino.classList.add("henn-stomp");

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

function doExplorerMove(explorer) {
  pulseAttacker(explorer);
  launchRollingBoulder(explorer);
}

function doChefMove(chef) {
  pulseAttacker(chef);
  spawnEffect(
    chef.parentElement,
    "henn-pancake",
    chef.offsetLeft + 28,
    chef.offsetTop + 14,
    1000
  );
}

function doWarriorMove(warrior) {
  pulseAttacker(warrior);
  spawnEffect(
    warrior.parentElement,
    "henn-slash",
    warrior.offsetLeft + 22,
    warrior.offsetTop + 8,
    700
  );
  bonkNearby(warrior, 60);
}

function doTronMove(tron) {
  pulseAttacker(tron);
  spawnEffect(
    tron.parentElement,
    "henn-tron-pulse",
    tron.offsetLeft + 20,
    tron.offsetTop + 14,
    600
  );
}

function doPirateMove(pirate) {
  pulseAttacker(pirate);

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

function doGamerMove(gamer) {
  pulseAttacker(gamer);

  const held = gamer.querySelector(".henn-held-coin");
  if (!held) return;

  spawnEffect(
    gamer.parentElement,
    "henn-coin-pop",
    gamer.offsetLeft + 30,
    gamer.offsetTop - 4,
    600
  );

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

function doMagicCarpetMove(rider) {
  pulseAttacker(rider);
  spawnEffect(
    rider.parentElement,
    "henn-sparkle",
    rider.offsetLeft + 18,
    rider.offsetTop + 12,
    900
  );
}

function doBardMove(bard) {
  pulseAttacker(bard);
  spawnEffect(
    bard.parentElement,
    "henn-music-note",
    bard.offsetLeft + 34,
    bard.offsetTop + 4,
    1000
  );
}

function doGhostMove(ghost) {
  pulseAttacker(ghost);
  spawnEffect(
    ghost.parentElement,
    "henn-sparkle",
    ghost.offsetLeft + 18,
    ghost.offsetTop + 10,
    900
  );
}

function doFishermanMove(fisher) {
  if (fisher.classList.contains("casting")) return;

  pulseAttacker(fisher);
  fisher.classList.add("casting");

  const held = fisher.querySelector(".henn-held-bobber");
  if (held) held.style.opacity = "0";

  launchProjectile({
    shooter: fisher,
    className: "henn-bobber",
    startX: fisher.offsetLeft + 26,
    startY: fisher.offsetTop + 14,
    speed: 4.8,
    arc: 12,
    life: 900
  });

  setTimeout(() => {
    if (held) held.style.opacity = "";
    fisher.classList.remove("casting");
  }, 900);
}

function doRobotMove(robot) {
  pulseAttacker(robot);

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

function doCavemanMove(caveman) {
  pulseAttacker(caveman);
  spawnEffect(
    caveman.parentElement,
    "henn-slash",
    caveman.offsetLeft + 24,
    caveman.offsetTop + 8,
    650
  );
  bonkNearby(caveman, 55);
}

/* =========================
   CLICK DISPATCH
========================= */

function triggerSpriteMove(el) {
  if (!el || el.classList.contains("bonked")) return;
  if (!canTrigger(el)) return;

  if (el.classList.contains("chef-henn")) return doChefMove(el);
  if (el.classList.contains("dino-henn")) return doDinoMove(el);
  if (el.classList.contains("warrior-henn")) return doWarriorMove(el);
  if (el.classList.contains("wizard-henn")) return doWizardMove(el);
  if (el.classList.contains("explorer-henn")) return doExplorerMove(el);
  if (el.classList.contains("tron-henn")) return doTronMove(el);
  if (el.classList.contains("cowboy-henn")) return doCowboyMove(el);
  if (el.classList.contains("cat-henn")) return doCatMove(el);
  if (el.classList.contains("pirate-henn")) return doPirateMove(el);
  if (el.classList.contains("gamer-henn")) return doGamerMove(el);
  if (el.classList.contains("magic-carpet-henn")) return doMagicCarpetMove(el);
  if (el.classList.contains("bard-henn")) return doBardMove(el);
  if (el.classList.contains("ghost-henn")) return doGhostMove(el);
  if (el.classList.contains("fisherman-henn")) return doFishermanMove(el);
  if (el.classList.contains("robot-henn")) return doRobotMove(el);
  if (el.classList.contains("caveman-henn")) return doCavemanMove(el);
}

/* =========================
   RANDOM CHAOS
========================= */

function chaosRoll() {
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

  document.querySelectorAll(".wizard-henn").forEach(wizard => {
    if (Math.random() < 0.15) doWizardMove(wizard);
  });

  document.querySelectorAll(".cowboy-henn").forEach(cowboy => {
    if (Math.random() < 0.16) doCowboyMove(cowboy);
  });

  document.querySelectorAll(".cat-henn").forEach(catLady => {
    if (Math.random() < 0.12) doCatMove(catLady);
  });

  document.querySelectorAll(".dino-henn").forEach(dino => {
    if (Math.random() < 0.14) doDinoMove(dino);
  });

  document.querySelectorAll(".explorer-henn").forEach(explorer => {
    if (Math.random() < 0.14) doExplorerMove(explorer);
  });

  document.querySelectorAll(".chef-henn").forEach(chef => {
    if (Math.random() < 0.14) doChefMove(chef);
  });

  document.querySelectorAll(".warrior-henn").forEach(warrior => {
    if (Math.random() < 0.14) doWarriorMove(warrior);
  });

  document.querySelectorAll(".tron-henn").forEach(tron => {
    if (Math.random() < 0.15) doTronMove(tron);
  });

  document.querySelectorAll(".pirate-henn").forEach(pirate => {
    if (Math.random() < 0.10) doPirateMove(pirate);
  });

  document.querySelectorAll(".gamer-henn").forEach(gamer => {
    if (Math.random() < 0.08) doGamerMove(gamer);
  });

  document.querySelectorAll(".magic-carpet-henn").forEach(rider => {
    if (Math.random() < 0.12) doMagicCarpetMove(rider);
  });

  document.querySelectorAll(".bard-henn").forEach(bard => {
    if (Math.random() < 0.14) doBardMove(bard);
  });

  document.querySelectorAll(".ghost-henn").forEach(ghost => {
    if (Math.random() < 0.12) doGhostMove(ghost);
  });

  document.querySelectorAll(".fisherman-henn").forEach(fisher => {
    if (Math.random() < 0.12) doFishermanMove(fisher);
  });

  document.querySelectorAll(".robot-henn").forEach(robot => {
    if (Math.random() < 0.14) doRobotMove(robot);
  });

  document.querySelectorAll(".caveman-henn").forEach(caveman => {
    if (Math.random() < 0.12) doCavemanMove(caveman);
  });
}

document.addEventListener("click", e => {
  const runner = e.target.closest(".henn-sprite-runner");
  if (!runner) return;
  triggerSpriteMove(runner);
});

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
