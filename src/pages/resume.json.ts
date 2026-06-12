import siteData from "@config/siteData.json";
import workHistory from "@config/work_history.json";

// Static endpoint: without this the route is dropped from the production
// static build and llms.txt points at a 404.
export const prerender = true;

export async function GET() {
	const resume = {
		basics: {
			name: siteData.author.name,
			label: "Principal Mechanical Architect",
			image: `${import.meta.env.SITE}${siteData.defaultImage.src}`,
			email: siteData.author.email,
			url: import.meta.env.SITE,
			summary: siteData.description,
			location: {
				city: "San Francisco Bay Area",
				region: "CA",
				countryCode: "US",
			},
			profiles: siteData.socialLinks.map((link) => ({
				network: link.platform,
				username: link.link.split("/").pop() || "",
				url: link.link,
			})),
		},
		work: workHistory.map((job) => ({
			name: job.company,
			position: job.title,
			url: "", // No URL in work_history.json
			startDate: job.start,
			endDate: job.end,
			summary: job.description,
			highlights: [job.description], // Putting description in highlights as well for visibility
		})),
		skills: siteData.skills.map((skill) => ({
			name: skill,
			level: "Master",
		})),
	};

	return new Response(JSON.stringify(resume, null, 2), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
