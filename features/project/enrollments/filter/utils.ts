import type { TFunction } from "i18next";

import {
	matchesAnyDateRange,
	toSearchDateOffsetDateTime,
} from "@/features/utils";
import type {
	EnrollmentComplexSearchRequest,
	EnrollmentResponse,
	EnrollmentStatus,
	FormerStudentResponse,
} from "@/types/api";
import type {
	EnrollmentDirectoryItem,
	EnrollmentFilterArgs,
} from "@/types/client";
import { normalizeTextForSearch } from "@/utils";

export function buildEnrollmentComplexSearchRequest(filters: {
	projectIds: string[];
	formerStudentIds: string[];
	statuses: EnrollmentStatus[];
	dateFrom: string;
	dateTo: string;
	periodFrom: string;
	periodTo: string;
}): EnrollmentComplexSearchRequest {
	return {
		projectIds: filters.projectIds.length > 0 ? filters.projectIds : undefined,
		formerStudentIds:
			filters.formerStudentIds.length > 0
				? filters.formerStudentIds
				: undefined,
		statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
		dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start"),
		dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end"),
		periodFrom: filters.periodFrom || undefined,
		periodTo: filters.periodTo || undefined,
	};
}

export function filterEnrollmentsByBackendFilters(
	items: EnrollmentDirectoryItem[],
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: EnrollmentStatus[];
		dateFrom: string;
		dateTo: string;
	},
) {
	const hasProjects = filters.projectIds.length > 0;
	const hasStudents = filters.formerStudentIds.length > 0;
	const hasStatuses = filters.statuses.length > 0;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);

	return items.filter(item => {
		if (hasProjects && !filters.projectIds.includes(item.project.id)) {
			return false;
		}

		if (
			hasStudents &&
			!filters.formerStudentIds.includes(item.student.account.id)
		) {
			return false;
		}

		if (hasStatuses && !filters.statuses.includes(item.status.status)) {
			return false;
		}

		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					item.enrollmentInfo.auditInfo.createdAt,
					item.enrollmentInfo.auditInfo.updatedAt,
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

export function filterEnrollmentListByBackendFilters(
	enrollments: EnrollmentResponse[],
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: EnrollmentStatus[];
		dateFrom: string;
		dateTo: string;
		periodFrom: string;
		periodTo: string;
	},
	formerStudentById: Map<string, FormerStudentResponse>,
) {
	const hasProjects = filters.projectIds.length > 0;
	const hasStudents = filters.formerStudentIds.length > 0;
	const hasStatuses = filters.statuses.length > 0;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);
	const hasPeriodRange = Boolean(filters.periodFrom || filters.periodTo);

	return enrollments.filter(enrollment => {
		if (hasProjects && !filters.projectIds.includes(enrollment.projectId)) {
			return false;
		}

		if (
			hasStudents &&
			!filters.formerStudentIds.includes(enrollment.formerStudentId)
		) {
			return false;
		}

		if (hasStatuses && !filters.statuses.includes(enrollment.status.status)) {
			return false;
		}

		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					enrollment.enrollmentInfo.auditInfo.createdAt,
					enrollment.enrollmentInfo.auditInfo.updatedAt,
				],
				{
					...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
					...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
				},
			)
		) {
			return false;
		}

		if (hasPeriodRange) {
			const formerStudent = formerStudentById.get(enrollment.formerStudentId);
			if (
				!formerStudent ||
				!matchesAnyDateRange(
					[formerStudent.period.startDate, formerStudent.period.dueDate],
					{
						...(filters.periodFrom ? { dateFrom: filters.periodFrom } : {}),
						...(filters.periodTo ? { dateTo: filters.periodTo } : {}),
					},
				)
			) {
				return false;
			}
		}

		return true;
	});
}

export function filterEnrollmentsByFrontendFilters(
	items: EnrollmentDirectoryItem[],
	{ query, statuses }: EnrollmentFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasStatuses = statuses.length > 0;

	if (!normalizedQuery && !hasStatuses) {
		return items;
	}

	return items.filter(item => {
		if (hasStatuses && !statuses.includes(item.status.status)) {
			return false;
		}

		const fields = [
			item.project.name,
			item.student.account.name,
			item.student.account.email,
			item.student.academicRegistration,
			item.student.campus.campusFormatted,
			item.status.statusFormatted,
		].map(value => normalizeTextForSearch(value));

		if (!normalizedQuery) {
			return true;
		}

		return fields.some(value => value.includes(normalizedQuery));
	});
}

export function getEnrollmentEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("project.enrollmentPage.empty.title"),
		description: query
			? t("project.enrollmentPage.empty.filteredDescription", {
					value: query,
				})
			: t("project.enrollmentPage.empty.defaultDescription"),
	};
}

export function getEnrollmentFilterSummary(
	t: TFunction,
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: EnrollmentStatus[];
		dateFrom: string;
		dateTo: string;
		periodFrom: string;
		periodTo: string;
	},
	query: string,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}
	if (filters.projectIds.length > 0) {
		parts.push(t("project.enrollmentPage.filters.summary.projects"));
	}
	if (filters.formerStudentIds.length > 0) {
		parts.push(t("project.enrollmentPage.filters.summary.formerStudents"));
	}
	if (filters.statuses.length > 0) {
		parts.push(t("project.enrollmentPage.filters.summary.statuses"));
	}
	if (filters.dateFrom || filters.dateTo) {
		parts.push(t("project.enrollmentPage.filters.summary.auditDate"));
	}
	if (filters.periodFrom || filters.periodTo) {
		parts.push(t("project.enrollmentPage.filters.summary.period"));
	}

	return parts.join(" | ");
}
