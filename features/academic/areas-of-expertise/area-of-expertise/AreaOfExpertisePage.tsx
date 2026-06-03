"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState } from "@/components";
import { useAreaOfExpertiseDetailQuery } from "@/features/academic/areas-of-expertise/queries";
import { getAreaOfExpertiseDetailErrorToastContent } from "@/features/academic/areas-of-expertise/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { AreaOfExpertisePageProps } from "@/types";
import { WebApiError } from "@/utils";

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
							label: t("academic.schoolPage.dialog.fields.name"),
							value: areaOfExpertise.name,
						},
						{
							id: "id",
							label: t("academic.schoolPage.dialog.fields.id"),
							value: areaOfExpertise.id,
						},
						{
							id: "createdAt",
							label: t("academic.schoolPage.dialog.fields.createdAt"),
							value: areaOfExpertise.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("academic.schoolPage.dialog.fields.updatedAt"),
							value: areaOfExpertise.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[areaOfExpertise, t],
	);

	return (
		<EntityPageShell
			title={
				areaOfExpertise?.name ?? t("academic.schoolPage.dialog.titleFallback")
			}
			description={t("academic.schoolPage.description")}
		>
			{areaOfExpertiseDetailQuery.isError ? (
				areaOfExpertiseDetailQuery.error instanceof WebApiError &&
				areaOfExpertiseDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("academic.schoolPage.dialog.notFound.title")}
						description={t("academic.schoolPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("academic.schoolPage.dialog.error.title")}
						description={t("academic.schoolPage.dialog.error.description")}
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
				<NotFoundState title={t("academic.schoolPage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
