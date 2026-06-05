import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import {
	Badge,
	createDateTimeColumn,
	createTableTextColumn,
	TableText,
} from "@/components";
import type {
	AccountSimpleComplexSearchResponse,
	AreaOfExpertiseResponse,
	EntityResponse,
	ProjectComplexSearchFilters,
	ProjectComplexSearchRequest,
	ProjectCreateRequest,
	ProjectResponse,
	ProjectStatus,
	ProjectUpdateRequest,
} from "@/types";
import type { BadgeTone, ComboboxOption } from "@/types";
import type {
	ProjectEditorFormValues,
	ProjectFilterArgs,
	ProjectStatusAction,
} from "@/types";
import { getApiErrorToastContent } from "@/utils";
import {
	appendCopyToText,
	compareNormalizedText,
	matchesAnyDateRange,
	normalizeTextForSearch,
	toSearchDateOffsetDateTime,
} from "@/utils";

export { createProjectEditorFormSchema } from "@/schemas";

const TABLE_IDENTIFIER_TEXT_WIDTH = 70;
const TABLE_DESCRIPTION_TEXT_WIDTH = 220;

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

function parseOptionalPositiveNumber(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return undefined;
	}

	const parsed = Number(trimmed);
	if (!Number.isFinite(parsed) || parsed < 0) {
		return undefined;
	}

	return parsed;
}

export function getProjectStatusLabel(t: TFunction, status: ProjectStatus) {
	return t(`project.projectPage.status.options.${status}`);
}

export function getProjectStatusTone(status: ProjectStatus): BadgeTone {
	switch (status) {
		case "CANCELED":
			return "danger";
		case "COMPLETED":
			return "success";
		case "IN_PROGRESS":
			return "info";
		case "ON_HOLD":
			return "warning";
		case "PLANNED":
		default:
			return "brand";
	}
}

export function resolveProjectEntityLabel(
	entityById: Map<string, EntityResponse>,
	entityId: string,
) {
	return entityById.get(entityId)?.name ?? entityId;
}

export function resolveProjectCreatorLabel(
	createdBy: string | AccountSimpleComplexSearchResponse,
) {
	return typeof createdBy === "string" ? createdBy : createdBy.name;
}

export function buildProjectEntityOptions(
	entities: EntityResponse[],
): ComboboxOption[] {
	return [...entities]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(entity => ({
			value: entity.id,
			label: entity.name,
			description: entity.cnpjFormatted,
		}));
}

export function buildProjectCreatorOptions(
	creators: AccountSimpleComplexSearchResponse[],
): ComboboxOption[] {
	return [...creators]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(createdBy => ({
			value: createdBy.id,
			label: createdBy.name,
			description: createdBy.email,
		}));
}

export function buildProjectAreaOfExpertiseOptions(
	areasOfExpertise: AreaOfExpertiseResponse[],
): ComboboxOption[] {
	return [...areasOfExpertise]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(areaOfExpertise => ({
			value: areaOfExpertise.id,
			label: areaOfExpertise.name,
		}));
}

