document.addEventListener('DOMContentLoaded', () => {
  const slots = document.querySelectorAll('[data-include]');
  slots.forEach(async (el) => {
    const url = el.getAttribute('data-include'); // use path exactly as written in HTML
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const html = await res.text();
      el.outerHTML = html; // replace placeholder with fetched markup
    } catch (err) {
      console.error('Include failed:', url, err);
      // Leave a visible comment so we can see it failed:
      el.outerHTML = `<!-- include failed: ${url} -->`;
    }
  });

  // highlight current page (runs after DOMContentLoaded; safe if header arrives slightly later)
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  // wait a tick so header nav is in DOM
  setTimeout(() => {
    document.querySelectorAll('nav a').forEach((a) => {
      if ((a.getAttribute('href') || '').toLowerCase() === here) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }, 0);
});
