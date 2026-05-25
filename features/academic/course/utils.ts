import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import type {
	CourseCreateRequest,
	CourseResponse,
	CourseUpdateRequest,
	SchoolResponse,
} from "@/types";
import type { ComboboxOption } from "@/types";
import type { CourseEditorFormValues, CourseFilterArgs } from "@/types";
import { getApiErrorToastContent } from "@/utils";
import { compareNormalizedText, normalizeTextForSearch } from "@/utils";

export { createCourseEditorFormSchema } from "@/schemas";

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

export function createCourseColumns(t: TFunction): ColumnDef<CourseResponse>[] {
	return [
		{
			accessorKey: "name",
			header: t("academic.coursePage.table.columns.name"),
		},
		{
			accessorFn: row => row.school.name,
			id: "school",
			header: t("academic.coursePage.table.columns.school"),
		},
		{
			accessorFn: row => row.auditInfo.createdAt,
			id: "createdAt",
			header: t("academic.coursePage.table.columns.createdAt"),
			cell: ({ row }) => row.original.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("academic.coursePage.table.columns.updatedAt"),
			cell: ({ row }) => row.original.auditInfo.updatedAtFormatted,
		},
	];
}

export function buildCourseSchoolOptions(
	schools: SchoolResponse[],
): ComboboxOption[] {
	return [...schools]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(school => ({
			value: school.id,
			label: school.name,
		}));
}

export function filterCourses(
	courses: CourseResponse[],
	{ dateField, endDate, query, schoolIdFilter, startDate }: CourseFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasSchoolFilter = schoolIdFilter.length > 0;
	const startTimestamp = startDate ? getStartOfDayTimestamp(startDate) : null;
	const endTimestamp = endDate ? getStartOfDayTimestamp(endDate) : null;

	if (
		!hasQuery &&
		!hasSchoolFilter &&
		!dateField &&
		startTimestamp === null &&
		endTimestamp === null
	) {
		return courses;
	}

	return courses.filter(course => {
		if (hasQuery) {
			const normalizedName = normalizeTextForSearch(course.name);
			const normalizedSchool = normalizeTextForSearch(course.school.name);

			if (
				!normalizedName.includes(normalizedQuery) &&
				!normalizedSchool.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasSchoolFilter && course.school.id !== schoolIdFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				course.auditInfo[dateField],
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

export function getCourseEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("academic.coursePage.empty.title"),
		description: query
			? t("academic.coursePage.empty.filteredDescription", { value: query })
			: t("academic.coursePage.empty.defaultDescription"),
	};
}

export function getCoursesListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.coursePage.feedback.listError.title"),
		fallbackDescription: t(
			"academic.coursePage.feedback.listError.description",
		),
	});
}

export function getCourseDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.coursePage.feedback.detailError.title"),
		fallbackDescription: t(
			"academic.coursePage.feedback.detailError.description",
		),
	});
}

export function getCourseSchoolsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.coursePage.feedback.schoolsError.title"),
		fallbackDescription: t(
			"academic.coursePage.feedback.schoolsError.description",
		),
	});
}

export function getCourseCreateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.coursePage.create.feedback.error.title"),
		fallbackDescription: t(
			"academic.coursePage.create.feedback.error.description",
		),
	});
}

export function getCourseDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.coursePage.duplicate.feedback.error.title"),
		fallbackDescription: t(
			"academic.coursePage.duplicate.feedback.error.description",
		),
	});
}

export function getCourseUpdateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.coursePage.update.feedback.error.title"),
		fallbackDescription: t(
			"academic.coursePage.update.feedback.error.description",
		),
	});
}

export function getCourseDeleteErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.coursePage.delete.feedback.error.title"),
		fallbackDescription: t(
			"academic.coursePage.delete.feedback.error.description",
		),
	});
}

export function getEmptyCourseEditorFormValues(): CourseEditorFormValues {
	return {
		name: "",
		schoolId: "",
	};
}

export function buildCourseUpdateFormValues(
	course: CourseResponse,
): CourseEditorFormValues {
	return {
		name: course.name,
		schoolId: course.school.id,
	};
}

export function buildCourseDuplicateFormValues(
	course: CourseResponse,
): CourseEditorFormValues {
	return {
		name: course.name,
		schoolId: course.school.id,
	};
}

export function toCourseCreateRequest(
	values: CourseEditorFormValues,
): CourseCreateRequest {
	return {
		name: values.name.trim(),
		schoolId: values.schoolId,
	};
}

export function toCourseUpdateRequest(
	values: CourseEditorFormValues,
): CourseUpdateRequest {
	return {
		name: values.name.trim(),
		schoolId: values.schoolId,
	};
}

export function getCourseFilterSummary(
	t: TFunction,
	{ dateField, endDate, query, schoolIdFilter, startDate }: CourseFilterArgs,
	schoolById: Map<string, SchoolResponse>,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (schoolIdFilter) {
		parts.push(schoolById.get(schoolIdFilter)?.name ?? schoolIdFilter);
	}

	if (dateField) {
		parts.push(t(`academic.coursePage.filters.dateField.options.${dateField}`));
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
	}

	return parts.join(" | ");
}
