import type { TFunction } from "i18next";

import type {
	AttendanceComplexSearchRequest,
	AttendanceDirectoryItem,
	AttendanceFilterArgs,
	AttendanceResponse,
	AttendanceStatus,
} from "@/types";
import {
	matchesAnyDateRange,
	normalizeTextForSearch,
	toSearchDateOffsetDateTime,
} from "@/utils";

export function buildAttendanceComplexSearchRequest(filters: {
	projectIds: string[];
	formerStudentIds: string[];
	statuses: AttendanceStatus[];
	validatedByIds: string[];
	durationFrom: string;
	durationTo: string;
	dateFrom: string;
	dateTo: string;
}): AttendanceComplexSearchRequest {
	return {
		projectIds: filters.projectIds.length > 0 ? filters.projectIds : undefined,
		formerStudentIds:
			filters.formerStudentIds.length > 0
				? filters.formerStudentIds
				: undefined,
		statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
		validatedByIds:
			filters.validatedByIds.length > 0 ? filters.validatedByIds : undefined,
		durationFrom: filters.durationFrom.trim()
			? Number(filters.durationFrom)
			: undefined,
		durationTo: filters.durationTo.trim()
			? Number(filters.durationTo)
			: undefined,
		dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start"),
		dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end"),
	};
}

export function filterAttendancesByBackendFilters(
	items: AttendanceDirectoryItem[],
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: AttendanceStatus[];
		validatedByIds: string[];
		durationFrom: string;
		durationTo: string;
		dateFrom: string;
		dateTo: string;
	},
) {
	const hasProjects = filters.projectIds.length > 0;
	const hasStudents = filters.formerStudentIds.length > 0;
	const hasStatuses = filters.statuses.length > 0;
	const hasValidators = filters.validatedByIds.length > 0;
	const hasDurationFrom = filters.durationFrom.trim().length > 0;
	const hasDurationTo = filters.durationTo.trim().length > 0;
	const durationFrom = hasDurationFrom ? Number(filters.durationFrom) : null;
	const durationTo = hasDurationTo ? Number(filters.durationTo) : null;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);

	return items.filter(item => {
		if (hasProjects && !filters.projectIds.includes(item.project.id))
			return false;
		if (
			hasStudents &&
			!filters.formerStudentIds.includes(item.student.account.id)
		)
			return false;
		if (hasStatuses && !filters.statuses.includes(item.status.status))
			return false;
		if (
			hasValidators &&
			!filters.validatedByIds.includes(item.validator?.id ?? "")
		) {
			return false;
		}
		if (durationFrom !== null && item.qrValidationInfo.duration < durationFrom)
			return false;
		if (durationTo !== null && item.qrValidationInfo.duration > durationTo)
			return false;
		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					item.attendanceInfo.auditInfo.createdAt,
					item.attendanceInfo.auditInfo.updatedAt,
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

export function filterAttendanceListByBackendFilters(
	attendances: AttendanceResponse[],
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: AttendanceStatus[];
		validatedByIds: string[];
		durationFrom: string;
		durationTo: string;
		dateFrom: string;
		dateTo: string;
	},
) {
	const hasProjects = filters.projectIds.length > 0;
	const hasStudents = filters.formerStudentIds.length > 0;
	const hasStatuses = filters.statuses.length > 0;
	const hasValidators = filters.validatedByIds.length > 0;
	const hasDurationFrom = filters.durationFrom.trim().length > 0;
	const hasDurationTo = filters.durationTo.trim().length > 0;
	const durationFrom = hasDurationFrom ? Number(filters.durationFrom) : null;
	const durationTo = hasDurationTo ? Number(filters.durationTo) : null;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);

	return attendances.filter(attendance => {
		if (hasProjects && !filters.projectIds.includes(attendance.projectId))
			return false;
		if (
			hasStudents &&
			!filters.formerStudentIds.includes(attendance.formerStudentId)
		)
			return false;
		if (hasStatuses && !filters.statuses.includes(attendance.status.status))
			return false;
		if (
			hasValidators &&
			!filters.validatedByIds.includes(
				attendance.attendanceInfo.validatedBy ?? "",
			)
		) {
			return false;
		}
		if (
			durationFrom !== null &&
			attendance.qrValidationInfo.duration < durationFrom
		)
			return false;
		if (
			durationTo !== null &&
			attendance.qrValidationInfo.duration > durationTo
		)
			return false;
		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					attendance.attendanceInfo.auditInfo.createdAt,
					attendance.attendanceInfo.auditInfo.updatedAt,
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

export function filterAttendancesByFrontendFilters(
	items: AttendanceDirectoryItem[],
	{ query, statuses }: AttendanceFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasStatuses = statuses.length > 0;
	if (!normalizedQuery && !hasStatuses) return items;

	return items.filter(item => {
		if (hasStatuses && !statuses.includes(item.status.status)) {
			return false;
		}

		const fields = [
			item.project.name,
			item.student.account.name,
			item.student.account.email,
			item.student.academicRegistration,
			item.validator?.name ?? "",
		].map(value => normalizeTextForSearch(String(value)));

		if (!normalizedQuery) {
			return true;
		}

		return fields.some(value => value.includes(normalizedQuery));
	});
}

export function getAttendanceEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("project.attendancePage.empty.title"),
		description: query
			? t("project.attendancePage.empty.filteredDescription", { value: query })
			: t("project.attendancePage.empty.defaultDescription"),
	};
}

export function getAttendanceFilterSummary(
	t: TFunction,
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: AttendanceStatus[];
		validatedByIds: string[];
		durationFrom: string;
		durationTo: string;
		dateFrom: string;
		dateTo: string;
	},
	query: string,
) {
	const parts: string[] = [];
	if (query.trim()) parts.push(query.trim());
	if (filters.projectIds.length > 0)
		parts.push(t("project.attendancePage.filters.summary.projects"));
	if (filters.formerStudentIds.length > 0)
		parts.push(t("project.attendancePage.filters.summary.formerStudents"));
	if (filters.statuses.length > 0)
		parts.push(t("project.attendancePage.filters.summary.statuses"));
	if (filters.validatedByIds.length > 0)
		parts.push(t("project.attendancePage.filters.summary.validators"));
	if (filters.durationFrom || filters.durationTo)
		parts.push(t("project.attendancePage.filters.summary.duration"));
	if (filters.dateFrom || filters.dateTo)
		parts.push(t("project.attendancePage.filters.summary.auditDate"));
	return parts.join(" | ");
}
