import { appendCopyToText } from "@/features/utils";
import type {
	ProjectCreateRequest,
	ProjectResponse,
	ProjectUpdateRequest,
} from "@/types/api";
import type { ProjectEditorFormValues } from "@/types/client";

function parsePositiveInteger(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const parsed = Number(trimmed);
	if (!Number.isInteger(parsed) || parsed <= 0) {
		return null;
	}

	return parsed;
}

export function getEmptyProjectEditorFormValues(): ProjectEditorFormValues {
	return {
		areaOfExpertiseIds: [],
		description: "",
		entityId: "",
		maxParticipants: "",
		name: "",
		offeredHours: "",
	};
}

export function buildProjectUpdateFormValues(
	project: ProjectResponse,
	areaOfExpertiseIds: string[] = [],
): ProjectEditorFormValues {
	return {
		areaOfExpertiseIds,
		description: project.description,
		entityId: project.entity.id,
		maxParticipants:
			project.projectInfo.maxParticipants === null
				? ""
				: String(project.projectInfo.maxParticipants),
		name: project.name,
		offeredHours: String(project.projectInfo.offeredHours ?? ""),
	};
}

export function buildProjectDuplicateFormValues(
	project: ProjectResponse,
	areaOfExpertiseIds: string[] = [],
): ProjectEditorFormValues {
	return {
		...buildProjectUpdateFormValues(project, areaOfExpertiseIds),
		name: appendCopyToText(project.name),
	};
}

export function toProjectCreateRequest(
	values: ProjectEditorFormValues,
): ProjectCreateRequest {
	return {
		description: values.description.trim(),
		entityId: values.entityId,
		maxParticipants: parsePositiveInteger(values.maxParticipants),
		name: values.name.trim(),
		offeredHours: Number(values.offeredHours),
	};
}

export function toProjectUpdateRequest(
	values: ProjectEditorFormValues,
): ProjectUpdateRequest {
	return {
		description: values.description.trim(),
		maxParticipants: parsePositiveInteger(values.maxParticipants),
		name: values.name.trim(),
		offeredHours: Number(values.offeredHours),
	};
}
