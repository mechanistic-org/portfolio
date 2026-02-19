import { fetch } from "undici";

async function check() {
	try {
		const res = await fetch("http://localhost:4321");
		const text = await res.text();
		// Look for all instances
		const matches = [
			...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
		];

		if (matches.length > 0) {
			console.log(`FOUND ${matches.length} JSON-LD BLOCKS:\n`);
			matches.forEach((m, i) => {
				console.log(`--- BLOCK ${i + 1} ---`);
				console.log(m[1].trim());
				console.log("------------------\n");
			});
		} else {
			console.log("NO JSON-LD FOUND");
		}
	} catch (e) {
		console.error("Error fetching:", e.message);
	}
}

check();
