// assets/js/visitor-counter.js
(function () {
  // Namespace by hostname so local/staging don’t clash
  const NS   = (location.hostname || 'okhenn').replace(/\./g, '-');
  const KEY  = 'site-visitors-unique';
  const FLAG = `${NS}_visited`;
  const IDS  = ['visitsCounter', 'visits']; // will use whichever exists

  function findEl() {
    for (const id of IDS) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  }

  function ensureCounter() {
    return fetch(`https://api.countapi.xyz/create?namespace=${encodeURIComponent(NS)}&key=${encodeURIComponent(KEY)}&value=0`)
      .catch(() => {}); // ok if already exists
  }

  function getOrHit(seen) {
    const ep = seen ? 'get' : 'hit';
    return fetch(`https://api.countapi.xyz/${ep}/${encodeURIComponent(NS)}/${encodeURIComponent(KEY)}`)
      .then(r => r.json());
  }

  function init(el) {
    ensureCounter().finally(() => {
      const seen = localStorage.getItem(FLAG) === '1';
      getOrHit(seen)
        .then(({ value }) => {
          el.textContent = Number(value).toLocaleString();
          if (!seen) localStorage.setItem(FLAG, '1');
        })
        .catch(() => { el.textContent = '—'; });
    });
  }

  // Footer is injected by include.js → wait for the element to appear
  function waitForVisits() {
    const now = findEl();
    if (now) return init(now);
    const mo = new MutationObserver(() => {
      const el = findEl();
      if (el) { mo.disconnect(); init(el); }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  waitForVisits();
})();
