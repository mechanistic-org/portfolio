import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
export const SOURCE_INPUTS = [
	"src/config/resume_master.ts",
	"src/config/resume_projection.ts",
	"src/config/siteData.json.ts",
	"src/pages/resume/index.astro",
	"src/pages/index.astro",
	"src/pages/resume.json.ts",
	"src/pages/resume/pdf.astro",
	"src/components/Nav/Nav.astro",
	"src/components/Footer/Footer.astro",
	"src/js/jsonLD.ts",
	"src/layouts/BaseLayout.astro",
	"astro.config.mjs",
	"package.json",
	"package-lock.json",
	"scripts/resume_source.mjs",
	"scripts/generate_resume_pdf.cjs",
];
const hash = (data) => createHash("sha256").update(data).digest("hex");
export function sourceIdentity(root, revision, allowDirty = false) {
	root = fs.realpathSync(root);
	const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
	if (fs.realpathSync(git(["rev-parse", "--show-toplevel"])) !== root)
		throw new Error("Source must be the intended checkout root");
	const actual = git(["rev-parse", "HEAD"]);
	if (!revision || actual !== revision)
		throw new Error("Source revision mismatch; pass the intended full --revision");
	const dirty = !!git([
		"status",
		"--porcelain",
		"--untracked-files=normal",
		"--",
		"src",
		"scripts",
		"astro.config.mjs",
		"package.json",
		"package-lock.json",
	]);
	if (dirty && !allowDirty)
		throw new Error("Source checkout is dirty; candidate testing requires explicit --allow-dirty");
	const inputs = Object.fromEntries(
		SOURCE_INPUTS.map((name) => [name, hash(fs.readFileSync(path.join(root, name)))]),
	);
	return { root, revision, dirty, inputs, inputsSha256: hash(JSON.stringify(inputs)) };
}
export async function assertPortAvailable(port) {
	if (!Number.isInteger(port) || port < 1 || port > 65535)
		throw new Error("Invalid explicit source port");
	await new Promise((resolve, reject) => {
		const probe = net.createServer();
		probe.once("error", (error) =>
			reject(new Error(`Source endpoint occupied or unavailable: ${port} (${error.code})`)),
		);
		probe.listen({ host: "127.0.0.1", port, exclusive: true }, () => probe.close(resolve));
	});
}
export async function verifySource(url, expected) {
	const response = await fetch(new URL("/__resume_source", url), {
		signal: AbortSignal.timeout(10000),
		redirect: "error",
	});
	if (!response.ok) throw new Error("Source endpoint did not provide identity");
	const actual = await response.json();
	for (const key of ["root", "revision", "inputsSha256", "nonce"])
		if (actual[key] !== expected[key]) throw new Error(`Mismatched source endpoint: ${key}`);
	return actual;
}
export async function startResumeSource({ root, revision, port = 43919, allowDirty = false }) {
	const identity = { ...sourceIdentity(root, revision, allowDirty), nonce: randomUUID() };
	await assertPortAvailable(port);
	const { dev } = await import("astro");
	const server = await dev({
		root: pathToFileURL(identity.root + path.sep),
		server: { host: "127.0.0.1", port, open: false },
		devToolbar: { enabled: false },
		vite: {
			server: { strictPort: true },
			plugins: [
				{
					name: "verified-resume-source",
					configureServer(vite) {
						if (fs.realpathSync(vite.config.root) !== identity.root)
							throw new Error("Resolved render checkout mismatch");
						vite.middlewares.use((req, res, next) => {
							res.setHeader("X-Resume-Source", identity.nonce);
							if (req.url === "/__resume_source") {
								res.setHeader("Content-Type", "application/json");
								res.end(JSON.stringify(identity));
								return;
							}
							next();
						});
					},
				},
			],
		},
	});
	const url = `http://127.0.0.1:${port}`;
	try {
		if (server.address.port !== port) throw new Error("Astro changed the requested source port");
		await verifySource(url, identity);
		return {
			url,
			identity,
			stop: () => server.stop(),
			assertUnchanged: () => {
				const latest = sourceIdentity(identity.root, identity.revision, allowDirty);
				if (latest.inputsSha256 !== identity.inputsSha256)
					throw new Error("Resume inputs changed during render");
			},
		};
	} catch (error) {
		await server.stop();
		throw error;
	}
}
