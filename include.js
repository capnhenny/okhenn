// include.js — partial includes + active nav + year + sparkle
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

    // Sparkle: only clickable on journal page
    try {
      const sparkle = document.querySelector('.sparkle');
      if (sparkle) {
        const fresh = sparkle.cloneNode(true);
        sparkle.replaceWith(fresh);
        const here2 = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (here2 === 'journal.html') {
          fresh.classList.add('sparkle--link');
          fresh.setAttribute('role', 'link');
          fresh.setAttribute('tabindex', '0');
          fresh.setAttribute('aria-label', 'Open henntendo.com');
          const go = () => window.open('https://henntendo.com', '_blank', 'noopener');
          fresh.addEventListener('click', go);
          fresh.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') go(); });
        }
      }
    } catch (e) {
      console.error('Sparkle link error:', e);
    }

    // NOTE: removed the old visitor counter that hit /api/visits
    // The new unique counter lives in assets/js/visitor-counter.js
  }
});
