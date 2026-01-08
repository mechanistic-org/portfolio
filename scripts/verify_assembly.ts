import { getCareerAssembly } from "../src/utils/mapCareerAssembly";

async function verify() {
	console.log("--- BEGIN VERIFICATION: Career Assembly ---");
	try {
		const assembly = await getCareerAssembly();

		console.log(`Nodes Fabricated: ${assembly.nodes.length}`);
		console.log(`Links Fastened: ${assembly.links.length}`);

		const projects = assembly.nodes.filter((n) => n.type === "project");
		const skills = assembly.nodes.filter((n) => n.type === "skill");

		console.log(`- Project Nodes: ${projects.length}`);
		console.log(`- Skill Nodes:   ${skills.length}`);

		// Check for Intelligence Bolus
		const bolusNodes = projects.filter((p) => p.intelligence);
		console.log(`- Projects with Intelligence: ${bolusNodes.length}`);
		if (bolusNodes.length > 0) {
			console.log(
				`  > Example: ${bolusNodes[0].id} has ${bolusNodes[0].intelligence?.length} chars of intelligence.`,
			);
		} else {
			console.log("  > No Intelligence Boluses found (Expected if files missing).");
		}

		console.log("--- LINKS SAMPLE ---");
		console.log(assembly.links.slice(0, 3));
	} catch (error) {
		console.error("CRITICAL FAILURE:", error);
	}
	console.log("--- END VERIFICATION ---");
}

verify();
