import { jsonResume } from "../config/resume_projection.ts";
export const prerender = true;
export async function GET() {
	return new Response(JSON.stringify(jsonResume(), null, 2), {
		headers: { "Content-Type": "application/json; charset=utf-8" },
	});
}
