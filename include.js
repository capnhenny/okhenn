document.addEventListener('DOMContentLoaded', () => {
  const slots = document.querySelectorAll('[data-include]');
  slots.forEach(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.statusText);
      const html = await res.text();
      el.outerHTML = html; // replaces the placeholder with the partial
    } catch (e) {
      el.innerHTML = '<!-- include failed -->';
      console.error('Include error for', url, e);
    }
  });

  // highlight current page
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('nav a').forEach((a) => {
    if ((a.getAttribute('href') || '').toLowerCase() === here) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // auto-year
  const yearSpot = document.getElementById('y');
  if (yearSpot) yearSpot.textContent = new Date().getFullYear();
});