export function createProjectColumns(
	t: TFunction,
): ColumnDef<ProjectResponse>[] {
	return [
		{
			accessorFn: row => row.status.status,
			id: "status",
			header: t("common.fields.status"),
			cell: ({ row }) => (
				<Badge
					tone={getProjectStatusTone(row.original.status.status)}
					variant="primary"
					className="min-h-5 px-2 py-0.5"
				>
					{getProjectStatusLabel(t, row.original.status.status)}
				</Badge>
			),
		},
		createTableTextColumn<ProjectResponse>({
			id: "id",
			accessorKey: "id",
			header: t("project.projectPage.table.columns.id"),
			text: row => row.id,
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			maxWidth: TABLE_IDENTIFIER_TEXT_WIDTH,
		}),
		{
			accessorKey: "name",
			header: t("project.projectPage.table.columns.name"),
		},
		{
			accessorKey: "description",
			header: t("project.projectPage.table.columns.description"),
			cell: ({ row }) => (
				<TableText
					text={row.original.description}
					maxWidth={TABLE_DESCRIPTION_TEXT_WIDTH}
					tooltiped
				/>
			),
		},
		{
			accessorFn: row => row.entity.name,
			id: "entity",
			header: t("common.fields.entity"),
		},
		{
			accessorFn: row => row.projectInfo.createdBy.name,
			id: "createdBy",
			header: t("common.fields.email"),
		},
		{
			accessorFn: row => row.projectInfo.offeredHours ?? "-",
			id: "offeredHours",
			header: t("project.projectPage.table.columns.offeredHours"),
		},
		{
			accessorFn: row => row.projectInfo.completedHours ?? "-",
			id: "completedHours",
			header: t("project.projectPage.table.columns.completedHours"),
		},
		{
			accessorFn: row =>
				row.projectInfo.maxParticipants ??
				t("project.projectPage.dialog.values.unlimited"),
			id: "maxParticipants",
			header: t("project.projectPage.table.columns.maxParticipants"),
		},
		{
			accessorFn: row =>
				row.projectInfo.closedAt
					? row.projectInfo.closedAtFormatted
					: t("project.projectPage.dialog.values.open"),
			id: "closedAt",
			header: t("project.projectPage.table.columns.closedAt"),
		},
		createDateTimeColumn<ProjectResponse>({
			id: "createdAt",
			header: t("common.fields.createdAt"),
			value: row => row.projectInfo.auditInfo.createdAt,
			formattedValue: row => row.projectInfo.auditInfo.createdAtFormatted,
		}),
		createDateTimeColumn<ProjectResponse>({
			id: "updatedAt",
			header: t("common.fields.updatedAt"),
			value: row => row.projectInfo.auditInfo.updatedAt,
			formattedValue: row => row.projectInfo.auditInfo.updatedAtFormatted,
		}),
	];
}

export function buildProjectComplexSearchRequest(
	filters: ProjectComplexSearchFilters,
): ProjectComplexSearchRequest {
	return {
		name: filters.name.trim() || undefined,
		entityIds: filters.entityIds.length > 0 ? filters.entityIds : undefined,
		description: filters.description.trim() || undefined,
		createdByIds:
			filters.createdByIds.length > 0 ? filters.createdByIds : undefined,
		statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
		maxOfferedHours: parseOptionalPositiveNumber(filters.maxOfferedHours),
		minOfferedHours: parseOptionalPositiveNumber(filters.minOfferedHours),
		dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start"),
		dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end"),
	};
}

export function filterProjectsByBackendFilters(
	projects: ProjectResponse[],
	filters: ProjectComplexSearchFilters,
) {
	const normalizedName = normalizeTextForSearch(filters.name.trim());
	const normalizedDescription = normalizeTextForSearch(
		filters.description.trim(),
	);
	const hasCreatedByIds = filters.createdByIds.length > 0;
	const hasDescription = Boolean(normalizedDescription);
	const hasEntityIds = filters.entityIds.length > 0;
	const hasMaxOfferedHours = filters.maxOfferedHours.trim().length > 0;
	const hasMinOfferedHours = filters.minOfferedHours.trim().length > 0;
	const hasName = Boolean(normalizedName);
	const hasStatuses = filters.statuses.length > 0;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);

	if (
		!hasName &&
		!hasEntityIds &&
		!hasDescription &&
		!hasCreatedByIds &&
		!hasStatuses &&
		!hasMaxOfferedHours &&
		!hasMinOfferedHours &&
		!hasDateRange
	) {
		return projects;
	}

	const maxOfferedHours = parseOptionalPositiveNumber(filters.maxOfferedHours);
	const minOfferedHours = parseOptionalPositiveNumber(filters.minOfferedHours);

	return projects.filter(project => {
		if (
			hasName &&
			!normalizeTextForSearch(project.name).includes(normalizedName)
		) {
			return false;
		}

		if (
			hasCreatedByIds &&
			!filters.createdByIds.includes(project.projectInfo.createdBy.id)
		) {
			return false;
		}

		if (hasEntityIds && !filters.entityIds.includes(project.entity.id)) {
			return false;
		}

		if (
			hasDescription &&
			!normalizeTextForSearch(project.description).includes(
				normalizedDescription,
			)
		) {
			return false;
		}

		if (hasStatuses && !filters.statuses.includes(project.status.status)) {
			return false;
		}

		if (
			maxOfferedHours !== undefined &&
			(project.projectInfo.offeredHours ?? 0) > maxOfferedHours
		) {
			return false;
		}

		if (
			minOfferedHours !== undefined &&
			(project.projectInfo.offeredHours ?? 0) < minOfferedHours
		) {
			return false;
		}

		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					project.projectInfo.auditInfo.createdAt,
					project.projectInfo.auditInfo.updatedAt,
				],
				{
					...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
					...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
				},
			)
		) {
			return false;
		}

		return true;
	});
}

