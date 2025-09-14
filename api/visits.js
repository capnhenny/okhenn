// /api/visits.js
// Same-origin proxy for CountAPI + one-count-per-browser via cookie.
// Works on Vercel serverless functions.

export default async function handler(req, res) {
  try {
    const NAMESPACE = 'okhenn-site'; // keep this stable
    const KEY = (req.headers.host || 'localhost').replace(/^www\./, '') + '_visits';
    const mode = (req.query.mode || 'get').toLowerCase(); // 'get' or 'hit'

    // Helper: fetch CountAPI and return JSON
    const call = async (url) => {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw new Error(`CountAPI ${r.status}`);
      return r.json();
    };

    // Ensure key exists (create if 404)
    const ensure = async () => {
      const getURL = `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
      const r = await fetch(getURL, { cache: 'no-store' });
      if (r.ok) return r.json();
      // create key at 0
      const createURL = `https://api.countapi.xyz/create?namespace=${encodeURIComponent(NAMESPACE)}&key=${encodeURIComponent(KEY)}&value=0`;
      const c = await fetch(createURL, { cache: 'no-store' });
      if (!c.ok) throw new Error('CountAPI create failed');
      return c.json();
    };

    await ensure();

    // One-per-browser: if we already set cookie, don't hit again
    const already = /oh_counted=1/.test(req.headers.cookie || '');

    let data;
    if (mode === 'hit' && !already) {
      const hitURL = `https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
      data = await call(hitURL);
      // Mark browser counted for ~1 year
      res.setHeader(
        'Set-Cookie',
        `oh_counted=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure`
      );
    } else {
      const getURL = `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
      data = await call(getURL);
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.status(200).json({ value: data.value });
  } catch (e) {
    console.error(e);
    res.status(200).json({ value: null, error: 'counter-failed' });
  }
}
