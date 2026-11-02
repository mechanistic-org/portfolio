import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import mime from "mime-types";

const mirror = "D:/GitHub/portfolio-assets/R2_MIRROR";

// The mirror is on the host filesystem, outside the development Worker.
export function localAssetBridge() {
	return {
		name: "local-asset-bridge",
		hooks: {
			"astro:server:setup": ({ server }) => {
				server.middlewares.use("/assets", async (req, res) => {
					try {
						const key = decodeURIComponent(req.url.split("?")[0]).replace(/^\/(?:r2\/)?/, "");
						if (
							!["GET", "HEAD"].includes(req.method) ||
							key
								.split(/[\\/]/)
								.some((part) => !part || part === "." || part === ".." || part.includes(":"))
						) {
							res.writeHead(404).end();
							return;
						}
						const root = await realpath(mirror);
						const file = await realpath(path.resolve(root, key));
						const relative = path.relative(root, file);
						if (
							relative.startsWith(".." + path.sep) ||
							path.isAbsolute(relative) ||
							!(await stat(file)).isFile()
						) {
							res.writeHead(404).end();
							return;
						}
						res.setHeader("Content-Type", mime.lookup(file) || "application/octet-stream");
						res.setHeader("Cache-Control", "no-cache");
						if (req.method === "HEAD") res.end();
						else await pipeline(createReadStream(file), res);
					} catch (err) {
						if (!res.headersSent && !res.destroyed) {
							res
								.writeHead(
									err instanceof URIError
										? 400
										: ["ENOENT", "ENOTDIR"].includes(err.code)
											? 404
											: 500,
								)
								.end();
						}
					}
				});
			},
		},
	};
}
