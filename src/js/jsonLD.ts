import siteData from "@config/siteData.json.ts";
import workHistory from "@config/work_history.json";

interface GeneralProps {
	type: "general";
	url: URL;
}

export interface ProjectProps {
	type: "project";
	projectFrontmatter: any; // Using any for flexibility with CollectionEntry data
	image: any;
	canonicalUrl: URL;
}

export type JsonLDProps = GeneralProps | ProjectProps;

export default function jsonLDGenerator(props: JsonLDProps) {
	const { type } = props;
	const schemaPayload: any[] = [];

	// 1. Global WebSite Schema (The Domain)
	// Wraps the entire domain in a unified logical property
	schemaPayload.push({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${import.meta.env.SITE}#website`,
		url: import.meta.env.SITE,
		name: "Erik Norris - Forensic Architecture Ledger",
		publisher: {
			"@id": `${import.meta.env.SITE}#identity`,
		},
	});

	if (type === "project") {
		const { projectFrontmatter, image, canonicalUrl } = props as ProjectProps;

		if (projectFrontmatter) {
			// 2. The Case Study Payload (TechArticle)
			// Maps specific projects as "Evidence Nodes" linked to the main entity
			const keywords = projectFrontmatter.tags
				? projectFrontmatter.tags.join(", ")
				: projectFrontmatter.additionalSkills
					? projectFrontmatter.additionalSkills.join(", ")
					: "Forensic Engineering";

			const about = [
				...(projectFrontmatter.tags || []),
				...(projectFrontmatter.additionalSkills || []),
			].map((skill) => ({
				"@type": "Thing",
				name: skill,
			}));

			schemaPayload.push({
				"@context": "https://schema.org",
				"@type": ["TechArticle", "CreativeWork", "Project"],
				headline: projectFrontmatter.title,
				description: projectFrontmatter.description,
				url: canonicalUrl,
				image: image?.src || siteData.defaultImage.src,
				dateCreated: projectFrontmatter.date,
				keywords: keywords,
				author: {
					"@id": `${import.meta.env.SITE}#identity`,
				},
				creator: {
					"@id": `${import.meta.env.SITE}#identity`,
				},
				about: about,
			});
		}
	} else {
		const { url } = props as GeneralProps;
		// 3. The Entity (ProfilePage/Person)
		// Only on Homepage to avoid duplication, or could be on all pages if we want strong identity signal everywhere
		if (url.pathname === "/" || url.pathname === "") {
			schemaPayload.push({
				"@context": "https://schema.org",
				"@type": "ProfilePage",
				dateCreated: new Date().toISOString(),
				dateModified: new Date().toISOString(),
				mainEntity: {
					"@type": "Person",
					"@id": `${import.meta.env.SITE}#identity`,
					name: siteData.author.name,
					jobTitle: "Principal Mechanical Architect",
					disambiguatingDescription:
						"Mechanical Design Engineer specializing in consumer electronics and forensic architecture. Not the actor or physician.",
					description: siteData.description,
					image: `${import.meta.env.SITE}${siteData.defaultImage.src}`,
					url: import.meta.env.SITE,
					sameAs: siteData.sameAs,
					knowsAbout: siteData.skills,
					alumniOf: workHistory.map((job) => ({
						"@type": "OrganizationRole",
						alumniOf: {
							"@type": "Organization",
							name: job.company,
						},
						roleName: job.title,
						startDate: job.start.split("/").pop(), // Extract Year
						endDate: job.end === "Present" ? undefined : job.end.split("/").pop(),
					})),
				},
			});
		}
	}

	// 4. Breadcrumb Logic
	const breadcrumbs = [
		{
			"@type": "ListItem",
			position: 1,
			name: "Home",
			item: import.meta.env.SITE,
		},
	];

	if (type === "project") {
		const { projectFrontmatter, canonicalUrl } = props as ProjectProps;
		if (projectFrontmatter) {
			breadcrumbs.push({
				"@type": "ListItem",
				position: 2,
				name: "Projects",
				item: `${import.meta.env.SITE}/projects`,
			});
			breadcrumbs.push({
				"@type": "ListItem",
				position: 3,
				name: projectFrontmatter.title,
				item: canonicalUrl.href,
			});
		}
	}

	schemaPayload.push({
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: breadcrumbs,
	});

	// Return concatenated script tags
	return schemaPayload
		.map(
			(schema) => `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`,
		)
		.join("\n");
}
