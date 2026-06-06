"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { NotFoundState, SomeErrorState } from "@/components";
import { getAreaOfExpertiseDetailErrorToastContent } from "@/features/academic/areas-of-expertise/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { AreaOfExpertisePageProps } from "@/types";
import { WebApiError } from "@/utils";

const { areasOfExpertise: areasOfExpertiseApi } = web.academic;
const { useAreaOfExpertiseDetailQuery } = areasOfExpertiseApi;

export function AreaOfExpertisePage({
	areaOfExpertiseId,
}: AreaOfExpertisePageProps) {
	const { t } = useTranslation();
	const areaOfExpertiseDetailQuery =
		useAreaOfExpertiseDetailQuery(areaOfExpertiseId);

	useQueryErrorToasts([
		{
			key: `area-of-expertise-detail-${areaOfExpertiseId}`,
			error: areaOfExpertiseDetailQuery.error,
			errorUpdatedAt: areaOfExpertiseDetailQuery.errorUpdatedAt,
			getContent: error => getAreaOfExpertiseDetailErrorToastContent(t, error),
			isError: areaOfExpertiseDetailQuery.isError,
		},
	]);

	const areaOfExpertise = areaOfExpertiseDetailQuery.data;
	const fields = useMemo(
		() =>
			areaOfExpertise
				? [
						{
							id: "name",
							label: t("academic.areaOfExpertisePage.dialog.fields.name"),
							value: areaOfExpertise.name,
						},
						{
							id: "id",
							label: t("academic.areaOfExpertisePage.dialog.fields.id"),
							value: areaOfExpertise.id,
						},
						{
							id: "createdAt",
							label: t("academic.areaOfExpertisePage.dialog.fields.createdAt"),
							value: areaOfExpertise.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("academic.areaOfExpertisePage.dialog.fields.updatedAt"),
							value: areaOfExpertise.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[areaOfExpertise, t],
	);

	return (
		<EntityPageShell
			title={
				areaOfExpertise?.name ??
				t("academic.areaOfExpertisePage.dialog.titleFallback")
			}
			description={t("academic.areaOfExpertisePage.description")}
		>
			{areaOfExpertiseDetailQuery.isError ? (
				areaOfExpertiseDetailQuery.error instanceof WebApiError &&
				areaOfExpertiseDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("academic.areaOfExpertisePage.dialog.notFound.title")}
						description={t(
							"academic.areaOfExpertisePage.dialog.notFound.description",
						)}
					/>
				) : (
					<SomeErrorState
						title={t("academic.areaOfExpertisePage.dialog.error.title")}
						description={t(
							"academic.areaOfExpertisePage.dialog.error.description",
						)}
						onRefresh={() => {
							void areaOfExpertiseDetailQuery.refetch();
						}}
					/>
				)
			) : areaOfExpertise ? (
				<EntityPageFieldsGrid fields={fields} />
			) : areaOfExpertiseDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState
					title={t("academic.areaOfExpertisePage.dialog.notFound.title")}
				/>
			)}
		</EntityPageShell>
	);
}
