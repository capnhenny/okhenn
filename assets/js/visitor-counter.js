// assets/js/visitor-counter.js
(function () {
  const IDS = ['visitsCounter', 'visits']; // whichever you wired in the footer
  const STORAGE_KEY = 'ohhenn_local_visits_v1';

  function findEl() {
    for (const id of IDS) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  }

  function init(el) {
    let count = 0;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored != null) {
        const n = Number(stored);
        if (Number.isFinite(n) && n >= 0) count = n;
      }
      count += 1; // this visit
      localStorage.setItem(STORAGE_KEY, String(count));
    } catch (_e) {
      // if localStorage explodes for some reason, just show 1
      count = 1;
    }

    el.textContent = count.toLocaleString();
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
