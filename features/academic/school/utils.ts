import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import type {
	SchoolCreateRequest,
	SchoolResponse,
	SchoolUpdateRequest,
} from "@/types";
import type { SchoolEditorFormValues, SchoolFilterArgs } from "@/types";
import { getApiErrorToastContent } from "@/utils";
import { normalizeTextForSearch } from "@/utils";

export { createSchoolEditorFormSchema } from "@/schemas";

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

export function createSchoolColumns(t: TFunction): ColumnDef<SchoolResponse>[] {
	return [
		{
			accessorKey: "name",
			header: t("academic.schoolPage.table.columns.name"),
		},
		{
			accessorFn: row => row.auditInfo.createdAt,
			id: "createdAt",
			header: t("academic.schoolPage.table.columns.createdAt"),
			cell: ({ row }) => row.original.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("academic.schoolPage.table.columns.updatedAt"),
			cell: ({ row }) => row.original.auditInfo.updatedAtFormatted,
		},
	];
}

export function filterSchools(
	schools: SchoolResponse[],
	{ dateField, endDate, query, startDate }: SchoolFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const startTimestamp = startDate ? getStartOfDayTimestamp(startDate) : null;
	const endTimestamp = endDate ? getStartOfDayTimestamp(endDate) : null;

	if (
		!hasQuery &&
		!dateField &&
		startTimestamp === null &&
		endTimestamp === null
	) {
		return schools;
	}

	return schools.filter(school => {
		if (hasQuery) {
			const normalizedName = normalizeTextForSearch(school.name);
			if (!normalizedName.includes(normalizedQuery)) {
				return false;
			}
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				school.auditInfo[dateField],
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

export function getSchoolEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("academic.schoolPage.empty.title"),
		description: query
			? t("academic.schoolPage.empty.filteredDescription", { value: query })
			: t("academic.schoolPage.empty.defaultDescription"),
	};
}

export function getSchoolsListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.schoolPage.feedback.listError.title"),
		fallbackDescription: t(
			"academic.schoolPage.feedback.listError.description",
		),
	});
}

export function getSchoolDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.schoolPage.feedback.detailError.title"),
		fallbackDescription: t(
			"academic.schoolPage.feedback.detailError.description",
		),
	});
}

export function getSchoolCreateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.schoolPage.create.feedback.error.title"),
		fallbackDescription: t(
			"academic.schoolPage.create.feedback.error.description",
		),
	});
}

export function getSchoolDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.schoolPage.duplicate.feedback.error.title"),
		fallbackDescription: t(
			"academic.schoolPage.duplicate.feedback.error.description",
		),
	});
}

export function getSchoolUpdateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.schoolPage.update.feedback.error.title"),
		fallbackDescription: t(
			"academic.schoolPage.update.feedback.error.description",
		),
	});
}

export function getSchoolDeleteErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.schoolPage.delete.feedback.error.title"),
		fallbackDescription: t(
			"academic.schoolPage.delete.feedback.error.description",
		),
	});
}

export function getEmptySchoolEditorFormValues(): SchoolEditorFormValues {
	return {
		name: "",
	};
}

export function buildSchoolUpdateFormValues(
	school: SchoolResponse,
): SchoolEditorFormValues {
	return {
		name: school.name,
	};
}

export function buildSchoolDuplicateFormValues(
	school: SchoolResponse,
): SchoolEditorFormValues {
	return {
		name: school.name,
	};
}

export function toSchoolCreateRequest(
	values: SchoolEditorFormValues,
): SchoolCreateRequest {
	return {
		name: values.name.trim(),
	};
}

export function toSchoolUpdateRequest(
	values: SchoolEditorFormValues,
): SchoolUpdateRequest {
	return {
		name: values.name.trim(),
	};
}

export function getSchoolFilterSummary(
	t: TFunction,
	{ dateField, endDate, query, startDate }: SchoolFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (dateField) {
		parts.push(t(`academic.schoolPage.filters.dateField.options.${dateField}`));
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
	}

	return parts.join(" | ");
}
