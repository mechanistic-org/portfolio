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
				const content = m[1];
				const hasProfile = content.includes('"@type": "ProfilePage"');
				const hasMainEntity = content.includes('"mainEntity": {');
				const hasPerson = content.includes('"@type": "Person"');
				const hasAlumni = content.includes('"alumniOf": [');
				const hasEP = content.includes('"name": "EP Technologies"');

				console.log(`--- BLOCK ${i + 1} CHECK ---`);
				console.log(`Has ProfilePage: ${hasProfile}`);
				console.log(`Has mainEntity:  ${hasMainEntity}`);
				console.log(`Has Person:      ${hasPerson}`);
				console.log(`Has Alumni Array:${hasAlumni}`);
				console.log(`Has EP Tech:     ${hasEP}`);
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
