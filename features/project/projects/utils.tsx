import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge } from "@/components";
import type {
	AdminResponse,
	AreaOfExpertiseResponse,
	EntityResponse,
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
import { compareNormalizedText, normalizeTextForSearch } from "@/utils";

export { createProjectEditorFormSchema } from "@/schemas";

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

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
	adminById: Map<string, AdminResponse>,
	accountId: string,
) {
	return adminById.get(accountId)?.userName ?? accountId;
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
	admins: AdminResponse[],
): ComboboxOption[] {
	return [...admins]
		.sort((left, right) => compareNormalizedText(left.userName, right.userName))
		.map(admin => ({
			value: admin.accountId,
			label: admin.userName,
			description: admin.accountEmail,
		}));
}

export function createProjectColumns(
	t: TFunction,
	entityById: Map<string, EntityResponse>,
	adminById: Map<string, AdminResponse>,
): ColumnDef<ProjectResponse>[] {
	return [
		{
			accessorFn: row => row.status,
			id: "status",
			header: t("project.projectPage.table.columns.status"),
			cell: ({ row }) => (
				<Badge
					tone={getProjectStatusTone(row.original.status)}
					variant="primary"
					className="min-h-5 px-2 py-0.5"
				>
					{getProjectStatusLabel(t, row.original.status)}
				</Badge>
			),
		},
		{
			accessorKey: "name",
			header: t("project.projectPage.table.columns.name"),
		},
		{
			accessorFn: row => resolveProjectEntityLabel(entityById, row.entityId),
			id: "entity",
			header: t("project.projectPage.table.columns.entity"),
		},
		{
			accessorFn: row => resolveProjectCreatorLabel(adminById, row.createdBy),
			id: "createdBy",
			header: t("project.projectPage.table.columns.createdBy"),
		},
		{
			accessorKey: "offeredHours",
			header: t("project.projectPage.table.columns.offeredHours"),
		},
		{
			accessorKey: "completedHours",
			header: t("project.projectPage.table.columns.completedHours"),
		},
	];
}

export function filterProjects(
	projects: ProjectResponse[],
	{
		adminById,
		createdByFilter,
		dateField,
		endDate,
		entityById,
		entityIdFilter,
		query,
		startDate,
		statusFilter,
	}: ProjectFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasCreatorFilter = createdByFilter.length > 0;
	const hasEntityFilter = entityIdFilter.length > 0;
	const hasStatusFilter = statusFilter.length > 0;
	const startTimestamp = startDate ? getStartOfDayTimestamp(startDate) : null;
	const endTimestamp = endDate ? getStartOfDayTimestamp(endDate) : null;

	if (
		!hasQuery &&
		!hasCreatorFilter &&
		!hasEntityFilter &&
		!hasStatusFilter &&
		!dateField &&
		startTimestamp === null &&
		endTimestamp === null
	) {
		return projects;
	}

	return projects.filter(project => {
		if (hasQuery) {
			const normalizedName = normalizeTextForSearch(project.name);
			const normalizedDescription = normalizeTextForSearch(project.description);
			const normalizedEntity = normalizeTextForSearch(
				resolveProjectEntityLabel(entityById, project.entityId),
			);
			const normalizedCreator = normalizeTextForSearch(
				resolveProjectCreatorLabel(adminById, project.createdBy),
			);
			const normalizedStatus = normalizeTextForSearch(project.statusFormatted);

			if (
				!normalizedName.includes(normalizedQuery) &&
				!normalizedDescription.includes(normalizedQuery) &&
				!normalizedEntity.includes(normalizedQuery) &&
				!normalizedCreator.includes(normalizedQuery) &&
				!normalizedStatus.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasCreatorFilter && project.createdBy !== createdByFilter) {
			return false;
		}

		if (hasEntityFilter && project.entityId !== entityIdFilter) {
			return false;
		}

		if (hasStatusFilter && project.status !== statusFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				project.auditInfo[dateField],
			);

			if (startTimestamp !== null && auditTimestamp < startTimestamp) {
				return false;
			}

			if (endTimestamp !== null && auditTimestamp > endTimestamp) {
				return false;
			}
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
		fallbackTitle: t("project.projectPage.feedback.schoolsError.title"),
		fallbackDescription: t(
			"project.projectPage.feedback.schoolsError.description",
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
		entityId: project.entityId,
		maxParticipants:
			project.maxParticipants === null ? "" : String(project.maxParticipants),
		name: project.name,
		offeredHours: String(project.offeredHours),
	};
}

export function buildProjectDuplicateFormValues(
	project: ProjectResponse,
): ProjectEditorFormValues {
	return buildProjectUpdateFormValues(project);
}

export function toProjectCreateRequest(
	values: ProjectEditorFormValues,
): ProjectCreateRequest {
	const description = values.description.trim();

	return {
		description: description.length > 0 ? description : null,
		entityId: values.entityId,
		maxParticipants: parsePositiveInteger(values.maxParticipants),
		name: values.name.trim(),
		offeredHours: Number(values.offeredHours),
	};
}

export function toProjectUpdateRequest(
	values: ProjectEditorFormValues,
): ProjectUpdateRequest {
	const description = values.description.trim();

	return {
		description: description.length > 0 ? description : null,
		maxParticipants: parsePositiveInteger(values.maxParticipants),
		name: values.name.trim(),
		offeredHours: Number(values.offeredHours),
	};
}

export function getProjectFilterSummary(
	t: TFunction,
	{
		adminById,
		createdByFilter,
		dateField,
		endDate,
		entityById,
		entityIdFilter,
		query,
		startDate,
		statusFilter,
	}: ProjectFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (entityIdFilter) {
		parts.push(resolveProjectEntityLabel(entityById, entityIdFilter));
	}

	if (createdByFilter) {
		parts.push(resolveProjectCreatorLabel(adminById, createdByFilter));
	}

	if (statusFilter) {
		parts.push(getProjectStatusLabel(t, statusFilter));
	}

	if (dateField) {
		parts.push(t(`project.projectPage.filters.dateField.options.${dateField}`));
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
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

export function formatProjectAreaOfExpertiseNames(
	areasOfExpertise: AreaOfExpertiseResponse[] | undefined,
) {
	if (!areasOfExpertise || areasOfExpertise.length === 0) {
		return null;
	}

	return areasOfExpertise
		.map(areaOfExpertise => areaOfExpertise.name)
		.sort(compareNormalizedText)
		.join(", ");
}
