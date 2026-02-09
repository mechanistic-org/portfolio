import { getCareerAssembly } from "../../../utils/mapCareerAssembly";

export async function GET() {
	try {
		const assembly = await getCareerAssembly();
		return new Response(
			JSON.stringify(
				{
					meta: {
						nodeCount: assembly.nodes.length,
						linkCount: assembly.links.length,
						bolusCheck: assembly.nodes.filter((n: any) => n.hasIntelligence).length,
					},
					sample: assembly.nodes.slice(0, 2),
					links: assembly.links.slice(0, 2),
					debugGlobs: (assembly as any).debugGlobs || "Not Exposed",
				},
				null,
				2,
			),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (e: any) {
		return new Response(JSON.stringify({ error: e.message, stack: e.stack }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
