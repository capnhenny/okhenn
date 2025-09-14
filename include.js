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

<script>
  // auto-year
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // ---- Visitor Counter (countapi + unique per browser) ----
  (async () => {
    const ns = 'okhenn-site'; // namespace for your site (can be any string)
    const key = (location.hostname || 'localhost') + '_visits'; // per-domain key
    const already = localStorage.getItem('okhenn_counted');

    const setUI = (n) => {
      const el = document.getElementById('visits');
      if (el) el.textContent = n?.toLocaleString?.() ?? n;
    };

    try {
      // If we haven't counted this browser yet, increment once.
      if (!already) {
        const hit = await fetch(`https://api.countapi.xyz/hit/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`)
          .then(r => r.json());
        setUI(hit.value);
        localStorage.setItem('okhenn_counted', '1'); // mark as counted on this browser
      } else {
        // Just read the current value without incrementing
        const get = await fetch(`https://api.countapi.xyz/get/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`)
          .then(r => r.json());
        setUI(get.value);
      }
    } catch (e) {
      console.error('Visitor counter error:', e);
      setUI('—'); // fallback UI
    }
  })();
</script>
