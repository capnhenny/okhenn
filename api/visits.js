// /api/visits.js
// Global visitor counter backed by Upstash Redis over REST.
// One hit per browser via cookie, works on Vercel Edge Runtime.

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url  = new URL(req.url);
  const mode = (url.searchParams.get('mode') || 'get').toLowerCase();

  const REST_URL   = process.env.UPSTASH_REDIS_REST_URL;
  const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!REST_URL || !REST_TOKEN) {
    return new Response(
      JSON.stringify({ value: null, error: 'missing-redis-config' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  // One-hit-per-browser cookie (global-ish uniqueness)
  const cookieHeader = req.headers.get('cookie') || '';
  const already = /oh_global_counted=1/.test(cookieHeader);

  // Namespace key by host so different domains don’t share a counter
  const rawHost = (req.headers.get('host') || 'localhost').replace(/^www\./, '');
  const hostKey = rawHost.replace(/[^a-z0-9.-]/gi, '_');
  const COUNTER_KEY = `${hostKey}:visits`;

  const authHeaders = {
    Authorization: `Bearer ${REST_TOKEN}`,
    'cache-control': 'no-store',
  };
  const jsonHeaders = { 'content-type': 'application/json' };

  try {
    let value;

    if (mode === 'hit' && !already) {
      // INCR creates the key if it doesn't exist
      const res  = await fetch(`${REST_URL}/incr/${encodeURIComponent(COUNTER_KEY)}`, {
        headers: authHeaders,
      });
      const data = await res.json();
      // Upstash returns { result: number }
      value = Number(data.result ?? data.value ?? 0);
    } else {
      // Just GET existing value
      const res  = await fetch(`${REST_URL}/get/${encodeURIComponent(COUNTER_KEY)}`, {
        headers: authHeaders,
      });
      const data = await res.json();
      const raw  = data.result ?? data.value;
      value = raw == null ? 0 : Number(raw);
    }

    const respHeaders = { ...jsonHeaders };

    // Set cookie if this was a real "hit"
    if (mode === 'hit' && !already) {
      respHeaders['set-cookie'] =
        'oh_global_counted=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure';
    }

    return new Response(JSON.stringify({ value }), {
      status: 200,
      headers: respHeaders,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        value: null,
        error: 'redis-error',
        message: String(e && e.message ? e.message : e),
      }),
      { status: 200, headers: jsonHeaders }
    );
  }
}
