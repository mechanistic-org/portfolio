

export interface TimelineItem {
    title: string;
    cardTitle: string;
    cardSubtitle: string;
    cardDetailedText: string; // Keep for react-chrono
    responsibilities: string[]; // Structured for PDF
    keyProjects: string[]; // Structured for PDF
    techStack: string[];
    media?: {
        type: "IMAGE" | "VIDEO";
        source: {
            url: string;
        };
        name: string;
    };
}

export function parseTimelineMarkdown(markdown: string): TimelineItem[] {
    const items: TimelineItem[] = [];

    // Split by the H2 headers that define entries
    const chunks = markdown.split(/^##\s+(\d{4}-\d{2}.*?)\s*$/gm);

    for (let i = 1; i < chunks.length; i += 2) {
        const header = chunks[i].trim();
        const content = chunks[i + 1].trim();

        const headerParts = header.split('|').map(s => s.trim());
        const dateRange = headerParts[0] || "Unknown Date";
        const roleAndCompany = headerParts[1] || "Unknown Role";

        // Extract Context
        const contextMatch = content.match(/\*\*Context:\*\*(.*?)(?=\n|$)/);
        const context = contextMatch ? contextMatch[1].trim() : "";

        // Extract Location
        const locationMatch = content.match(/\*\*Location:\*\*(.*?)(?=\n|$)/);
        const location = locationMatch ? locationMatch[1].trim() : "";

        const fullSubtitle = [location, context].filter(Boolean).join(" • ");

        // Extract Responsibilities
        const respMatch = content.match(/### Core Responsibilities([\s\S]*?)(?=###|$)/);
        const responsibilities = respMatch
            ? respMatch[1].trim().split('\n').map(line => line.replace(/^\*\s*/, '').trim()).filter(Boolean)
            : [];

        // Extract Key Projects
        const projMatch = content.match(/### Key Projects \/ Wins([\s\S]*?)(?=###|$)/);
        const keyProjects = projMatch
            ? projMatch[1].trim().split('\n').map(line => line.replace(/^\*\s*/, '').trim()).filter(Boolean)
            : [];

        // Extract Tech Stack
        const techMatch = content.match(/### Tech Stack \/ skills([\s\S]*?)(?=###|$)/);
        const techStack = techMatch
            ? techMatch[1].trim().split(',').map(s => s.trim()).filter(Boolean)
            : [];

        // Construct Flat Text for Chrono
        let details = "";
        if (responsibilities.length > 0) {
            details += "RESPONSIBILITIES:\n" + responsibilities.map(r => "• " + r).join("\n") + "\n\n";
        }
        if (keyProjects.length > 0) {
            details += "KEY PROJECTS:\n" + keyProjects.map(p => "• " + p).join("\n") + "\n\n";
        }

        items.push({
            title: dateRange,
            cardTitle: roleAndCompany,
            cardSubtitle: fullSubtitle,
            cardDetailedText: details.trim(),
            responsibilities,
            keyProjects,
            techStack
        });
    }

    // Deduplicate and Merge Logic
    const uniqueItemsMap = new Map<string, TimelineItem>();

    for (const item of items) {
        // Create a unique key based on Title (Date) and Role (CardTitle)
        const key = `${item.title}-${item.cardTitle}`;

        if (uniqueItemsMap.has(key)) {
            const existing = uniqueItemsMap.get(key)!;
            const combinedResp = Array.from(new Set([...existing.responsibilities, ...item.responsibilities]));
            const combinedProj = Array.from(new Set([...existing.keyProjects, ...item.keyProjects]));
            const combinedTech = Array.from(new Set([...existing.techStack, ...item.techStack]));

            uniqueItemsMap.set(key, {
                ...existing,
                responsibilities: combinedResp,
                keyProjects: combinedProj,
                techStack: combinedTech,
                cardDetailedText: existing.cardDetailedText + "\n\n" + item.cardDetailedText
            });
        } else {
            uniqueItemsMap.set(key, item);
        }
    }

    const uniqueItems = Array.from(uniqueItemsMap.values());

    // Sort items by Start Date (Descending)
    return uniqueItems.sort((a, b) => {
        const getDate = (dStr: string) => {
            const raw = dStr.split('-')[0].trim(); // Get "2023-01" or "2023"
            return new Date(raw).getTime();
        };
        // If "Present", treat as future
        if (a.title.toLowerCase().includes("present")) return -1;
        if (b.title.toLowerCase().includes("present")) return 1;

        return getDate(b.title) - getDate(a.title);
    });
}


