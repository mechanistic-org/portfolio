export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // R2 Proxy Logic for /assets/r2/*
        if (url.pathname.startsWith('/assets/r2/')) {
            const key = url.pathname.replace('/assets/r2/', '');

            // Safety: Allow only GET/HEAD
            if (request.method !== 'GET' && request.method !== 'HEAD') {
                return new Response('Method Not Allowed', { status: 405 });
            }

            try {
                const object = await env.PROJECTS.get(key);

                if (!object) {
                    return new Response(`Asset not found: ${key}`, { status: 404 });
                }

                const headers = new Headers();
                object.writeHttpMetadata(headers);
                headers.set('etag', object.httpEtag);
                // Add cache control for better performance
                headers.set('Cache-Control', 'public, max-age=31536000, immutable');

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
