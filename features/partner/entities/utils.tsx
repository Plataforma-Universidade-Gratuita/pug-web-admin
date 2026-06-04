import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { TableText } from "@/components";
import type {
	CityResponse,
	EntityComplexSearchFilters,
	EntityComplexSearchRequest,
	EntityComplexSearchResponse,
	EntityResponse,
	EntityCreateRequest,
	EntityTableRow,
	EntityUpdateRequest,
} from "@/types";
import type {
	ComboboxOption,
	EntityEditorFormValues,
	EntityFilterArgs,
} from "@/types";
import { getApiErrorToastContent } from "@/utils";
import {
	compareNormalizedText,
	matchesAnyDateRange,
	normalizeDigits,
	normalizeTextForSearch,
	toSearchDateOffsetDateTime,
} from "@/utils";

export { createEntityEditorFormSchema } from "@/schemas";

const TABLE_IDENTIFIER_TEXT_WIDTH = 50;
const TABLE_ADDRESS_TEXT_WIDTH = 150;

function normalizeCnpj(value: string) {
	return normalizeDigits(value).slice(0, 14);
}

export function createEntityColumns(t: TFunction): ColumnDef<EntityTableRow>[] {
	return [
		{
			accessorKey: "id",
			header: t("common.fields.id"),
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			cell: ({ row }) => (
				<TableText
					text={row.original.id}
					maxWidth={TABLE_IDENTIFIER_TEXT_WIDTH}
					tooltiped
				/>
			),
		},
		{
			accessorKey: "name",
			header: t("partner.entityPage.table.columns.name"),
		},
		{
			accessorFn: row => row.cnpj,
			id: "cnpj",
			header: t("partner.entityPage.table.columns.cnpj"),
			cell: ({ row }) => row.original.cnpjFormatted,
		},
		{
			accessorKey: "cityLabel",
			id: "city",
			header: t("partner.entityPage.table.columns.city"),
		},
		{
			accessorKey: "address",
			header: t("partner.entityPage.table.columns.address"),
			cell: ({ row }) => (
				<TableText
					text={row.original.address}
					maxWidth={TABLE_ADDRESS_TEXT_WIDTH}
					tooltiped
				/>
			),
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

export function buildEntityCityOptions(
	cities: CityResponse[],
): ComboboxOption[] {
	return [...cities]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(city => ({
			value: city.id,
			label: city.name,
			description: city.ibgeCode,
			keywords: [city.ibgeCode],
		}));
}

export function mapEntitiesToTableRows(
	entities: EntityResponse[],
	cityById: Map<string, CityResponse>,
): EntityTableRow[] {
	return entities.map(entity => ({
		id: entity.id,
		cnpj: entity.cnpj,
		cnpjFormatted: entity.cnpjFormatted,
		name: entity.name,
		address: entity.address,
		cityId: entity.cityId,
		cityLabel: cityById.get(entity.cityId)?.name ?? entity.cityId,
		auditInfo: entity.auditInfo,
	}));
}

export function mapEntitySearchResponsesToTableRows(
	entities: EntityComplexSearchResponse["content"],
): EntityTableRow[] {
	return entities.map(entity => ({
		id: entity.id,
		cnpj: entity.cnpj,
		cnpjFormatted: entity.cnpjFormatted,
		name: entity.name,
		address: entity.address,
		cityId: entity.city.id,
		cityLabel: entity.city.name,
		auditInfo: entity.auditInfo,
	}));
}

export function resolveEntityCityLabel(
	cityById: Map<string, CityResponse>,
	cityId: string,
) {
	return cityById.get(cityId)?.name ?? cityId;
}

export function filterEntitiesByFrontendQuery(
	entities: EntityTableRow[],
	{ cnpjQuery, query }: Pick<EntityFilterArgs, "cnpjQuery" | "query">,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const normalizedDigitsQuery = normalizeDigits(cnpjQuery);
	const hasQuery = normalizedQuery.length > 0;
	const hasCnpjQuery = normalizedDigitsQuery.length > 0;

	if (!hasQuery && !hasCnpjQuery) {
		return entities;
	}

	return entities.filter(entity => {
		const normalizedName = normalizeTextForSearch(entity.name);
		const normalizedAddress = normalizeTextForSearch(entity.address);
		const normalizedCity = normalizeTextForSearch(entity.cityLabel);
		const normalizedCnpj = normalizeCnpj(entity.cnpj);

		const matchesText =
			normalizedName.includes(normalizedQuery) ||
			normalizedAddress.includes(normalizedQuery) ||
			normalizedCity.includes(normalizedQuery);
		const matchesCnpj =
			hasCnpjQuery && normalizedCnpj.includes(normalizedDigitsQuery);

		return (hasQuery && matchesText) || matchesCnpj;
	});
}

export function filterEntitiesByBackendFilters(
	entities: EntityTableRow[],
	filters: EntityComplexSearchFilters,
) {
	const { cityIdsFilter, dateFrom, dateTo } = filters;

	if (cityIdsFilter.length === 0 && !dateFrom && !dateTo) {
		return entities;
	}

	return entities.filter(entity => {
		if (cityIdsFilter.length > 0 && !cityIdsFilter.includes(entity.cityId)) {
			return false;
		}

		if (!dateFrom && !dateTo) {
			return true;
		}

		const range: {
			dateFrom?: string;
			dateTo?: string;
		} = {};
		const normalizedDateFrom = dateFrom
			? toSearchDateOffsetDateTime(dateFrom, "start")
			: undefined;
		const normalizedDateTo = dateTo
			? toSearchDateOffsetDateTime(dateTo, "end")
			: undefined;

		if (normalizedDateFrom) {
			range.dateFrom = normalizedDateFrom;
		}

		if (normalizedDateTo) {
			range.dateTo = normalizedDateTo;
		}

		return matchesAnyDateRange(
			[entity.auditInfo.createdAt, entity.auditInfo.updatedAt],
			range,
		);
	});
}

export function getEntityEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("partner.entityPage.empty.title"),
		description: query
			? t("partner.entityPage.empty.filteredDescription", { value: query })
			: t("partner.entityPage.empty.defaultDescription"),
	};
}

export function getEntitiesListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.entities.title"),
		fallbackDescription: t("common.loadErrors.entities.description"),
	});
}

