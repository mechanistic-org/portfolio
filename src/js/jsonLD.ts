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
        "@type": "Project",
        "name": "${projectFrontmatter.title}",
        "description": "${projectFrontmatter.description}",
        "url": "${canonicalUrl}",
        "image": "${image?.src || siteData.defaultImage.src}",
        "foundingDate": "${projectFrontmatter.date}",
        "keywords": "${keywords}",
        "maintainer": {
            "@type": "Person",
            "name": "${siteData.author.name}"
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
		  "@type": ["ProfilePage", "Person"],
		  "name": "${siteData.author.name}",
		  "jobTitle": "Principal Mechanical Architect",
		  "description": "${siteData.description}",
		  "url": "${import.meta.env.SITE}",
		  "sameAs": [
			${siteData.sameAs.map((link) => `"${link}"`).join(",\n\t\t\t")}
		  ],
		  "knowsAbout": [
			${siteData.skills.map((skill) => `"${skill}"`).join(",\n\t\t\t")}
		  ],
		  "alumniOf": {
			"@type": "Organization",
			"name": "${siteData.alumni}"
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
