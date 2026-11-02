/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "cloudflare:workers" {
	// Use the web-platform stream and header types shared with the Astro endpoint.
	interface AssetObject {
		body: ReadableStream<Uint8Array>;
		httpEtag: string;
		writeHttpMetadata(headers: Headers): void;
	}
	export const env: { PROJECTS: { get(key: string): Promise<AssetObject | null> } };
}

interface ImportMetaEnv {
	readonly SITE_VARIANT: "main" | "mech" | "play";
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