export function filterProjectsByFrontendFilters(
	projects: ProjectResponse[],
	{ query, statuses }: Pick<ProjectFilterArgs, "query" | "statuses">,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasStatuses = statuses.length > 0;

	if (!normalizedQuery && !hasStatuses) {
		return projects;
	}

	return projects.filter(project => {
		const normalizedName = normalizeTextForSearch(project.name);
		const normalizedDescription = normalizeTextForSearch(project.description);
		const normalizedEntity = normalizeTextForSearch(project.entity.name);
		const normalizedCreatedBy = normalizeTextForSearch(
			project.projectInfo.createdBy.name,
		);
		const matchesQuery =
			!normalizedQuery ||
			normalizedName.includes(normalizedQuery) ||
			normalizedDescription.includes(normalizedQuery) ||
			normalizedEntity.includes(normalizedQuery) ||
			normalizedCreatedBy.includes(normalizedQuery);

		if (!matchesQuery) {
			return false;
		}

		if (hasStatuses && !statuses.includes(project.status.status)) {
			return false;
		}

		return true;
	});
}

export function getProjectEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("project.projectPage.empty.title"),
		description: query
			? t("project.projectPage.empty.filteredDescription", { value: query })
			: t("project.projectPage.empty.defaultDescription"),
	};
}

export function getProjectsListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.projects.title"),
		fallbackDescription: t("common.loadErrors.projects.description"),
	});
}

export function getProjectDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.feedback.detailError.title"),
		fallbackDescription: t(
			"project.projectPage.feedback.detailError.description",
		),
	});
}

export function getProjectEntitiesErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.entities.title"),
		fallbackDescription: t("common.loadErrors.entities.description"),
	});
}

export function getProjectAdminsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.feedback.adminsError.title"),
		fallbackDescription: t(
			"project.projectPage.feedback.adminsError.description",
		),
	});
}

export function getProjectAreasOfExpertiseErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			"project.projectPage.feedback.areasOfExpertiseError.title",
		),
		fallbackDescription: t(
			"project.projectPage.feedback.areasOfExpertiseError.description",
		),
	});
}

export function getProjectCreateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.create.feedback.error.title"),
		fallbackDescription: t(
			"project.projectPage.create.feedback.error.description",
		),
	});
}

export function getProjectDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.duplicate.feedback.error.title"),
		fallbackDescription: t(
			"project.projectPage.duplicate.feedback.error.description",
		),
	});
}

export function getProjectUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.update.feedback.error.title"),
		fallbackDescription: t(
			"project.projectPage.update.feedback.error.description",
		),
	});
}

export function getProjectDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.delete.feedback.error.title"),
		fallbackDescription: t(
			"project.projectPage.delete.feedback.error.description",
		),
	});
}

export function getProjectStatusActionErrorToastContent(
	t: TFunction,
	error: unknown,
	action: ProjectStatusAction,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(`project.projectPage.${action}.feedback.error.title`),
		fallbackDescription: t(
			`project.projectPage.${action}.feedback.error.description`,
		),
	});
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

export function getProjectFilterSummary(
	t: TFunction,
	{
		dateFrom,
		dateTo,
		description,
		entityById,
		entityIds,
		maxOfferedHours,
		minOfferedHours,
		name,
		query,
		statuses,
	}: ProjectFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (name.trim()) {
		parts.push(name.trim());
	}

	if (entityIds.length > 0) {
		parts.push(
			entityIds
				.map(entityId => resolveProjectEntityLabel(entityById, entityId))
				.join(", "),
		);
	}

	if (description.trim()) {
		parts.push(description.trim());
	}

	if (statuses.length > 0) {
		parts.push(
			statuses.map(status => getProjectStatusLabel(t, status)).join(", "),
		);
	}

	if (maxOfferedHours.trim()) {
		parts.push(`<= ${maxOfferedHours.trim()}`);
	}

	if (minOfferedHours.trim()) {
		parts.push(`>= ${minOfferedHours.trim()}`);
	}

	if (dateFrom || dateTo) {
		parts.push([dateFrom || "...", dateTo || "..."].join(" - "));
	}

	return parts.join(" | ");
}

export function getProjectStatusOptions(t: TFunction) {
	return ["PLANNED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELED"].map(
		status => ({
			value: status as ProjectStatus,
			label: getProjectStatusLabel(t, status as ProjectStatus),
		}),
	);
}