export function getEntityDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.feedback.detailError.title"),
		fallbackDescription: t(
			"partner.entityPage.feedback.detailError.description",
		),
	});
}

export function getEntityCitiesErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.feedback.citiesError.title"),
		fallbackDescription: t(
			"partner.entityPage.feedback.citiesError.description",
		),
	});
}

export function getEntityCreateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.create.feedback.error.title"),
		fallbackDescription: t(
			"partner.entityPage.create.feedback.error.description",
		),
	});
}

export function getEntityDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.duplicate.feedback.error.title"),
		fallbackDescription: t(
			"partner.entityPage.duplicate.feedback.error.description",
		),
	});
}

export function getEntityUpdateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.update.feedback.error.title"),
		fallbackDescription: t(
			"partner.entityPage.update.feedback.error.description",
		),
	});
}

export function getEntityDeleteErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.delete.feedback.error.title"),
		fallbackDescription: t(
			"partner.entityPage.delete.feedback.error.description",
		),
	});
}

export function getEmptyEntityEditorFormValues(): EntityEditorFormValues {
	return {
		cnpj: "",
		name: "",
		cityId: "",
		address: "",
	};
}

export function buildEntityUpdateFormValues(
	entity: EntityResponse,
): EntityEditorFormValues {
	return {
		cnpj: entity.cnpj,
		name: entity.name,
		cityId: entity.cityId,
		address: entity.address,
	};
}

export function buildEntityDuplicateFormValues(
	entity: EntityResponse,
): EntityEditorFormValues {
	return {
		cnpj: "",
		name: entity.name,
		cityId: entity.cityId,
		address: entity.address,
	};
}

export function toEntityCreateRequest(
	values: EntityEditorFormValues,
): EntityCreateRequest {
	return {
		cnpjString: normalizeCnpj(values.cnpj),
		name: values.name.trim(),
		cityId: values.cityId,
		address: values.address.trim(),
	};
}

export function toEntityUpdateRequest(
	values: EntityEditorFormValues,
): EntityUpdateRequest {
	return {
		name: values.name.trim(),
		cityId: values.cityId,
		address: values.address.trim(),
	};
}

export function buildEntityComplexSearchRequest(
	filters: EntityComplexSearchFilters,
): EntityComplexSearchRequest {
	return {
		...(filters.cityIdsFilter.length > 0
			? { cityIds: filters.cityIdsFilter }
			: {}),
		...(filters.dateFrom
			? { dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start") }
			: {}),
		...(filters.dateTo
			? { dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end") }
			: {}),
	};
}

export function getEntityFilterSummary(
	t: TFunction,
	{ cnpjQuery, query, dateFrom, dateTo }: EntityFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (cnpjQuery.trim()) {
		parts.push(cnpjQuery.trim());
	}

	if (dateFrom || dateTo) {
		parts.push([dateFrom || "...", dateTo || "..."].join(" - "));
	}

	return parts.join(" | ");
}
