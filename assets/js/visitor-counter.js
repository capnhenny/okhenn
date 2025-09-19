<script>
// /assets/js/visitor-counter.js
(function () {
  const NS   = 'okhenn';                 // your namespace
  const KEY  = 'site-visitors-unique';   // global counter key
  const FLAG = 'okhenn_visited';         // per-browser "already counted" flag

  function init(el){
    // ensure counter exists, then either read (get) or increment (hit) once per browser
    fetch(`https://api.countapi.xyz/create?namespace=${encodeURIComponent(NS)}&key=${encodeURIComponent(KEY)}&value=0`)
      .catch(()=>{})  // ok if it already exists
      .finally(() => {
        const seen = localStorage.getItem(FLAG) === '1';
        const endpoint = seen ? 'get' : 'hit';
        fetch(`https://api.countapi.xyz/${endpoint}/${encodeURIComponent(NS)}/${encodeURIComponent(KEY)}`)
          .then(r => r.json())
          .then(({ value }) => {
            el.textContent = Number(value).toLocaleString();
            if (!seen) localStorage.setItem(FLAG, '1');
          })
          .catch(() => { el.textContent = '—'; });
      });
  }

  // Wait until the footer is injected by include.js, then run.
  function waitForVisitsEl(){
    const el = document.getElementById('visits');
    if (el) return init(el);
    const mo = new MutationObserver(() => {
      const el2 = document.getElementById('visits');
      if (el2) { mo.disconnect(); init(el2); }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  waitForVisitsEl();
})();
</script>
