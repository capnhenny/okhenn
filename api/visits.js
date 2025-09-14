// /api/visits.js
// Edge Function: same-origin proxy to CountAPI with one-hit-per-browser via cookie.
// No dependencies; uses the Edge/Web fetch API.

export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const mode = (url.searchParams.get('mode') || 'get').toLowerCase(); // 'get' or 'hit'

    const host =
      (req.headers.get('host') || 'localhost').replace(/^www\./, '');
    const NAMESPACE = 'okhenn-site';             // keep this stable
    const KEY = `${host}_visits`;                // domain-scoped counter
    const cookie = req.headers.get('cookie') || '';
    const already = /oh_counted=1/.test(cookie); // one per browser

    const noCache = { cache: 'no-store' };

    const call = async (u) => {
      const r = await fetch(u, noCache);
      if (!r.ok) throw new Error(`CountAPI HTTP ${r.status}`);
      return r.json();
    };

    // Ensure key exists (create at 0 if missing)
    const getURL  = `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
    let cur = await fetch(getURL, noCache);
    if (!cur.ok) {
      const createURL = `https://api.countapi.xyz/create?namespace=${encodeURIComponent(NAMESPACE)}&key=${encodeURIComponent(KEY)}&value=0`;
      const created = await fetch(createURL, noCache);
      if (!created.ok) throw new Error(`CountAPI create failed (${created.status})`);
      await created.json();
    }

    let data;
    let setCookie = null;

    if (mode === 'hit' && !already) {
      const hitURL = `https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
      data = await call(hitURL);
      setCookie = 'oh_counted=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure';
    } else {
      data = await call(getURL);
    }

    return new Response(JSON.stringify({ value: data.value }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
        ...(setCookie ? { 'set-cookie': setCookie } : {})
      }
    });
  } catch (e) {
    // Return the actual error message to make debugging easier
    return new Response(JSON.stringify({ value: null, error: String(e?.message || e) }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }
}
