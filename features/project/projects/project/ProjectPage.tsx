"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge, NotFoundState, SomeErrorState } from "@/components";
import { useAdminsQuery } from "@/features/identity/admins/queries";
import { useEntitiesQuery } from "@/features/partner/entities/queries";
import {
	useProjectDetailQuery,
	useProjectSchoolsQuery,
} from "@/features/project/projects/queries";
import {
	formatProjectSchoolNames,
	getProjectAdminsErrorToastContent,
	getProjectDetailErrorToastContent,
	getProjectEntitiesErrorToastContent,
	getProjectSchoolsErrorToastContent,
	getProjectStatusLabel,
	getProjectStatusTone,
	resolveProjectCreatorLabel,
	resolveProjectEntityLabel,
} from "@/features/project/projects/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { ProjectPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function ProjectPage({ projectId }: ProjectPageProps) {
	const { t } = useTranslation();
	const projectDetailQuery = useProjectDetailQuery(projectId);
	const projectSchoolsQuery = useProjectSchoolsQuery(projectId);
	const entitiesQuery = useEntitiesQuery();
	const adminsQuery = useAdminsQuery();

	useQueryErrorToasts([
		{
			key: `project-detail-${projectId}`,
			error: projectDetailQuery.error,
			errorUpdatedAt: projectDetailQuery.errorUpdatedAt,
			getContent: error => getProjectDetailErrorToastContent(t, error),
			isError: projectDetailQuery.isError,
		},
		{
			key: `project-schools-${projectId}`,
			error: projectSchoolsQuery.error,
			errorUpdatedAt: projectSchoolsQuery.errorUpdatedAt,
			getContent: error => getProjectSchoolsErrorToastContent(t, error),
			isError: projectSchoolsQuery.isError,
		},
		{
			key: `project-entities-${projectId}`,
			error: entitiesQuery.error,
			errorUpdatedAt: entitiesQuery.errorUpdatedAt,
			getContent: error => getProjectEntitiesErrorToastContent(t, error),
			isError: entitiesQuery.isError,
		},
		{
			key: `project-admins-${projectId}`,
			error: adminsQuery.error,
			errorUpdatedAt: adminsQuery.errorUpdatedAt,
			getContent: error => getProjectAdminsErrorToastContent(t, error),
			isError: adminsQuery.isError,
		},
	]);

	const entityById = useMemo(
		() =>
			new Map((entitiesQuery.data ?? []).map(entity => [entity.id, entity])),
		[entitiesQuery.data],
	);
	const adminById = useMemo(
		() =>
			new Map((adminsQuery.data ?? []).map(admin => [admin.accountId, admin])),
		[adminsQuery.data],
	);

	const project = projectDetailQuery.data;
	const schoolNames = formatProjectSchoolNames(projectSchoolsQuery.data);
	const fields = useMemo(
		() =>
			project
				? [
						{
							id: "id",
							label: t("project.projectPage.dialog.fields.id"),
							value: project.id,
						},
						{
							id: "name",
							label: t("project.projectPage.dialog.fields.name"),
							value: project.name,
						},
						{
							id: "entity",
							label: t("project.projectPage.dialog.fields.entity"),
							value: resolveProjectEntityLabel(entityById, project.entityId),
						},
						{
							id: "createdBy",
							label: t("project.projectPage.dialog.fields.createdBy"),
							value: resolveProjectCreatorLabel(adminById, project.createdBy),
						},
						{
							id: "description",
							label: t("project.projectPage.dialog.fields.description"),
							value:
								project.description ||
								t("project.projectPage.dialog.values.noDescription"),
						},
						{
							id: "status",
							label: t("project.projectPage.dialog.fields.status"),
							value: (
								<Badge
									className="min-h-5 px-2 py-0.5"
									tone={getProjectStatusTone(project.status)}
									variant="primary"
								>
									{getProjectStatusLabel(t, project.status)}
								</Badge>
							),
						},
						{
							id: "offeredHours",
							label: t("project.projectPage.dialog.fields.offeredHours"),
							value: project.offeredHours,
						},
						{
							id: "completedHours",
							label: t("project.projectPage.dialog.fields.completedHours"),
							value: project.completedHours,
						},
						{
							id: "maxParticipants",
							label: t("project.projectPage.dialog.fields.maxParticipants"),
							value:
								project.maxParticipants ??
								t("project.projectPage.dialog.values.unlimited"),
						},
						{
							id: "closedAt",
							label: t("project.projectPage.dialog.fields.closedAt"),
							value: project.closedAt
								? project.closedAtFormatted
								: t("project.projectPage.dialog.values.open"),
						},
						{
							id: "schools",
							label: t("project.projectPage.dialog.fields.schools"),
							value: projectSchoolsQuery.isLoading
								? t("project.projectPage.loading.schools")
								: (schoolNames ??
									t("project.projectPage.dialog.values.noSchools")),
						},
						{
							id: "createdAt",
							label: t("project.projectPage.dialog.fields.createdAt"),
							value: project.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("project.projectPage.dialog.fields.updatedAt"),
							value: project.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[
			adminById,
			entityById,
			project,
			projectSchoolsQuery.isLoading,
			schoolNames,
			t,
		],
	);

	return (
		<EntityPageShell
			title={project?.name ?? t("project.projectPage.dialog.titleFallback")}
			description={t("project.projectPage.description")}
		>
			{projectDetailQuery.isError ? (
				projectDetailQuery.error instanceof WebApiError &&
				projectDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("project.projectPage.dialog.notFound.title")}
						description={t("project.projectPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("project.projectPage.dialog.error.title")}
						description={t("project.projectPage.dialog.error.description")}
						onRefresh={() => {
							void projectDetailQuery.refetch();
						}}
					/>
				)
			) : project ? (
				<div className="grid gap-6">
					<EntityPageFieldsGrid fields={fields} />
					{projectSchoolsQuery.isError ? (
						<SomeErrorState
							title={t("project.projectPage.dialog.schoolsError.title")}
							description={t(
								"project.projectPage.dialog.schoolsError.description",
							)}
							onRefresh={() => {
								void projectSchoolsQuery.refetch();
							}}
						/>
					) : null}
				</div>
			) : projectDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton count={12} />
			) : (
				<NotFoundState title={t("project.projectPage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
