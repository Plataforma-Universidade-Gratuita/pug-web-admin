"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
	Badge,
	NoContentState,
	NotFoundState,
	SomeErrorState,
} from "@/components";
import { AreaOfExpertiseDetailsContent } from "@/features/academic/areas-of-expertise/area-of-expertise/AreaOfExpertiseDetailsContent";
import { useAdminsQuery } from "@/features/identity/admins/queries";
import {
	useProjectDetailQuery,
	useProjectAreasOfExpertiseQuery,
} from "@/features/project/projects/queries";
import {
	getProjectAdminsErrorToastContent,
	getProjectAreasOfExpertiseErrorToastContent,
	getProjectDetailErrorToastContent,
	getProjectStatusLabel,
	getProjectStatusTone,
	resolveProjectCreatorLabel,
} from "@/features/project/projects/utils";
import {
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { ProjectPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function ProjectPage({ projectId }: ProjectPageProps) {
	const { t } = useTranslation();
	const projectDetailQuery = useProjectDetailQuery(projectId);
	const projectAreasOfExpertiseQuery =
		useProjectAreasOfExpertiseQuery(projectId);
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
			key: `project-areas-of-expertise-${projectId}`,
			error: projectAreasOfExpertiseQuery.error,
			errorUpdatedAt: projectAreasOfExpertiseQuery.errorUpdatedAt,
			getContent: error =>
				getProjectAreasOfExpertiseErrorToastContent(t, error),
			isError: projectAreasOfExpertiseQuery.isError,
		},
		{
			key: `project-admins-${projectId}`,
			error: adminsQuery.error,
			errorUpdatedAt: adminsQuery.errorUpdatedAt,
			getContent: error => getProjectAdminsErrorToastContent(t, error),
			isError: adminsQuery.isError,
		},
	]);

	const adminById = useMemo(
		() =>
			new Map(
				(adminsQuery.data ?? []).map(admin => [admin.account.id, admin]),
			),
		[adminsQuery.data],
	);

	const project = projectDetailQuery.data;
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
							value: project.entity.name,
						},
						{
							id: "createdBy",
							label: t("project.projectPage.dialog.fields.createdBy"),
							value: resolveProjectCreatorLabel(
								adminById,
								project.projectInfo.createdBy,
							),
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
									tone={getProjectStatusTone(project.status.status)}
									variant="primary"
								>
									{getProjectStatusLabel(t, project.status.status)}
								</Badge>
							),
						},
						{
							id: "offeredHours",
							label: t("project.projectPage.dialog.fields.offeredHours"),
							value: project.projectInfo.offeredHours ?? "-",
						},
						{
							id: "completedHours",
							label: t("project.projectPage.dialog.fields.completedHours"),
							value: project.projectInfo.completedHours ?? "-",
						},
						{
							id: "maxParticipants",
							label: t("project.projectPage.dialog.fields.maxParticipants"),
							value:
								project.projectInfo.maxParticipants ??
								t("project.projectPage.dialog.values.unlimited"),
						},
						{
							id: "closedAt",
							label: t("project.projectPage.dialog.fields.closedAt"),
							value: project.projectInfo.closedAt
								? project.projectInfo.closedAtFormatted
								: t("project.projectPage.dialog.values.open"),
						},
						{
							id: "createdAt",
							label: t("project.projectPage.dialog.fields.createdAt"),
							value: project.projectInfo.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("project.projectPage.dialog.fields.updatedAt"),
							value: project.projectInfo.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[
			adminById,
			project,
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
					<div className="grid gap-4 lg:grid-cols-3">
						{fields.map(field => (
							<div
								key={field.id}
								className="grid gap-1"
							>
								<p className="ty-helper">{field.label}</p>
								<div className="ty-sm-semibold">{field.value}</div>
							</div>
						))}
					</div>
					{projectAreasOfExpertiseQuery.isError ? (
						<SomeErrorState
							title={t(
								"project.projectPage.dialog.areasOfExpertiseError.title",
							)}
							description={t(
								"project.projectPage.dialog.areasOfExpertiseError.description",
							)}
							onRefresh={() => {
								void projectAreasOfExpertiseQuery.refetch();
							}}
						/>
					) : projectAreasOfExpertiseQuery.isLoading ? (
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("project.projectPage.dialog.linkedAreasOfExpertise.overhead")}
							</p>
							<EntityPageFieldsGridSkeleton />
						</div>
					) : (
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("project.projectPage.dialog.linkedAreasOfExpertise.overhead")}
							</p>
							{projectAreasOfExpertiseQuery.data &&
							projectAreasOfExpertiseQuery.data.length > 0 ? (
								<div className="grid gap-4">
									{projectAreasOfExpertiseQuery.data.map(areaOfExpertise => (
										<AreaOfExpertiseDetailsContent
											key={areaOfExpertise.id}
											areaOfExpertise={areaOfExpertise}
										/>
									))}
								</div>
							) : (
								<NoContentState
									title={t(
										"project.projectPage.dialog.linkedAreasOfExpertise.empty.title",
									)}
									description={t(
										"project.projectPage.dialog.linkedAreasOfExpertise.empty.description",
									)}
								/>
							)}
						</div>
					)}
				</div>
			) : projectDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton count={12} />
			) : (
				<NotFoundState title={t("project.projectPage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
