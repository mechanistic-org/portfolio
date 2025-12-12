/**
 * ⚠️ CRITICAL ARCHITECTURE COMPONENT ⚠️
 * 
 * This file is part of the "Zero-Bloat" Manual Worker Strategy.
 * READ [docs/ARCHITECTURE.md] BEFORE MODIFYING.
 * 
 * 1. This file is HAND-WRITTEN. Astro does NOT generate it.
 * 2. It exists to bypass Cloudflare's module limits by separating the Worker from the Site Build.
 * 3. It handles ONLY the R2 Proxy.
 * 4. Do NOT import large libraries here. Keep it lightweight (< 10KB).
 */
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // R2 Proxy Logic for /r2/*
        // We use /r2/ to avoid collision with Astro's /assets/ directory
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

        // Default: Serve static assets from Cloudflare Pages
        // env.ASSETS is the binding to the static assets uploaded by Pages
        return env.ASSETS.fetch(request);
    },
};
