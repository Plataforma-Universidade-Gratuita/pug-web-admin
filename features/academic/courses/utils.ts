import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { TableText } from "@/components";
import { TABLE_TRUNCATED_COLUMN_WIDTH } from "@/constants";
import type {
	AreaOfExpertiseResponse,
	CourseCreateRequest,
	CourseResponse,
	CourseUpdateRequest,
} from "@/types";
import type {
	ComboboxOption,
	CourseEditorFormValues,
	CourseFilterArgs,
} from "@/types";
import {
	compareNormalizedText,
	getApiErrorToastContent,
	matchesAnyDateRange,
	normalizeTextForSearch,
	toSearchDateOffsetDateTime,
} from "@/utils";

export { createCourseEditorFormSchema } from "@/schemas";

export function createCourseColumns(t: TFunction): ColumnDef<CourseResponse>[] {
	return [
		{
			accessorKey: "id",
			header: t("common.fields.id"),
			size: TABLE_TRUNCATED_COLUMN_WIDTH,
			cell: ({ row }) =>
				TableText({
					text: row.original.id,
					maxWidth: TABLE_TRUNCATED_COLUMN_WIDTH,
					tooltiped: true,
				}),
		},
		{
			accessorKey: "name",
			header: t("academic.coursePage.table.columns.name"),
		},
		{
			accessorFn: row => row.areaOfExpertise.name,
			id: "areaOfExpertise",
			header: t("academic.coursePage.table.columns.school"),
		},
		{
			accessorFn: row => row.auditInfo.createdAt,
			id: "createdAt",
			header: t("common.fields.createdAt"),
			cell: ({ row }) => row.original.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("common.fields.updatedAt"),
			cell: ({ row }) => row.original.auditInfo.updatedAtFormatted,
		},
	];
}

export function buildCourseAreaOfExpertiseOptions(
	areasOfExpertise: AreaOfExpertiseResponse[],
): ComboboxOption[] {
	return [...areasOfExpertise]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(areaOfExpertise => ({
			value: areaOfExpertise.id,
			label: areaOfExpertise.name,
		}));
}

export function filterCourses(
	courses: CourseResponse[],
	{ areaOfExpertiseIds, endDate, query, startDate }: CourseFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasAreaOfExpertiseFilter = areaOfExpertiseIds.length > 0;
	const hasDateRange = Boolean(startDate || endDate);

	if (!hasQuery && !hasAreaOfExpertiseFilter && !hasDateRange) {
		return courses;
	}

	return courses.filter(course => {
		if (hasQuery) {
			const normalizedName = normalizeTextForSearch(course.name);
			const normalizedAreaOfExpertise = normalizeTextForSearch(
				course.areaOfExpertise.name,
			);

			if (
				!normalizedName.includes(normalizedQuery) &&
				!normalizedAreaOfExpertise.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (
			hasAreaOfExpertiseFilter &&
			!areaOfExpertiseIds.includes(course.areaOfExpertise.id)
		) {
			return false;
		}

		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[course.auditInfo.createdAt, course.auditInfo.updatedAt],
				{
					...(startDate
						? (() => {
								const dateFrom = toSearchDateOffsetDateTime(startDate, "start");
								return dateFrom ? { dateFrom } : {};
							})()
						: {}),
					...(endDate
						? (() => {
								const dateTo = toSearchDateOffsetDateTime(endDate, "end");
								return dateTo ? { dateTo } : {};
							})()
						: {}),
				},
			)
		) {
			return false;
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
		areaOfExpertiseId: "",
	};
}

export function buildCourseUpdateFormValues(
	course: CourseResponse,
): CourseEditorFormValues {
	return {
		name: course.name,
		areaOfExpertiseId: course.areaOfExpertise.id,
	};
}

export function buildCourseDuplicateFormValues(
	course: CourseResponse,
): CourseEditorFormValues {
	return {
		name: appendCopyToCourseName(course.name),
		areaOfExpertiseId: course.areaOfExpertise.id,
	};
}

export function toCourseCreateRequest(
	values: CourseEditorFormValues,
): CourseCreateRequest {
	return {
		name: values.name.trim(),
		areaOfExpertiseId: values.areaOfExpertiseId,
	};
}

export function toCourseUpdateRequest(
	values: CourseEditorFormValues,
): CourseUpdateRequest {
	return {
		name: values.name.trim(),
		areaOfExpertiseId: values.areaOfExpertiseId,
	};
}

export function getCourseFilterSummary(
	t: TFunction,
	{ areaOfExpertiseIds, endDate, query, startDate }: CourseFilterArgs,
	areaOfExpertiseById: Map<string, AreaOfExpertiseResponse>,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (areaOfExpertiseIds.length > 0) {
		parts.push(
			areaOfExpertiseIds
				.map(
					areaOfExpertiseId =>
						areaOfExpertiseById.get(areaOfExpertiseId)?.name ??
						areaOfExpertiseId,
				)
				.join(", "),
		);
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
	}

	return parts.join(" | ");
}

export function appendCopyToCourseName(name: string) {
	return `${name.trim()} Copy`;
}
