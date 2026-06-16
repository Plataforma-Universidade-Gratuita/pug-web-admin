import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import {
	createDateTimeColumn,
	createTableTextColumn,
} from "@/components/composite";
import {
	TABLE_ADDRESS_TEXT_WIDTH,
	TABLE_IDENTIFIER_TEXT_WIDTH,
} from "@/features/partner/entities/constants";
import {
	getCrudErrorToastContent,
	matchesAnyDateRange,
	normalizeDigits,
	toSearchDateOffsetDateTime,
} from "@/features/utils";
import type {
	CityResponse,
	EntityComplexSearchRequest,
	EntityComplexSearchResponse,
	EntityResponse,
	EntityCreateRequest,
	EntityUpdateRequest,
} from "@/types/api";
import type {
	EntityComplexSearchFilters,
	EntityTableRow,
} from "@/types/client";
import type {
	ComboboxOption,
	EntityEditorFormValues,
	EntityFilterArgs,
} from "@/types/client";
import {
	compareNormalizedText,
	getApiErrorToastContent,
	normalizeTextForSearch,
} from "@/utils";

export { createEntityEditorFormSchema } from "@/schemas/client";

function normalizeCnpj(value: string) {
	return normalizeDigits(value).slice(0, 14);
}

export function formatCnpjValue(value: string) {
	const digits = normalizeCnpj(value);

	if (digits.length <= 2) {
		return digits;
	}

	if (digits.length <= 5) {
		return `${digits.slice(0, 2)}.${digits.slice(2)}`;
	}

	if (digits.length <= 8) {
		return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
	}

	if (digits.length <= 12) {
		return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
	}

	return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function createEntityColumns(t: TFunction): ColumnDef<EntityTableRow>[] {
	return [
		createTableTextColumn<EntityTableRow>({
			id: "id",
			accessorKey: "id",
			header: t("table.columns.id"),
			text: row => row.id,
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			maxWidth: TABLE_IDENTIFIER_TEXT_WIDTH,
		}),
		{
			accessorKey: "name",
			header: t("table.columns.name"),
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
		createTableTextColumn<EntityTableRow>({
			id: "address",
			accessorKey: "address",
			header: t("partner.entityPage.table.columns.address"),
			text: row => row.address,
			maxWidth: TABLE_ADDRESS_TEXT_WIDTH,
		}),
		createDateTimeColumn<EntityTableRow>({
			id: "createdAt",
			header: t("table.columns.createdAt"),
			value: row => row.auditInfo.createdAt,
			formattedValue: row => row.auditInfo.createdAtFormatted,
		}),
		createDateTimeColumn<EntityTableRow>({
			id: "updatedAt",
			header: t("table.columns.updatedAt"),
			value: row => row.auditInfo.updatedAt,
			formattedValue: row => row.auditInfo.updatedAtFormatted,
		}),
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
		title: t("common.empty.title"),
		description: query
			? t("common.empty.filteredDescription", { value: query })
			: t("common.empty.defaultDescription"),
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
		fallbackTitle: t("common.errors.detailLoad.title"),
		fallbackDescription: t("common.errors.detailLoad.description"),
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
	return getCrudErrorToastContent(
		t,
		error,
		"create",
		t("common.objects.entity"),
	);
}

export function getEntityDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getCrudErrorToastContent(
		t,
		error,
		"duplicate",
		t("common.objects.entity"),
	);
}

export function getEntityUpdateErrorToastContent(t: TFunction, error: unknown) {
	return getCrudErrorToastContent(
		t,
		error,
		"update",
		t("common.objects.entity"),
	);
}

export function getEntityDeleteErrorToastContent(t: TFunction, error: unknown) {
	return getCrudErrorToastContent(
		t,
		error,
		"delete",
		t("common.objects.entity"),
	);
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
		cnpj: normalizeCnpj(values.cnpj),
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

export function getEntityFilterSummary({
	cnpjQuery,
	query,
	dateFrom,
	dateTo,
}: EntityFilterArgs) {
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
