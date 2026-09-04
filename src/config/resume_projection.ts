import { resumeMaster } from "./resume_master.ts";
import type { CareerPeriod, CareerRole } from "./resume_master.ts";
export type ResumeAuthority = typeof resumeMaster;
export const httpsUrl = (value: string) => (/^https:\/\//.test(value) ? value : `https://${value}`);
export const plainText = (value: string) => value.replace(/\*\*(.*?)\*\*/g, "$1");
export function formatPeriod(period: CareerPeriod): string {
	return period.precision === "unknown"
		? "Dates not specified"
		: `${period.start} - ${period.end ?? "Present"}`;
}
export function roleById(authority: ResumeAuthority, id: string): CareerRole {
	const roles = authority.career.filter((role) => role.id === id);
	if (roles.length !== 1) throw new Error(`Missing or duplicate canonical role ID: ${id}`);
	return roles[0];
}
export function resumeExperience(authority = resumeMaster) {
	return authority.experience.map((entry) => {
		const roles = entry.roleIds.map((id) => roleById(authority, id));
		if (!roles.length || (!entry.group && roles.length !== 1))
			throw new Error(`Invalid resume grouping: ${entry.id}`);
		const display = entry.group ?? {
			company: roles[0].company,
			title: roles[0].channels.resumeTitle ?? roles[0].canonicalTitle,
			location: roles[0].location ?? "",
			period: roles[0].period,
		};
		return { ...entry, ...display, dates: formatPeriod(display.period) };
	});
}
export function identityMetadata(authority = resumeMaster) {
	const { header, competencies, career } = authority;
	return {
		name: `${header.name}'s Portfolio`,
		title: `${header.name} | ${header.title}`,
		description: `${header.title}. ${header.tagline}.`,
		author: { name: header.name, email: header.contact.email },
		skills: Object.values(competencies).flat(),
		sameAs: [header.contact.linkedin, header.contact.github, header.contact.resume].map(httpsUrl),
		employers: [...new Set(career.map((role) => role.company))],
	};
}
export function pdfConfiguration(authority = resumeMaster) {
	return { url: authority.pdf.url, filename: authority.pdf.filename, sourcePath: "/resume/" };
}
export function jsonResume(authority = resumeMaster) {
	const { header, summary, education, recognition, competencies } = authority;
	return {
		$schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
		basics: {
			name: header.name,
			label: header.title,
			email: header.contact.email,
			phone: header.contact.phone,
			url: httpsUrl(header.contact.portfolio),
			summary: summary.executive,
			location: { address: header.contact.location },
			profiles: ["linkedin", "github"].map((network) => ({
				network,
				url: httpsUrl(header.contact[network]),
			})),
		},
		work: resumeExperience(authority).map((role) => ({
			name: role.company,
			position: role.title,
			...(role.period.precision === "year"
				? { startDate: role.period.start, ...(role.period.end ? { endDate: role.period.end } : {}) }
				: {}),
			summary: plainText(role.blurb),
			highlights: role.bullets.map(plainText),
		})),
		education: education.map((edu) => ({
			institution: edu.school,
			studyType: edu.degree,
			courses: [edu.details],
		})),
		awards: recognition.map((title) => ({ title })),
		skills: Object.entries(competencies).map(([name, keywords]) => ({ name, keywords })),
	};
}
export function personSchema(authority = resumeMaster) {
	const { header, education, recognition, career } = authority;
	const identity = identityMetadata(authority);
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": `${httpsUrl(header.contact.portfolio)}/#identity`,
		name: header.name,
		jobTitle: header.title,
		description: identity.description,
		email: header.contact.email,
		telephone: header.contact.phone,
		url: httpsUrl(header.contact.portfolio),
		address: { "@type": "PostalAddress", addressLocality: header.contact.location },
		sameAs: identity.sameAs,
		knowsAbout: identity.skills,
		award: recognition,
		alumniOf: education.map((edu) => ({ "@type": "EducationalOrganization", name: edu.school })),
		hasOccupation: career.map((role) => ({
			"@type": "Role",
			roleName: role.canonicalTitle,
			...(role.period.precision === "year"
				? { startDate: role.period.start, ...(role.period.end ? { endDate: role.period.end } : {}) }
				: {}),
			hasOccupation: {
				"@type": "Occupation",
				name: role.canonicalTitle,
				description: role.company,
			},
		})),
	};
}
