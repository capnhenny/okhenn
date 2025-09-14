// include.js — partial includes + active nav + year + visitor counter (CountAPI)
document.addEventListener('DOMContentLoaded', () => {
  const slots = document.querySelectorAll('[data-include]');
  let done = 0;

  // If no includes on this page, still run post-init
  if (slots.length === 0) afterIncludes();

  slots.forEach(async (el) => {
    const url = el.getAttribute('data-include'); // e.g. "partials/header.html"
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      el.outerHTML = await res.text();
    } catch (err) {
      console.error('Include failed:', url, err);
      el.outerHTML = `<!-- include failed: ${url} -->`;
    } finally {
      done++;
      if (done === slots.length) afterIncludes();
    }
  });

  async function afterIncludes() {
    // 1) Mark current nav item
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('nav a').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === here) a.setAttribute('aria-current', 'page');
    });

    // 2) Footer year
    const y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();

    // 3) Visitor counter (domain-wide; one count per browser)
    const span = document.getElementById('visits');
    if (!span) return; // No counter on this page

    const NAMESPACE = 'okhenn-site'; // any stable string for your site
    const hostKey = (location.hostname || 'localhost').replace(/^www\./, '') + '_visits';
    const ALREADY_FLAG = 'okhenn_counted_v1'; // bump suffix to reset per-browser counting

    const setUI = (n) => {
      span.textContent = (n?.toLocaleString?.() ?? n ?? '—');
    };

    // Gets current value or creates the key at 0 if missing
    const getOrCreate = async () => {
      const getURL = `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(hostKey)}`;
      const r = await fetch(getURL);
      if (r.ok) {
        const j = await r.json();
        return j.value;
      }
      // likely 404 → create
      const createURL = `https://api.countapi.xyz/create?namespace=${encodeURIComponent(NAMESPACE)}&key=${encodeURIComponent(hostKey)}&value=0`;
      const c = await fetch(createURL);
      if (!c.ok) throw new Error('CountAPI create failed');
      const j2 = await c.json();
      return j2.value;
    };

    try {
      // Show something ASAP
      const current = await getOrCreate();
      setUI(current);

      if (!localStorage.getItem(ALREADY_FLAG)) {
        // First time in this browser → increment once, then store flag
        const hitURL = `https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(hostKey)}`;
        const h = await fetch(hitURL).then((r) => r.json());
        setUI(h.value);
        localStorage.setItem(ALREADY_FLAG, '1');
      } else {
        // Just refresh display
        const getURL = `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(hostKey)}`;
        const g = await fetch(getURL).then((r) => r.json());
        setUI(g.value);
      }
    } catch (e) {
      console.error('Visitor counter error:', e);
      setUI('—');
    }
  }
});
