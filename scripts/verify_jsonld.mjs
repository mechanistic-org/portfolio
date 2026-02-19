import { fetch } from "undici";

const urls = ["http://localhost:4321/projects/xbox/"];

async function check() {
	for (const url of urls) {
		console.log(`\n\n⬇️⬇️⬇️ CHECKING: ${url} ⬇️⬇️⬇️`);
		try {
			const res = await fetch(url);
			const text = await res.text();
			const matches = [
				...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
			];

			if (matches.length > 0) {
				matches.forEach((m, i) => {
					const content = m[1];
					// Check for specific strings
					const isProfile = content.includes('"@type": "ProfilePage"');
					const isPerson = content.includes('"@type": "Person"');
					const hasIdentity = content.includes('#identity"');

					const isProject = content.includes("Project");
					const isCreativeWork = content.includes("CreativeWork");
					const hasCreator = content.includes('"creator":');
					const hasBreadcrumbs = content.includes("BreadcrumbList");

					console.log(`\n--- JSON-LD BLOCK ${i + 1} ---`);
					if (content.length > 500) {
						console.log(
							content.substring(0, 200) +
								"\n...[snip]...\n" +
								content.substring(content.length - 100),
						);
					} else {
						console.log(content);
					}
					console.log("\n--- ANALYSIS ---");
					console.log(`URL: ${url}`);
					console.log(`[Profile Page]: ${isProfile}`);
					console.log(`[Person Entity]: ${isPerson}`);
					console.log(`[#identity ID]:  ${hasIdentity}`);
					console.log(`[Project Type]:  ${isProject} && ${isCreativeWork}`);
					console.log(`[Creator Link]:  ${hasCreator}`);
					console.log(`[Breadcrumbs]:   ${hasBreadcrumbs}`);
				});
			} else {
				console.log("❌ NO JSON-LD FILES FOUND");
			}
		} catch (e) {
			console.error("❌ ERROR fetching:", e.message);
		}
		// Wait a bit to separate logs
		await new Promise((r) => setTimeout(r, 500));
	}
}

check();
