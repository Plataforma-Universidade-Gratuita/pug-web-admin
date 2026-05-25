"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState } from "@/components";
import { useSchoolDetailQuery } from "@/features/academic/schools/queries";
import { getSchoolDetailErrorToastContent } from "@/features/academic/schools/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { SchoolPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function SchoolPage({ schoolId }: SchoolPageProps) {
	const { t } = useTranslation();
	const schoolDetailQuery = useSchoolDetailQuery(schoolId);

	useQueryErrorToasts([
		{
			key: `school-detail-${schoolId}`,
			error: schoolDetailQuery.error,
			errorUpdatedAt: schoolDetailQuery.errorUpdatedAt,
			getContent: error => getSchoolDetailErrorToastContent(t, error),
			isError: schoolDetailQuery.isError,
		},
	]);

	const school = schoolDetailQuery.data;
	const fields = useMemo(
		() =>
			school
				? [
						{
							id: "name",
							label: t("academic.schoolPage.dialog.fields.name"),
							value: school.name,
						},
						{
							id: "id",
							label: t("academic.schoolPage.dialog.fields.id"),
							value: school.id,
						},
						{
							id: "createdAt",
							label: t("academic.schoolPage.dialog.fields.createdAt"),
							value: school.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("academic.schoolPage.dialog.fields.updatedAt"),
							value: school.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[school, t],
	);

	return (
		<EntityPageShell
			title={school?.name ?? t("academic.schoolPage.dialog.titleFallback")}
			description={t("academic.schoolPage.description")}
		>
			{schoolDetailQuery.isError ? (
				schoolDetailQuery.error instanceof WebApiError &&
				schoolDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("academic.schoolPage.dialog.notFound.title")}
						description={t("academic.schoolPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("academic.schoolPage.dialog.error.title")}
						description={t("academic.schoolPage.dialog.error.description")}
						onRefresh={() => {
							void schoolDetailQuery.refetch();
						}}
					/>
				)
			) : school ? (
				<EntityPageFieldsGrid fields={fields} />
			) : schoolDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState title={t("academic.schoolPage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
