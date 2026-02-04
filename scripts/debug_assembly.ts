import { getCareerAssembly } from "../src/utils/mapCareerAssembly";

async function verify() {
	console.log("Loading Assembly...");
	const assembly = await getCareerAssembly();
	console.log(`Total Nodes: ${assembly.nodes.length}`);

	// Check for Meta/Bio
	const bio = assembly.nodes.find((n) => n.id.includes("bio") || n.data.employer === "erik_norris");
	if (bio) {
		console.log("✅ Bio Node Found:");
		console.log(`- ID: ${bio.id}`);
		console.log(`- Title: ${bio.data.title}`);
		console.log(`- Radius: ${bio.radius}`);
		console.log(`- Tier: ${bio.data.tier}`);
	} else {
		console.log("❌ Bio Node NOT Found.");
		// List top 5 nodes
		console.log(
			"Sample Nodes:",
			assembly.nodes.slice(0, 3).map((n) => n.id),
		);
	}
}

verify();
