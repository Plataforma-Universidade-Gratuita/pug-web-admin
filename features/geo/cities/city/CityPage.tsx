"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState } from "@/components";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { CityPageProps } from "@/types";
import { WebApiError } from "@/utils";

import { useCityDetailQuery } from "../queries";
import { getCityDetailErrorToastContent } from "../utils";

export function CityPage({ cityId }: CityPageProps) {
	const { t } = useTranslation();
	const cityDetailQuery = useCityDetailQuery(cityId);

	useQueryErrorToasts([
		{
			key: `city-detail-${cityId}`,
			error: cityDetailQuery.error,
			errorUpdatedAt: cityDetailQuery.errorUpdatedAt,
			getContent: error => getCityDetailErrorToastContent(t, error),
			isError: cityDetailQuery.isError,
		},
	]);

	const city = cityDetailQuery.data;
	const fields = useMemo(
		() =>
			city
				? [
						{
							id: "identifier",
							label: t("geo.cityPage.dialog.fields.id"),
							value: city.id,
						},
						{
							id: "name",
							label: t("geo.cityPage.dialog.fields.name"),
							value: city.name,
						},
						{
							id: "ibgeCode",
							label: t("geo.cityPage.dialog.fields.ibgeCode"),
							value: city.ibgeCode,
						},
					]
				: [],
		[city, t],
	);

	return (
		<EntityPageShell
			title={city?.name ?? t("geo.cityPage.title")}
			description={t("geo.cityPage.description")}
		>
			{cityDetailQuery.isError ? (
				cityDetailQuery.error instanceof WebApiError &&
				cityDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("geo.cityPage.dialog.notFound.title")}
						description={t("geo.cityPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("geo.cityPage.dialog.error.title")}
						description={t("geo.cityPage.dialog.error.description")}
						onRefresh={() => {
							void cityDetailQuery.refetch();
						}}
					/>
				)
			) : city ? (
				<EntityPageFieldsGrid fields={fields} />
			) : cityDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState title={t("geo.cityPage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
