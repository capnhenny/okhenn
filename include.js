document.addEventListener('DOMContentLoaded', () => {
  const slots = document.querySelectorAll('[data-include]');
  slots.forEach(async (el) => {
const file = el.getAttribute('data-include');
const url = file.startsWith('/') ? file : '/' + file;
const res = await fetch(url, { cache: 'no-cache' });

      if (!res.ok) throw new Error(res.statusText);
      const html = await res.text();
      el.innerHTML = html;

      // highlight current page
      const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      el.querySelectorAll('nav a').forEach(a => {
        if ((a.getAttribute('href') || '').toLowerCase() === here) {
          a.setAttribute('aria-current', 'page');
          a.style.fontWeight = '700';
          a.style.background = '#f3f3f3';
        }
      });
    } catch (e) {
      el.innerHTML = '<!-- include failed -->';
      console.error('Include error for', url, e);
    }
  });

  // auto-year
  const yearSpot = document.getElementById('y');
  if (yearSpot) yearSpot.textContent = new Date().getFullYear();
});
