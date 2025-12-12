/**
 * ⚠️ CRITICAL ARCHITECTURE COMPONENT ⚠️
 * 
 * This file replaces the "Manual Worker" strategy with a "Pages Function".
 * It handles the R2 Asset Proxy for the "Zero-Bloat" architecture.
 * 
 * READ [docs/ARCHITECTURE.md] BEFORE MODIFYING.
 */

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // DEBUG: Deep Probe Health Check
    if (url.pathname === '/debug/health') {
        const testKey = 'dreamjob/dreamjob-hero-01-v2.jpg';
        let r2Status = 'UNKNOWN';
        let errorDetails = '';

        try {
            if (!env.PROJECTS) {
                return new Response('CRITICAL: env.PROJECTS is UNDEFINED. Check wrangler.toml binding.', { status: 500 });
            }

            const obj = await env.PROJECTS.get(testKey);
            r2Status = obj ? `FOUND (Size: ${obj.size} bytes)` : `MISSING (Key used: '${testKey}')`;
        } catch (e) {
            r2Status = 'ERROR';
            errorDetails = e.message;
        }

        const report = `
STATUS: RUNNING (Functions Mode)
BINDING: env.PROJECTS is ${!!env.PROJECTS ? 'DEFINED' : 'MISSING'}
TEST KEY: ${testKey}
RESULT: ${r2Status}
ERROR: ${errorDetails}
        `.trim();

        return new Response(report, { status: 200 });
    }

    // R2 Proxy Logic for /r2/*
    if (url.pathname.startsWith('/r2/')) {
        const key = url.pathname.replace('/r2/', '');

        // Safety: Allow only GET/HEAD
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        try {
            const object = await env.PROJECTS.get(key);

            if (!object) {
                return new Response(`R2 Object Not Found: ${key}`, {
                    status: 404,
                    headers: { 'X-Debug-Key': key }
                });
            }

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            // CRITICAL: Force revalidation to fix stale asset issues
            headers.set('Cache-Control', 'no-cache');
            headers.set('X-Debug-Key', key);

            return new Response(object.body, {
                headers,
            });
        } catch (e) {
            return new Response('Error fetching asset', { status: 500 });
        }
    }

    // Fallback: Serve static assets (Astro build)
    return context.next();
}
