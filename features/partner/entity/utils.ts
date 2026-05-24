import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { z } from "zod";

import type {
	CityResponse,
	EntityCreateRequest,
	EntityResponse,
	EntityUpdateRequest,
} from "@/types/api";
import type { ComboboxOption } from "@/types/client";
import type {
	EntityEditorFormValues,
	EntityFilterArgs,
	EntityEditorMode,
} from "@/types/client/partner";
import { getApiErrorToastContent } from "@/utils/api-errors";
import {
	compareNormalizedText,
	normalizeDigits,
	normalizeTextForSearch,
} from "@/utils/lang";

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

function normalizeCnpj(value: string) {
	return normalizeDigits(value).slice(0, 14);
}

export function createEntityColumns(
	t: TFunction,
	cityById: Map<string, CityResponse>,
): ColumnDef<EntityResponse>[] {
	return [
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
			accessorFn: row => resolveEntityCityLabel(cityById, row.cityId),
			id: "city",
			header: t("partner.entityPage.table.columns.city"),
		},
		{
			accessorFn: row => row.auditInfo.createdAt,
			id: "createdAt",
			header: t("partner.entityPage.table.columns.createdAt"),
			cell: ({ row }) => row.original.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("partner.entityPage.table.columns.updatedAt"),
			cell: ({ row }) => row.original.auditInfo.updatedAtFormatted,
		},
	];
}

export function resolveEntityCityLabel(
	cityById: Map<string, CityResponse>,
	cityId: string,
) {
	return cityById.get(cityId)?.name ?? cityId;
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

export function filterEntities(
	entities: EntityResponse[],
	{
		query,
		cityIdFilter,
		dateField,
		startDate,
		endDate,
		cityById,
	}: EntityFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const normalizedDigitsQuery = normalizeDigits(query);
	const hasQuery = normalizedQuery.length > 0;
	const hasCityFilter = cityIdFilter.length > 0;
	const startTimestamp = startDate ? getStartOfDayTimestamp(startDate) : null;
	const endTimestamp = endDate ? getStartOfDayTimestamp(endDate) : null;

	if (
		!hasQuery &&
		!hasCityFilter &&
		!dateField &&
		startTimestamp === null &&
		endTimestamp === null
	) {
		return entities;
	}

	return entities.filter(entity => {
		if (hasQuery) {
			const normalizedName = normalizeTextForSearch(entity.name);
			const normalizedAddress = normalizeTextForSearch(entity.address);
			const normalizedCity = normalizeTextForSearch(
				resolveEntityCityLabel(cityById, entity.cityId),
			);
			const normalizedCnpj = normalizeCnpj(entity.cnpj);

			const matchesText =
				normalizedName.includes(normalizedQuery) ||
				normalizedAddress.includes(normalizedQuery) ||
				normalizedCity.includes(normalizedQuery);
			const matchesCnpj =
				normalizedDigitsQuery.length > 0 &&
				normalizedCnpj.includes(normalizedDigitsQuery);

			if (!matchesText && !matchesCnpj) {
				return false;
			}
		}

		if (hasCityFilter && entity.cityId !== cityIdFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				entity.auditInfo[dateField],
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
		fallbackTitle: t("partner.entityPage.feedback.listError.title"),
		fallbackDescription: t("partner.entityPage.feedback.listError.description"),
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

export function createEntityEditorFormSchema(
	t: TFunction,
	mode: EntityEditorMode,
) {
	const requiresIdentityField = mode !== "update";

	return z.object({
		cnpj: requiresIdentityField
			? z
					.string()
					.trim()
					.min(1, t("partner.entityPage.editor.validation.cnpj.required"))
					.refine(
						value => normalizeCnpj(value).length === 14,
						t("partner.entityPage.editor.validation.cnpj.invalid"),
					)
			: z.string(),
		name: z
			.string()
			.trim()
			.min(1, t("partner.entityPage.editor.validation.name")),
		cityId: z
			.string()
			.trim()
			.min(1, t("partner.entityPage.editor.validation.city")),
		address: z.string(),
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
		cnpj: entity.cnpj,
		name: entity.name,
		cityId: entity.cityId,
		address: entity.address,
	};
}

export function toEntityCreateRequest(
	values: EntityEditorFormValues,
): EntityCreateRequest {
	const address = values.address.trim();

	return {
		cnpj: normalizeCnpj(values.cnpj),
		name: values.name.trim(),
		cityId: values.cityId,
		address: address.length > 0 ? address : null,
	};
}

export function toEntityUpdateRequest(
	values: EntityEditorFormValues,
): EntityUpdateRequest {
	const address = values.address.trim();

	return {
		name: values.name.trim(),
		cityId: values.cityId,
		address: address.length > 0 ? address : null,
	};
}

export function getEntityFilterSummary(
	t: TFunction,
	{
		query,
		cityIdFilter,
		dateField,
		startDate,
		endDate,
		cityById,
	}: EntityFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (cityIdFilter) {
		parts.push(resolveEntityCityLabel(cityById, cityIdFilter));
	}

	if (dateField) {
		parts.push(t(`partner.entityPage.filters.dateField.options.${dateField}`));
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
	}

	return parts.join(" | ");
}
