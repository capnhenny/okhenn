// assets/js/visitor-counter.js
(function () {
  const IDS = ['visitsCounter', 'visits']; // will use whichever exists

  function findEl() {
    for (const id of IDS) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  }

  function init(el) {
    // always ask for "hit"; the Edge function itself decides if it's unique
    fetch('/api/visits?mode=hit')
      .then(r => r.json())
      .then(data => {
        const v = Number(data && data.value);
        el.textContent = Number.isFinite(v) ? v.toLocaleString() : '—';
      })
      .catch(() => {
        el.textContent = '—';
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
