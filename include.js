// include.js — partial includes + active nav + year + visitor counter via /api/visits
document.addEventListener('DOMContentLoaded', () => {
  const slots = document.querySelectorAll('[data-include]');
  let done = 0;

  if (slots.length === 0) afterIncludes();
  slots.forEach(async (el) => {
    const url = el.getAttribute('data-include');
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
    // highlight current page
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('nav a').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === here) a.setAttribute('aria-current', 'page');
    });

    // year
    const y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();

    // visitor counter (same-origin -> /api/visits)
    const span = document.getElementById('visits');
    if (!span) return;

    const setUI = (n) => { span.textContent = (n?.toLocaleString?.() ?? n ?? '—'); };

    try {
      // Show current value first
      const g = await fetch('/api/visits?mode=get', { cache: 'no-store' }).then(r => r.json());
      if (g && typeof g.value === 'number') setUI(g.value);

      // Then try to increment once; API sets a cookie to avoid double-counts
      const h = await fetch('/api/visits?mode=hit', { cache: 'no-store' }).then(r => r.json());
      if (h && typeof h.value === 'number') setUI(h.value);
    } catch (e) {
      console.error('Visitor counter error:', e);
      setUI('—');
    }
  }
});
