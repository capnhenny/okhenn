// assets/js/visitor-counter.js
(function () {
  const IDS = ['visitsCounter', 'visits']; // whichever id you wired in footer

  function findEl() {
    for (const id of IDS) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  }

  function updateSparkline() {
    const el = document.getElementById('visitSparkline');
    if (!el) return;

    // Placeholder “last 14 days” data for now; later we can swap to real history.
    const data = [2, 4, 3, 6, 5, 8, 7, 9, 4, 3, 5, 7, 6, 8];
    const max = Math.max(...data, 1);

    el.innerHTML = '';

    data.forEach((v, idx) => {
      const bar = document.createElement('span');
      bar.className = 'visit-sparkline-bar';

      const h = 6 + (v / max) * 14; // between ~6–20px tall
      bar.style.height = `${h}px`;

      // slight stagger in animation via CSS nth-child; no JS timing needed
      el.appendChild(bar);
    });
  }

  function init(el) {
    fetch('/api/visits?mode=hit')
      .then((r) => r.json())
      .then((data) => {
        const num = Number(data && data.value);
        if (Number.isFinite(num) && num >= 0) {
          el.textContent = num.toLocaleString();
        } else {
          el.textContent = '...';
        }
        updateSparkline();
      })
      .catch(() => {
        el.textContent = '...';
        updateSparkline();
      });
  }

  // Footer is injected by include.js → wait for the element to appear
  function waitForVisits() {
    const now = findEl();
    if (now) return init(now);

    const mo = new MutationObserver(() => {
      const el = findEl();
      if (el) {
        mo.disconnect();
        init(el);
      }
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  waitForVisits();
})();
