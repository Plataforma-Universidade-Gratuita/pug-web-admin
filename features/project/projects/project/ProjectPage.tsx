"use client";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { WebApiError } from "@/api/web";
import {
	AreaOfExpertiseDetailsContent,
	EntityDetailsContent,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
	ProjectOwnDetailsContent,
} from "@/components/composite";
import {
	NoContentState,
	NotFoundState,
	SomeErrorState,
} from "@/components/primitives";
import {
	getProjectAreasOfExpertiseErrorToastContent,
	getProjectDetailErrorToastContent,
} from "@/features/project/projects/utils";
import { useQueryErrorToasts } from "@/hooks";
import type { ProjectPageProps } from "@/types/client";

const { projects: projectsApi } = web.project;
const { useProjectDetailQuery, useProjectAreasOfExpertiseQuery } = projectsApi;

export function ProjectPage({ projectId }: ProjectPageProps) {
	const { t } = useTranslation();
	const projectDetailQuery = useProjectDetailQuery(projectId);
	const projectAreasOfExpertiseQuery =
		useProjectAreasOfExpertiseQuery(projectId);

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
	]);

	const project = projectDetailQuery.data;
	const createdByLabel = project ? project.projectInfo.createdBy.name : "";

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
					<ProjectOwnDetailsContent
						project={project}
						createdByLabel={createdByLabel}
					/>
					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("project.projectPage.dialog.linkedEntity.overhead")}
						</p>
						<EntityDetailsContent entityId={project.entity.id} />
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
								{t(
									"project.projectPage.dialog.linkedAreasOfExpertise.overhead",
								)}
							</p>
							<EntityPageFieldsGridSkeleton />
						</div>
					) : (
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t(
									"project.projectPage.dialog.linkedAreasOfExpertise.overhead",
								)}
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
