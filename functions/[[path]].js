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

    // DEBUG: Health Check to verify Worker is running
    if (url.pathname === '/debug/health') {
        return new Response('Worker is RUNNING (Functions Mode)', { status: 200 });
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
                return new Response(`R2 Object Not Found: ${key}`, { status: 404 });
            }

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            // CRITICAL: Force revalidation to fix stale asset issues
            headers.set('Cache-Control', 'no-cache');

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
