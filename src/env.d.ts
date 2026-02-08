/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@astrojs/image/client" />

interface ImportMetaEnv {
	readonly SITE_VARIANT: "main" | "mech" | "play";
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
