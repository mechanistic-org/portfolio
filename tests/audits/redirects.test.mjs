import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const redirects = readFileSync(new URL("../../public/_redirects", import.meta.url), "utf8")
	.split(/\r?\n/)
	.map((line) => line.trim())
	.filter((line) => line && !line.startsWith("#"));

const astroConfig = readFileSync(new URL("../../astro.config.mjs", import.meta.url), "utf8");

test("the Zeus alias covers both the bare and trailing-slash routes", () => {
	const exactRule = "/projects/zeus /projects/webtv-elmer 301";
	const wildcardRule = "/projects/zeus/* /projects/webtv-elmer 301";

	assert.ok(redirects.includes(exactRule));
	assert.ok(redirects.includes(wildcardRule));
	assert.ok(redirects.indexOf(exactRule) < redirects.indexOf(wildcardRule));
});

test("Cloudflare redirect rules stay out of Astro's normalized route map", () => {
	assert.doesNotMatch(astroConfig, /["']\/projects\/zeus\/?["']\s*:/);
});
