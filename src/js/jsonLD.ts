import siteData from "@config/siteData.json";

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

	if (type === "project") {
		const { projectFrontmatter, image, canonicalUrl } = props as ProjectProps;

		if (!projectFrontmatter) {
			return `<script type="application/ld+json">
			{
			"@context": "https://schema.org/",
			"@type": "WebSite",
			"name": "${siteData.title}",
			"url": "${import.meta.env.SITE}"
			}
			</script>`;
		}

		// extract skills for keywords
		const keywords = projectFrontmatter.tags
			? projectFrontmatter.tags.join(", ")
			: projectFrontmatter.additionalSkills
				? projectFrontmatter.additionalSkills.join(", ")
				: "Forensic Engineering";

		return `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": ["Project", "CreativeWork"],
        "name": "${projectFrontmatter.title}",
        "description": "${projectFrontmatter.description}",
        "url": "${canonicalUrl}",
        "image": "${image?.src || siteData.defaultImage.src}",
        "dateCreated": "${projectFrontmatter.date}",
        "keywords": "${keywords}",
        "creator": {
            "@id": "${import.meta.env.SITE}#identity"
        }
      }
    </script>`;
	}

	const { url } = props as GeneralProps;
	// ProfilePage Logic (Homepage Only or General fallback)
	if (url.pathname === "/" || url.pathname === "") {
		return `<script type="application/ld+json">
		{
		  "@context": "https://schema.org",
		  "@type": "ProfilePage",
		  "dateCreated": "${new Date().toISOString()}",
		  "dateModified": "${new Date().toISOString()}",
		  "mainEntity": {
			"@type": "Person",
			"@id": "${import.meta.env.SITE}#identity",
			"name": "${siteData.author.name}",
			"jobTitle": "Principal Mechanical Architect",
			"description": "${siteData.description}",
			"image": "${import.meta.env.SITE}${siteData.defaultImage.src}",
			"url": "${import.meta.env.SITE}",
			"sameAs": [
			${siteData.sameAs.map((link) => `"${link}"`).join(",\n\t\t\t")}
			],
			"knowsAbout": [
			${siteData.skills.map((skill) => `"${skill}"`).join(",\n\t\t\t")}
			],
			"alumniOf": [
			${siteData.employers
				.map(
					(employer) => `{
				"@type": "Organization",
				"name": "${employer}"
			}`,
				)
				.join(",\n\t\t\t")}
			]
		  }
		}
		</script>`;
	}

	return `<script type="application/ld+json">
      {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": "${siteData.title}",
      "url": "${import.meta.env.SITE}"
      }
    </script>`;
}
