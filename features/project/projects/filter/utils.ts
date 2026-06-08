import type { TFunction } from "i18next";

import {
	matchesAnyDateRange,
	toSearchDateOffsetDateTime,
} from "@/features/utils";
import type { ProjectComplexSearchRequest, ProjectResponse } from "@/types/api";
import type {
	ProjectComplexSearchFilters,
	ProjectFilterArgs,
} from "@/types/client";
import { normalizeTextForSearch } from "@/utils";

import {
	getProjectStatusLabel,
	resolveProjectEntityLabel,
} from "../table/utils";

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
		title: t("common.empty.title"),
		description: query
			? t("common.empty.filteredDescription", { value: query })
			: t("common.empty.defaultDescription"),
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
