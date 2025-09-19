// assets/js/visitor-counter.js
(function () {
  const NS   = (location.hostname || 'okhenn').replace(/\./g, '-');
  const KEY  = 'site-visitors-unique';
  const FLAG = `${NS}_visited`;
  const ID   = 'visits';

  function ensureCounter() {
    return fetch(`https://api.countapi.xyz/create?namespace=${encodeURIComponent(NS)}&key=${encodeURIComponent(KEY)}&value=0`)
      .catch(() => {});
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
  // Wait for #visits to exist (footer is injected by include.js)
  function waitForVisits() {
    const el = document.getElementById(ID);
    if (el) return init(el);
    const mo = new MutationObserver(() => {
      const el2 = document.getElementById(ID);
      if (el2) { mo.disconnect(); init(el2); }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
  waitForVisits();
})();
