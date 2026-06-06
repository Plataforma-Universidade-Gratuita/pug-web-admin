"use client";

import { useMemo } from "react";

import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { WebApiError } from "@/api/web";
import { NotFoundState, SomeErrorState } from "@/components";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
} from "@/components";
import { useQueryErrorToasts } from "@/hooks";
import type { CityResponse, EntityDetailsContentProps } from "@/types";
import { getApiErrorToastContent } from "@/utils";

const { entities: entitiesApi } = web.partner;
const { useEntityCitiesQuery, useEntityDetailQuery } = entitiesApi;

function resolveEntityCityLabel(
	cityById: Map<string, CityResponse>,
	cityId: string,
) {
	return cityById.get(cityId)?.name ?? cityId;
}

function getEntityDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.feedback.detailError.title"),
		fallbackDescription: t(
			"partner.entityPage.feedback.detailError.description",
		),
	});
}

function getEntityCitiesErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.feedback.citiesError.title"),
		fallbackDescription: t(
			"partner.entityPage.feedback.citiesError.description",
		),
	});
}

export function EntityDetailsContent({
	entityId,
	columns = 3,
}: EntityDetailsContentProps) {
	const { t } = useTranslation();
	const entityDetailQuery = useEntityDetailQuery(entityId);
	const citiesQuery = useEntityCitiesQuery();

	useQueryErrorToasts([
		{
			key: `entity-detail-${entityId}`,
			error: entityDetailQuery.error,
			errorUpdatedAt: entityDetailQuery.errorUpdatedAt,
			getContent: error => getEntityDetailErrorToastContent(t, error),
			isError: entityDetailQuery.isError,
		},
		{
			key: `entity-cities-${entityId}`,
			error: citiesQuery.error,
			errorUpdatedAt: citiesQuery.errorUpdatedAt,
			getContent: error => getEntityCitiesErrorToastContent(t, error),
			isError: citiesQuery.isError,
		},
	]);

	const cityById = useMemo(
		() => new Map((citiesQuery.data ?? []).map(city => [city.id, city])),
		[citiesQuery.data],
	);
	const entity = entityDetailQuery.data;
	const fields = useMemo(
		() =>
			entity
				? [
						{
							id: "id",
							label: t("common.fields.id"),
							value: entity.id,
						},
						{
							id: "name",
							label: t("partner.entityPage.dialog.fields.name"),
							value: entity.name,
						},
						{
							id: "cnpj",
							label: t("partner.entityPage.dialog.fields.cnpj"),
							value: entity.cnpjFormatted,
						},
						{
							id: "city",
							label: t("partner.entityPage.dialog.fields.city"),
							value: resolveEntityCityLabel(cityById, entity.cityId),
						},
						{
							id: "address",
							label: t("partner.entityPage.dialog.fields.address"),
							value:
								entity.address ||
								t("partner.entityPage.dialog.values.noAddress"),
						},
						{
							id: "createdAt",
							label: t("common.fields.createdAt"),
							value: entity.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("common.fields.updatedAt"),
							value: entity.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[cityById, entity, t],
	);

	if (entityDetailQuery.isError) {
		return entityDetailQuery.error instanceof WebApiError &&
			entityDetailQuery.error.status === 404 ? (
			<NotFoundState
				title={t("partner.entityPage.dialog.notFound.title")}
				description={t("partner.entityPage.dialog.notFound.description")}
			/>
		) : (
			<SomeErrorState
				title={t("partner.entityPage.dialog.error.title")}
				description={t("partner.entityPage.dialog.error.description")}
				onRefresh={() => {
					void entityDetailQuery.refetch();
				}}
			/>
		);
	}

	if (entity) {
		return (
			<EntityPageFieldsGrid
				fields={fields}
				columns={columns}
			/>
		);
	}

	if (entityDetailQuery.isLoading) {
		return <EntityPageFieldsGridSkeleton columns={columns} />;
	}

	return (
		<NotFoundState title={t("partner.entityPage.dialog.notFound.title")} />
	);
}
