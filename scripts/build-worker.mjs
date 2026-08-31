import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const command = isWindows ? (process.env.ComSpec ?? "cmd.exe") : "npm";
const args = isWindows ? ["/d", "/s", "/c", "npm run build"] : ["run", "build"];
const result = spawnSync(command, args, {
	stdio: "inherit",
	env: { ...process.env, CF_PAGES: "1" },
});

if (result.error) {
	throw result.error;
}

process.exit(result.status ?? 1);
