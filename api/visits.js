// /api/visits.js
// Vercel Node.js Function (same-origin proxy to CountAPI)
// - Auto-creates counter key if missing
// - One increment per browser via cookie
// - Always returns { value: number } on success

module.exports = async (req, res) => {
  try {
    // Ensure we have fetch in Node runtimes that don't expose it
    const fetchFn =
      (typeof fetch !== 'undefined')
        ? fetch
        : (await import('node-fetch')).default;

    const NAMESPACE = 'okhenn-site'; // keep stable for your site
    const host = (req.headers.host || 'localhost').replace(/^www\./, '');
    const KEY = `${host}_visits`;
    const mode = (req.query.mode || 'get').toLowerCase(); // 'get' or 'hit'

    // Helper: call CountAPI with no caching
    const call = async (url) => {
      const r = await fetchFn(url, { cache: 'no-store' });
      if (!r.ok) throw new Error(`CountAPI ${r.status}`);
      return r.json();
    };

    // Ensure key exists
    const ensure = async () => {
      const getURL = `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
      const r = await fetchFn(getURL, { cache: 'no-store' });
      if (r.ok) return r.json();
      const createURL = `https://api.countapi.xyz/create?namespace=${encodeURIComponent(NAMESPACE)}&key=${encodeURIComponent(KEY)}&value=0`;
      const c = await fetchFn(createURL, { cache: 'no-store' });
      if (!c.ok) throw new Error('CountAPI create failed');
      return c.json();
    };

    await ensure();

    // One-per-browser: skip hit if cookie is present
    const already = /oh_counted=1/.test(req.headers.cookie || '');
    let data;

    if (mode === 'hit' && !already) {
      const hitURL = `https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
      data = await call(hitURL);
      // mark browser as counted for ~1 year
      res.setHeader(
        'Set-Cookie',
        'oh_counted=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure'
      );
    } else {
      const getURL = `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
      data = await call(getURL);
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ value: data.value }));
  } catch (e) {
    console.error('[visits] error:', e);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ value: null, error: 'counter-failed' }));
  }
};
