import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { TableText } from "@/components/primitives";
import { TABLE_TRUNCATED_COLUMN_WIDTH } from "@/features/constants";
import {
	matchesAnyDateRange,
	toSearchDateOffsetDateTime,
} from "@/features/utils";
import type {
	AreaOfExpertiseCreateRequest,
	AreaOfExpertiseResponse,
	AreaOfExpertiseUpdateRequest,
} from "@/types/api";
import type {
	AreaOfExpertiseEditorFormValues,
	AreaOfExpertiseFilterArgs,
} from "@/types/client";
import { getApiErrorToastContent, normalizeTextForSearch } from "@/utils";

export { createAreaOfExpertiseEditorFormSchema } from "@/schemas/client";

export function createAreaOfExpertiseColumns(
	t: TFunction,
): ColumnDef<AreaOfExpertiseResponse>[] {
	return [
		{
			accessorKey: "id",
			header: t("table.columns.id"),
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
			header: t("table.columns.areaOfExpertise"),
		},
		{
			accessorFn: row => row.auditInfo.createdAt,
			id: "createdAt",
			header: t("table.columns.createdAt"),
			cell: ({ row }) => row.original.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("table.columns.updatedAt"),
			cell: ({ row }) => row.original.auditInfo.updatedAtFormatted,
		},
	];
}

export function filterAreasOfExpertise(
	areasOfExpertise: AreaOfExpertiseResponse[],
	{ endDate, query, startDate }: AreaOfExpertiseFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasDateRange = Boolean(startDate || endDate);

	if (!hasQuery && !hasDateRange) {
		return areasOfExpertise;
	}

	return areasOfExpertise.filter(areaOfExpertise => {
		if (hasQuery) {
			const normalizedName = normalizeTextForSearch(areaOfExpertise.name);
			if (!normalizedName.includes(normalizedQuery)) {
				return false;
			}
		}

		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					areaOfExpertise.auditInfo.createdAt,
					areaOfExpertise.auditInfo.updatedAt,
				],
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

export function getAreaOfExpertiseEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("common.empty.title"),
		description: query
			? t("common.empty.filteredDescription", {
					value: query,
				})
			: t("common.empty.defaultDescription"),
	};
}

export function getAreasOfExpertiseListErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.errors.listLoad.title"),
		fallbackDescription: t("common.errors.listLoad.description"),
	});
}

export function getAreaOfExpertiseDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.errors.detailLoad.title"),
		fallbackDescription: t("common.errors.detailLoad.description"),
	});
}

export function getAreaOfExpertiseCreateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			"academic.areaOfExpertisePage.create.feedback.error.title",
		),
		fallbackDescription: t(
			"academic.areaOfExpertisePage.create.feedback.error.description",
		),
	});
}

export function getAreaOfExpertiseDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			"academic.areaOfExpertisePage.duplicate.feedback.error.title",
		),
		fallbackDescription: t(
			"academic.areaOfExpertisePage.duplicate.feedback.error.description",
		),
	});
}

export function getAreaOfExpertiseUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			"academic.areaOfExpertisePage.update.feedback.error.title",
		),
		fallbackDescription: t(
			"academic.areaOfExpertisePage.update.feedback.error.description",
		),
	});
}

export function getAreaOfExpertiseDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			"academic.areaOfExpertisePage.delete.feedback.error.title",
		),
		fallbackDescription: t(
			"academic.areaOfExpertisePage.delete.feedback.error.description",
		),
	});
}

export function getEmptyAreaOfExpertiseEditorFormValues(): AreaOfExpertiseEditorFormValues {
	return {
		name: "",
	};
}

export function buildAreaOfExpertiseUpdateFormValues(
	areaOfExpertise: AreaOfExpertiseResponse,
): AreaOfExpertiseEditorFormValues {
	return {
		name: areaOfExpertise.name,
	};
}

export function buildAreaOfExpertiseDuplicateFormValues(
	areaOfExpertise: AreaOfExpertiseResponse,
): AreaOfExpertiseEditorFormValues {
	return {
		name: appendCopyToAreaOfExpertiseName(areaOfExpertise.name),
	};
}

export function toAreaOfExpertiseCreateRequest(
	values: AreaOfExpertiseEditorFormValues,
): AreaOfExpertiseCreateRequest {
	return {
		name: values.name.trim(),
	};
}

export function toAreaOfExpertiseUpdateRequest(
	values: AreaOfExpertiseEditorFormValues,
): AreaOfExpertiseUpdateRequest {
	return {
		name: values.name.trim(),
	};
}

export function getAreaOfExpertiseFilterSummary({
	endDate,
	query,
	startDate,
}: AreaOfExpertiseFilterArgs) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
	}

	return parts.join(" | ");
}

export function appendCopyToAreaOfExpertiseName(name: string) {
	return `${name.trim()} Copy`;
}
