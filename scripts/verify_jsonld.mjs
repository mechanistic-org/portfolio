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
					const hasWebSite = content.includes('"@type": "WebSite"');
					const hasTechArticle = content.includes("TechArticle");
					const hasOrgRole = content.includes("OrganizationRole");
					const hasAbout = content.includes('"about":');

					console.log(`\n--- JSON-LD BLOCK ${i + 1} ---`);
					if (content.length > 2000) {
						console.log(
							content.substring(0, 500) +
								"\n...[snip]...\n" +
								content.substring(content.length - 200),
						);
					} else {
						console.log(content);
					}
					console.log("\n--- ANALYSIS ---");
					console.log(`URL: ${url}`);
					console.log(`[Profile Page]:   ${isProfile}`);
					console.log(`[Person Entity]:  ${isPerson}`);
					console.log(`[#identity ID]:   ${hasIdentity}`);
					console.log(`[Project Type]:   ${isProject} && ${isCreativeWork}`);
					console.log(`[TechArticle]:    ${hasTechArticle}`);
					console.log(`[Creator Link]:   ${hasCreator}`);
					console.log(`[Breadcrumbs]:    ${hasBreadcrumbs}`);
					console.log(`[WebSite Schema]: ${hasWebSite}`);
					console.log(`[Alumni Roles]:   ${hasOrgRole}`);
					console.log(`[About Keywords]: ${hasAbout}`);
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
