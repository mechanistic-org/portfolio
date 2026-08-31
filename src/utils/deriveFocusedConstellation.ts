export const PROJECT_RELATIONSHIP_KINDS = [
	"successor_of",
	"derived_from",
	"component_of",
	"variant_of",
	"shares_platform_with",
	"method_transfer_from",
] as const;

export type ProjectRelationshipKind = (typeof PROJECT_RELATIONSHIP_KINDS)[number];

export interface ProjectRelationship {
	edge_key: string;
	source: string;
	target: string;
	kind: ProjectRelationshipKind;
	public_claim: string;
}

export interface FocusedProjectRelationship extends ProjectRelationship {
	relatedProjectId: string;
}

interface FocusedConstellationInput {
	relationships: readonly ProjectRelationship[];
	projectIds: Iterable<string>;
	focusId: string | null | undefined;
}

export interface FocusedConstellation {
	focusId: string | null;
	relationships: FocusedProjectRelationship[];
}

const VALID_KINDS = new Set<string>(PROJECT_RELATIONSHIP_KINDS);

export function deriveFocusedConstellation({
	relationships,
	projectIds,
	focusId,
}: FocusedConstellationInput): FocusedConstellation {
	const validProjectIds = new Set(projectIds);
	const seenEdgeKeys = new Set<string>();
	let priorEdgeKey = "";

	for (const relationship of relationships) {
		const expectedEdgeKey = `${relationship.source}::${relationship.kind}::${relationship.target}`;
		if (
			!relationship.edge_key ||
			relationship.edge_key !== expectedEdgeKey ||
			!relationship.public_claim?.trim() ||
			!VALID_KINDS.has(relationship.kind) ||
			relationship.source === relationship.target ||
			!validProjectIds.has(relationship.source) ||
			!validProjectIds.has(relationship.target) ||
			seenEdgeKeys.has(relationship.edge_key) ||
			relationship.edge_key <= priorEdgeKey
		) {
			throw new Error(
				`Invalid public project relationship: ${relationship.edge_key || "<missing>"}`,
			);
		}
		seenEdgeKeys.add(relationship.edge_key);
		priorEdgeKey = relationship.edge_key;
	}

	if (!focusId || !validProjectIds.has(focusId)) {
		return { focusId: null, relationships: [] };
	}

	return {
		focusId,
		relationships: relationships
			.filter(({ source, target }) => source === focusId || target === focusId)
			.map((relationship) => ({
				...relationship,
				relatedProjectId:
					relationship.source === focusId ? relationship.target : relationship.source,
			})),
	};
}
