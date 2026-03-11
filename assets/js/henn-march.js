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

// occasional chaos
setInterval(() => {

  // bonk event
  if (Math.random() < 0.35) {
    bonkOneOccasionally();
  }

  // rare JRPG party victory bounce
  if (Math.random() < 0.01) {
  
    const runners = document.querySelectorAll(".henn-sprite-runner");
  
    runners.forEach(henn => {
      henn.classList.add("henn-victory");
  
      setTimeout(() => {
        henn.classList.remove("henn-victory");
      }, 800);
    });
  
  }
  
  // wizard sparkle
  document.querySelectorAll(".wizard-henn").forEach(wizard => {
    if (Math.random() < 0.15) {
      const sparkle = document.createElement("div");
      sparkle.className = "henn-sparkle";

      sparkle.style.left = wizard.offsetLeft + 20 + "px";
      sparkle.style.top = wizard.offsetTop + 20 + "px";

      wizard.parentElement.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 800);
    }
  });

  // cowboy bullet
  document.querySelectorAll(".cowboy-henn").forEach(cowboy => {
    if (Math.random() < 0.13) {
      const bullet = document.createElement("div");
      bullet.className = "henn-bullet";

      bullet.style.left = cowboy.offsetLeft + 40 + "px";
      bullet.style.top = cowboy.offsetTop + 30 + "px";

      cowboy.parentElement.appendChild(bullet);

      setTimeout(() => bullet.remove(), 800);
    }
  });

  // cat chaos
  document.querySelectorAll(".cat-henn").forEach(catLady => {
    if (Math.random() < 0.12) {
      const cat = document.createElement("div");
      cat.className = "henn-cat-run";

      cat.style.left = catLady.offsetLeft + "px";
      cat.style.top = catLady.offsetTop + 40 + "px";

      catLady.parentElement.appendChild(cat);

      setTimeout(() => cat.remove(), 1200);
    }
  });

  // ninja leap
  document.querySelectorAll(".nin-henn").forEach(ninja => {
    if (Math.random() < 0.14) {
  
      ninja.classList.add("henn-leap");
  
      setTimeout(() => {
        ninja.classList.remove("henn-leap");
      }, 900);
  
    }
  });

  // explorer compass confusion
  document.querySelectorAll(".explorer-henn").forEach(explorer => {
    if (Math.random() < 0.04) {
  
      const compass = document.createElement("div");
      compass.className = "henn-compass";
  
      compass.style.left = explorer.offsetLeft + 24 + "px";
      compass.style.top = explorer.offsetTop + 10 + "px";
  
      explorer.parentElement.appendChild(compass);
  
      setTimeout(() => compass.remove(), 1200);
    }
  });

  // chef pancake flip
  document.querySelectorAll(".chef-henn").forEach(chef => {
    if (Math.random() < 0.04) {
  
      const pancake = document.createElement("div");
      pancake.className = "henn-pancake";
  
      pancake.style.left = chef.offsetLeft + 28 + "px";
      pancake.style.top = chef.offsetTop + 18 + "px";
  
      chef.parentElement.appendChild(pancake);
  
      setTimeout(() => pancake.remove(), 1000);
    }
  });

}, 5000);
