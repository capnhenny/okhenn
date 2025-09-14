// /api/visits.js
// Edge Function: robust visit counter proxy with fallback + one-hit-per-browser cookie.
// Add ?mode=get or ?mode=hit; add ?debug=1 to see diagnostics.

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const mode = (url.searchParams.get('mode') || 'get').toLowerCase();
  const debug = url.searchParams.get('debug') === '1';

  const host = (req.headers.get('host') || 'localhost').replace(/^www\./, '');
  const NAMESPACE = 'okhenn-site';
  const KEY = `${host}_visits`;

  const cookie = req.headers.get('cookie') || '';
  const already = /oh_counted=1/.test(cookie); // one per browser for `mode=hit`
  const noCache = { cache: 'no-store' };

  const providers = [
    // primary
    {
      name: 'countapi',
      base: 'https://api.countapi.xyz',
      get: (ns, key) => `${this.base}/get/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`,
      create: (ns, key) => `${this.base}/create?namespace=${encodeURIComponent(ns)}&key=${encodeURIComponent(key)}&value=0`,
      hit: (ns, key) => `${this.base}/hit/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`
    },
    // fallback (compatible API)
    {
      name: 'freecountapi',
      base: 'https://api.freecountapi.xyz',
      get: (ns, key) => `${this.base}/get/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`,
      create: (ns, key) => `${this.base}/create?namespace=${encodeURIComponent(ns)}&key=${encodeURIComponent(key)}&value=0`,
      hit: (ns, key) => `${this.base}/hit/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`
    }
  ];

  // helpers to bind provider methods (since `this` isn't set in Edge)
  const bind = (p) => ({
    name: p.name,
    get: (ns, key) => `${p.base}/get/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`,
    create: (ns, key) => `${p.base}/create?namespace=${encodeURIComponent(ns)}&key=${encodeURIComponent(key)}&value=0`,
    hit: (ns, key) => `${p.base}/hit/${encodeURIComponent(ns)}/${encodeURIComponent(key)}`
  });

  const dbg = { host, mode, already, providerTried: [], final: null, error: null };

  try {
    let lastErr = null;

    for (const p0 of providers) {
      const p = bind(p0);
      const tryStep = async () => {
        // ensure key exists
        let r = await fetch(p.get(NAMESPACE, KEY), noCache);
        if (!r.ok) {
          const c = await fetch(p.create(NAMESPACE, KEY), noCache);
          if (!c.ok) throw new Error(`${p.name}: create failed HTTP ${c.status}`);
          await c.json();
        }

        // perform action
        let data;
        if (mode === 'hit' && !already) {
          const h = await fetch(p.hit(NAMESPACE, KEY), noCache);
          if (!h.ok) throw new Error(`${p.name}: hit failed HTTP ${h.status}`);
          data = await h.json();
        } else {
          const g = await fetch(p.get(NAMESPACE, KEY), noCache);
          if (!g.ok) throw new Error(`${p.name}: get failed HTTP ${g.status}`);
          data = await g.json();
        }
        return data;
      };

      try {
        const data = await tryStep();
        // success — build response
        const headers = {
          'content-type': 'application/json',
          'cache-control': 'no-store, no-cache, max-age=0'
        };
        if (mode === 'hit' && !already) {
          headers['set-cookie'] = 'oh_counted=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure';
        }
        dbg.providerTried.push({ provider: p.name, ok: true });
        dbg.final = { provider: p.name, value: data.value };

        return new Response(
          JSON.stringify(debug ? { value: data.value, debug: dbg } : { value: data.value }),
          { status: 200, headers }
        );
      } catch (e) {
        lastErr = `${e?.message || e}`;
        dbg.providerTried.push({ provider: p.name, ok: false, error: lastErr });
        // fall through to next provider
      }
    }

    // if we got here, all providers failed
    dbg.error = lastErr || 'all providers failed';
    return new Response(
      JSON.stringify(debug ? { value: null, error: dbg.error, debug: dbg } : { value: null, error: 'counter-failed' }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  } catch (e) {
    dbg.error = `${e?.message || e}`;
    return new Response(
      JSON.stringify(debug ? { value: null, error: dbg.error, debug: dbg } : { value: null, error: 'counter-failed' }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  }
}
