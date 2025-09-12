document.addEventListener('DOMContentLoaded', () => {
  const slots = document.querySelectorAll('[data-include]');
  slots.forEach(async (el) => {
    const file = el.getAttribute('data-include');
    try {
      const res = await fetch(file, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.statusText);
      const html = await res.text();
      el.innerHTML = html;

      // highlight active nav link
      const here = location.pathname.split('/').pop() || 'index.html';
      el.querySelectorAll('nav a').forEach(a => {
        if (a.getAttribute('href') === here) {
          a.setAttribute('aria-current', 'page');
          a.style.fontWeight = '700';
          a.style.background = '#f3f3f3';
        }
      });
    } catch (e) {
      el.innerHTML = '<!-- include failed -->';
      console.error('Include error for', file, e);
    }
  });

  // auto-year in footer
  const yearSpot = document.getElementById("y");
  if (yearSpot) {
    yearSpot.textContent = new Date().getFullYear();
  }
});
