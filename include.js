document.addEventListener('DOMContentLoaded', () => {
  const slots = document.querySelectorAll('[data-include]');
  let includesDone = 0;

  slots.forEach(async (el) => {
    const url = el.getAttribute('data-include'); // relative path, no leading slash
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const html = await res.text();
      el.outerHTML = html;
    } catch (err) {
      console.error('Include failed:', url, err);
      el.outerHTML = `<!-- include failed: ${url} -->`;
    } finally {
      includesDone++;
      if (includesDone === slots.length) {
        afterIncludes(); // run once all partials are loaded
      }
    }
  });

  function afterIncludes() {
    // ---- Highlight current page in nav ----
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('nav a').forEach((a) => {
      if ((a.getAttribute('href') || '').toLowerCase() === here) {
        a.setAttribute('aria-current', 'page');
      }
    });

    // ---- Set year in copyright ----
    const y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();

    // ---- Visitor Counter (domain-wide, 1 per browser) ----
    const ns = 'okhenn-site'; // namespace
    const key = (location.hostname || 'localhost') + '_visits';
    const already = localStorage.getItem('okhenn_counted');

    const setUI = (n) => {
      const el = document.getElementById('visits');
      if (el) el.textContent = n?.toLocaleString?.() ?? n;
    };

    (async () => {
      try {
        if (!already) {
          // increment once
          const hit = await fetch(
            `https://api.countapi.xyz/hit/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`
          ).then(r => r.json());
          setUI(hit.value);
          localStorage.setItem('okhenn_counted', '1');
        } else {
          // just read the count
          const get = await fetch(
            `https://api.countapi.xyz/get/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`
          ).then(r => r.json());
          setUI(get.value);
        }
      } catch (e) {
        console.error('Visitor counter error:', e);
        setUI('—');
      }
    })();
  }
});
