// /api/visits.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const mode = (url.searchParams.get('mode') || 'get').toLowerCase(); // 'get'|'hit'

    const host = (req.headers.get('host') || 'localhost').replace(/^www\./, '');
    const NAMESPACE = 'okhenn-site';
    const KEY = `${host}_visits`;

    const cookie = req.headers.get('cookie') || '';
    const already = /oh_counted=1/.test(cookie); // one per browser
    const noCache = { cache: 'no-store' };

    const call = async (u) => {
      const r = await fetch(u, noCache);
      if (!r.ok) throw new Error(`CountAPI HTTP ${r.status}`);
      return r.json();
    };

    // ensure key exists
    const getURL = `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
    let r = await fetch(getURL, noCache);
    if (!r.ok) {
      const createURL = `https://api.countapi.xyz/create?namespace=${encodeURIComponent(NAMESPACE)}&key=${encodeURIComponent(KEY)}&value=0`;
      const c = await fetch(createURL, noCache);
      if (!c.ok) throw new Error(`create failed ${c.status}`);
      await c.json();
    }

    let data, setCookie;
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
        'cache-control': 'no-store, no-cache, max-age=0',
        ...(setCookie ? { 'set-cookie': setCookie } : {})
      }
    });
  } catch (e) {
    // Return real error so we can see what's wrong
    return new Response(JSON.stringify({ value: null, error: String(e?.message || e) }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }
}
