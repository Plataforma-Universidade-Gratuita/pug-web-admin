import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge } from "@/components";
import type {
	AdminComplexSearchItemResponse,
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
	compareNormalizedText,
	matchesAnyDateRange,
	normalizeTextForSearch,
	toSearchDateOffsetDateTime,
} from "@/utils";

export { createProjectEditorFormSchema } from "@/schemas";

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

export function appendCopyToProjectName(name: string) {
	return `${name} Copy`;
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
			return "brand";
		case "ON_HOLD":
			return "warning";
		case "PLANNED":
		default:
			return "info";
	}
}

export function resolveProjectEntityLabel(
	entityById: Map<string, EntityResponse>,
	entityId: string,
) {
	return entityById.get(entityId)?.name ?? entityId;
}

export function resolveProjectCreatorLabel(
	adminById: Map<string, AdminComplexSearchItemResponse>,
	accountId: string,
) {
	return adminById.get(accountId)?.account.user.name ?? accountId;
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
	admins: AdminComplexSearchItemResponse[],
): ComboboxOption[] {
	return [...admins]
		.sort((left, right) =>
			compareNormalizedText(left.account.user.name, right.account.user.name),
		)
		.map(admin => ({
			value: admin.account.id,
			label: admin.account.user.name,
			description: admin.account.email,
		}));
}

export function createProjectColumns(
	t: TFunction,
	adminById: Map<string, AdminComplexSearchItemResponse>,
): ColumnDef<ProjectResponse>[] {
	return [
		{
			accessorFn: row => row.status.status,
			id: "status",
			header: t("project.projectPage.table.columns.status"),
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
		{
			accessorKey: "id",
			header: t("project.projectPage.table.columns.id"),
		},
		{
			accessorKey: "name",
			header: t("project.projectPage.table.columns.name"),
		},
		{
			accessorKey: "description",
			header: t("project.projectPage.table.columns.description"),
		},
		{
			accessorFn: row => row.entity.name,
			id: "entity",
			header: t("project.projectPage.table.columns.entity"),
		},
		{
			accessorFn: row =>
				resolveProjectCreatorLabel(adminById, row.projectInfo.createdBy),
			id: "createdBy",
			header: t("project.projectPage.table.columns.createdBy"),
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
		{
			accessorFn: row => row.projectInfo.auditInfo.createdAtFormatted,
			id: "createdAt",
			header: t("project.projectPage.table.columns.createdAt"),
		},
		{
			accessorFn: row => row.projectInfo.auditInfo.updatedAtFormatted,
			id: "updatedAt",
			header: t("project.projectPage.table.columns.updatedAt"),
		},
	];
}

export function buildProjectComplexSearchRequest(
	filters: ProjectComplexSearchFilters,
): ProjectComplexSearchRequest {
	return {
		createdByIds:
			filters.createdByIds.length > 0 ? filters.createdByIds : undefined,
		dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start"),
		dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end"),
		entityIds: filters.entityIds.length > 0 ? filters.entityIds : undefined,
		statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
	};
}

export function filterProjectsByBackendFilters(
	projects: ProjectResponse[],
	filters: ProjectComplexSearchFilters,
) {
	const hasCreatedByIds = filters.createdByIds.length > 0;
	const hasEntityIds = filters.entityIds.length > 0;
	const hasStatuses = filters.statuses.length > 0;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);

	if (!hasCreatedByIds && !hasEntityIds && !hasStatuses && !hasDateRange) {
		return projects;
	}

	return projects.filter(project => {
		if (
			hasCreatedByIds &&
			!filters.createdByIds.includes(project.projectInfo.createdBy)
		) {
			return false;
		}

		if (hasEntityIds && !filters.entityIds.includes(project.entity.id)) {
			return false;
		}

		if (hasStatuses && !filters.statuses.includes(project.status.status)) {
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
	{ adminById, query }: Pick<ProjectFilterArgs, "adminById" | "query">,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	if (!normalizedQuery) {
		return projects;
	}

	return projects.filter(project => {
		const normalizedName = normalizeTextForSearch(project.name);
		const normalizedDescription = normalizeTextForSearch(project.description);
		const normalizedEntity = normalizeTextForSearch(project.entity.name);
		const normalizedCreator = normalizeTextForSearch(
			resolveProjectCreatorLabel(adminById, project.projectInfo.createdBy),
		);
		const normalizedStatus = normalizeTextForSearch(
			project.status.statusFormatted,
		);

		return (
			normalizedName.includes(normalizedQuery) ||
			normalizedDescription.includes(normalizedQuery) ||
			normalizedEntity.includes(normalizedQuery) ||
			normalizedCreator.includes(normalizedQuery) ||
			normalizedStatus.includes(normalizedQuery)
		);
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
		fallbackTitle: t("project.projectPage.feedback.listError.title"),
		fallbackDescription: t(
			"project.projectPage.feedback.listError.description",
		),
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
		fallbackTitle: t("project.projectPage.feedback.entitiesError.title"),
		fallbackDescription: t(
			"project.projectPage.feedback.entitiesError.description",
		),
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
		description: "",
		entityId: "",
		maxParticipants: "",
		name: "",
		offeredHours: "",
	};
}

export function buildProjectUpdateFormValues(
	project: ProjectResponse,
): ProjectEditorFormValues {
	return {
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
): ProjectEditorFormValues {
	return {
		...buildProjectUpdateFormValues(project),
		name: appendCopyToProjectName(project.name),
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
		adminById,
		createdByIds,
		dateFrom,
		dateTo,
		entityById,
		entityIds,
		query,
		statuses,
	}: ProjectFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (entityIds.length > 0) {
		parts.push(
			entityIds
				.map(entityId => resolveProjectEntityLabel(entityById, entityId))
				.join(", "),
		);
	}

	if (createdByIds.length > 0) {
		parts.push(
			createdByIds
				.map(createdById => resolveProjectCreatorLabel(adminById, createdById))
				.join(", "),
		);
	}

	if (statuses.length > 0) {
		parts.push(
			statuses.map(status => getProjectStatusLabel(t, status)).join(", "),
		);
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
