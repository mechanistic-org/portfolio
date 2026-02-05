import { type CollectionEntry } from "astro:content";
import siteData from "@config/siteData.json";

interface GeneralProps {
	type: "general" | "project";
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
		const keywords = projectFrontmatter.additionalSkills
			? projectFrontmatter.additionalSkills.join(", ")
			: projectFrontmatter.compentencies
				? projectFrontmatter.compentencies.join(", ")
				: "";

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

	return `<script type="application/ld+json">
      {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": "${siteData.title}",
      "url": "${import.meta.env.SITE}"
      }
    </script>`;
}
