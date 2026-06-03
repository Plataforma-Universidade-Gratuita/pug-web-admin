"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import { useAdminsQuery } from "@/features/identity/admins/queries";
import { useEntitiesQuery } from "@/features/partner/entities/queries";
import { ProjectsEditorDrawer } from "@/features/project/projects/ProjectsEditorDrawer";
import { ProjectsFiltersDrawer } from "@/features/project/projects/ProjectsFiltersDrawer";
import { ProjectsRowActions } from "@/features/project/projects/ProjectsRowActions";
import {
	useCreateProjectMutation,
	useProjectStatusMutation,
	useRemoveProjectMutation,
} from "@/features/project/projects/mutations";
import {
	useProjectsQuery,
	useProjectsSearchQuery,
} from "@/features/project/projects/queries";
import {
	appendCopyToProjectName,
	buildProjectCreatorOptions,
	buildProjectEntityOptions,
	filterProjectsByBackendFilters,
	filterProjectsByFrontendFilters,
	createProjectColumns,
	getProjectAdminsErrorToastContent,
	getProjectDeleteErrorToastContent,
	getProjectEmptyStateCopy,
	getProjectEntitiesErrorToastContent,
	getProjectFilterSummary,
	getProjectDuplicateErrorToastContent,
	getProjectsListErrorToastContent,
	getProjectStatusActionErrorToastContent,
} from "@/features/project/projects/utils";
import {
	ServicePageConfirmDialog,
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDeferredUndoAction,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageEditorState,
	useServicePagePagination,
} from "@/hooks";
import type { ProjectResponse } from "@/types";
import type {
	ProjectComplexSearchFilters,
	ProjectEditorMode,
	ProjectStatusAction,
} from "@/types";

function getStatusDialogVariant(action: ProjectStatusAction) {
	switch (action) {
		case "cancel":
			return "danger" as const;
		case "hold":
			return "warning" as const;
		case "complete":
		case "retake":
		case "start":
		default:
			return "success" as const;
	}
}

export function ProjectsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialBackendFilters = useMemo<ProjectComplexSearchFilters>(
		() => ({
			createdByIds: [],
			dateFrom: "",
			dateTo: "",
			entityIds: [],
			statuses: [],
		}),
		[],
	);
	const {
		appliedFilters,
		applyDraftFilters,
		clearFilters: clearDraftFilters,
		draftFilters,
		hasAppliedFilters,
		setDraftFilter,
	} = useDraftFilters<ProjectComplexSearchFilters>({
		initialFilters: initialBackendFilters,
	});
	const editorState = useServicePageEditorState<ProjectEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const projectsPagination = useServicePagePagination({
		key: "project.projects",
	});
	const [pendingDeleteProject, setPendingDeleteProject] =
		useState<ProjectResponse | null>(null);
	const [pendingStatusAction, setPendingStatusAction] = useState<{
		action: ProjectStatusAction;
		project: ProjectResponse;
	} | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const projectsQuery = useProjectsQuery(projectsPagination.isAll);
	const projectsSearchQuery = useProjectsSearchQuery(
		projectsPagination.backendPage ?? 0,
		projectsPagination.backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters,
		!projectsPagination.isAll,
	);
	const entitiesQuery = useEntitiesQuery();
	const adminsQuery = useAdminsQuery();
	const createProjectMutation = useCreateProjectMutation();
	const removeProjectMutation = useRemoveProjectMutation();
	const projectStatusMutation = useProjectStatusMutation();
	const { schedule } = useDeferredUndoAction();
	const activeQueryError = projectsPagination.isAll
		? projectsQuery.error
		: projectsSearchQuery.error;
	const activeQueryErrorUpdatedAt = projectsPagination.isAll
		? projectsQuery.errorUpdatedAt
		: projectsSearchQuery.errorUpdatedAt;
	const activeQueryIsError = projectsPagination.isAll
		? projectsQuery.isError
		: projectsSearchQuery.isError;
	const activeQueryIsLoading = projectsPagination.isAll
		? projectsQuery.isLoading
		: projectsSearchQuery.isLoading;

	const entityById = useMemo(
		() =>
			new Map((entitiesQuery.data ?? []).map(entity => [entity.id, entity])),
		[entitiesQuery.data],
	);
	const adminById = useMemo(
		() =>
			new Map((adminsQuery.data ?? []).map(admin => [admin.account.id, admin])),
		[adminsQuery.data],
	);
	const entityOptions = useMemo(
		() => buildProjectEntityOptions(entitiesQuery.data ?? []),
		[entitiesQuery.data],
	);
	const creatorOptions = useMemo(
		() => buildProjectCreatorOptions(adminsQuery.data ?? []),
		[adminsQuery.data],
	);
	const backendFilteredAllProjects = useMemo(
		() =>
			projectsPagination.isAll
				? filterProjectsByBackendFilters(
						projectsQuery.data ?? [],
						appliedFilters,
					)
				: [],
		[appliedFilters, projectsPagination.isAll, projectsQuery.data],
	);
	const tableSourceProjects = useMemo(
		() =>
			projectsPagination.isAll
				? backendFilteredAllProjects
				: (projectsSearchQuery.data?.content ?? []),
		[
			backendFilteredAllProjects,
			projectsPagination.isAll,
			projectsSearchQuery.data,
		],
	);
	const filteredProjects = useMemo(
		() =>
			filterProjectsByFrontendFilters(tableSourceProjects, {
				adminById,
				query: deferredQuerySearch,
			}),
		[adminById, deferredQuerySearch, tableSourceProjects],
	);
	const columns = useMemo(
		() => createProjectColumns(t, adminById),
		[adminById, t],
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getProjectFilterSummary(t, {
				adminById,
				createdByIds: appliedFilters.createdByIds,
				dateFrom: appliedFilters.dateFrom,
				dateTo: appliedFilters.dateTo,
				entityById,
				entityIds: appliedFilters.entityIds,
				query: deferredQuerySearch,
				statuses: appliedFilters.statuses,
			}),
		[adminById, appliedFilters, deferredQuerySearch, entityById, t],
	);
	const emptyStateCopy = useMemo(
		() => getProjectEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (activeQueryIsError) {
			return (
				<SomeErrorState
					title={t("project.projectPage.table.error.title")}
					description={t("project.projectPage.table.error.description")}
					onRefresh={() => {
						if (projectsPagination.isAll) {
							void projectsQuery.refetch();
							return;
						}

						void projectsSearchQuery.refetch();
					}}
				/>
			);
		}

		return (
			<NoContentState
				title={emptyStateCopy.title}
				description={emptyStateCopy.description}
			/>
		);
	}, [
		activeQueryIsError,
		emptyStateCopy.description,
		emptyStateCopy.title,
		projectsPagination.isAll,
		projectsQuery,
		projectsSearchQuery,
		t,
	]);

	const totalElements = projectsPagination.isAll
		? backendFilteredAllProjects.length
		: (projectsSearchQuery.data?.totalElements ?? 0);
	const totalPages = projectsPagination.isAll
		? 1
		: Math.max(projectsSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (
			projectsPagination.isAll ||
			!projectsSearchQuery.data ||
			projectsPagination.currentPage <= totalPages
		) {
			return;
		}

		projectsPagination.setCurrentPage(totalPages);
	}, [projectsPagination, projectsSearchQuery.data, totalPages]);

	useQueryErrorToasts([
		{
			key: "projects-list",
			error: activeQueryError,
			errorUpdatedAt: activeQueryErrorUpdatedAt,
			getContent: error => getProjectsListErrorToastContent(t, error),
			isError: activeQueryIsError,
		},
		{
			key: "projects-entities",
			error: entitiesQuery.error,
			errorUpdatedAt: entitiesQuery.errorUpdatedAt,
			getContent: error => getProjectEntitiesErrorToastContent(t, error),
			isError: entitiesQuery.isError,
		},
		{
			key: "projects-admins",
			error: adminsQuery.error,
			errorUpdatedAt: adminsQuery.errorUpdatedAt,
			getContent: error => getProjectAdminsErrorToastContent(t, error),
			isError: adminsQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearDraftFilters();
		projectsPagination.resetPage();
		setFiltersOpen(false);
	}

	function handleDuplicate(project: ProjectResponse) {
		createProjectMutation.mutate(
			{
				body: {
					description: project.description,
					entityId: project.entity.id,
					maxParticipants: project.projectInfo.maxParticipants,
					name: appendCopyToProjectName(project.name),
					offeredHours: project.projectInfo.offeredHours ?? 0,
				},
			},
			{
				onSuccess: createdProject => {
					toast.success(
						t("project.projectPage.duplicate.feedback.success.title"),
						{
							description: t(
								"project.projectPage.duplicate.feedback.success.description",
								{
									name: createdProject.name,
								},
							),
						},
					);
				},
				onError: error => {
					const { title, description } = getProjectDuplicateErrorToastContent(
						t,
						error,
					);
					toast.danger(title, { description });
				},
			},
		);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteProject) {
			return;
		}

		const project = pendingDeleteProject;
		setPendingDeleteProject(null);

		schedule({
			key: project.id,
			title: t("project.projectPage.delete.undo.title"),
			description: t("project.projectPage.delete.undo.description", {
				name: project.name,
			}),
			undoLabel: t("project.projectPage.delete.undo.action"),
			onCommit: () => {
				removeProjectMutation.mutate(
					{
						id: project.id,
					},
					{
						onSuccess: () => {
							toast.success(
								t("project.projectPage.delete.feedback.success.title"),
								{
									description: t(
										"project.projectPage.delete.feedback.success.description",
										{
											name: project.name,
										},
									),
								},
							);

							editorState.clearIfMatches(project.id);
						},
						onError: error => {
							const { title, description } = getProjectDeleteErrorToastContent(
								t,
								error,
							);
							toast.danger(title, { description });
						},
					},
				);
			},
		});
	}

	function handleStatusConfirm() {
		if (!pendingStatusAction) {
			return;
		}

		const currentAction = pendingStatusAction;
		setPendingStatusAction(null);

		projectStatusMutation.mutate(
			{
				action: currentAction.action,
				id: currentAction.project.id,
			},
			{
				onSuccess: project => {
					toast.success(
						t(
							`project.projectPage.${currentAction.action}.feedback.success.title`,
						),
						{
							description: t(
								`project.projectPage.${currentAction.action}.feedback.success.description`,
								{
									name: project.name,
								},
							),
						},
					);
				},
				onError: error => {
					const { title, description } =
						getProjectStatusActionErrorToastContent(
							t,
							error,
							currentAction.action,
						);
					toast.danger(title, { description });
				},
			},
		);
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("project.projectPage.title")}
				description={t("project.projectPage.description")}
				metadata={{
					triggerLabel: t("project.projectPage.metadata.trigger"),
					emptyTitle: t("project.projectPage.metadata.empty.title"),
					emptyDescription: t("project.projectPage.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("project.projectPage.filters.clear")}
						createLabel={t("project.projectPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("project.projectPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("project.projectPage.filters.search.placeholder")}
				/>

				<ProjectsFiltersDrawer
					adminsError={adminsQuery.isError}
					createdByIds={draftFilters.createdByIds}
					creatorOptions={creatorOptions}
					dateFrom={draftFilters.dateFrom}
					dateTo={draftFilters.dateTo}
					entitiesError={entitiesQuery.isError}
					entityIds={draftFilters.entityIds}
					entityOptions={entityOptions}
					hasActiveFilters={hasAppliedFilters}
					onApply={() => {
						projectsPagination.resetPage();
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onCreatedByIdsChange={value => setDraftFilter("createdByIds", value)}
					onClear={clearAllFilters}
					onDateFromChange={value => setDraftFilter("dateFrom", value)}
					onDateToChange={value => setDraftFilter("dateTo", value)}
					onEntityIdsChange={value => setDraftFilter("entityIds", value)}
					onOpenChange={setFiltersOpen}
					onRefreshAdmins={() => {
						void adminsQuery.refetch();
					}}
					onRefreshEntities={() => {
						void entitiesQuery.refetch();
					}}
					onStatusesChange={value => setDraftFilter("statuses", value)}
					open={filtersOpen}
					statuses={draftFilters.statuses}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<ProjectResponse>
				footer={
					<ServicePagePagination
						currentPage={projectsPagination.currentPage}
						pageSize={projectsPagination.pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={projectsPagination.setCurrentPage}
						onPageSizeChange={projectsPagination.setPageSize}
						disabled={activeQueryIsLoading}
					/>
				}
				tableProps={{
					className: "h-full",
					columns,
					data: filteredProjects,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<ProjectsRowActions
							href={`/project/projects/${row.id}`}
							onDelete={setPendingDeleteProject}
							onDuplicate={handleDuplicate}
							onOpenEditor={editorState.openEditor}
							onStatusAction={(project, action) =>
								setPendingStatusAction({ action, project })
							}
							project={row}
						/>
					),
					isLoading: activeQueryIsLoading,
					loadingLabel: t("project.projectPage.loading.list"),
				}}
			/>

			<ProjectsEditorDrawer
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
				projectId={editorState.editorId}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteProject !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteProject(null);
					}
				}}
				variant="danger"
				title={t("project.projectPage.delete.confirm.title")}
				description={t("project.projectPage.delete.confirm.description", {
					name: pendingDeleteProject?.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("project.projectPage.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>

			<ServicePageConfirmDialog
				open={pendingStatusAction !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingStatusAction(null);
					}
				}}
				variant={
					pendingStatusAction
						? getStatusDialogVariant(pendingStatusAction.action)
						: "success"
				}
				title={
					pendingStatusAction
						? t(
								`project.projectPage.${pendingStatusAction.action}.confirm.title`,
							)
						: ""
				}
				description={
					pendingStatusAction
						? t(
								`project.projectPage.${pendingStatusAction.action}.confirm.description`,
								{
									name: pendingStatusAction.project.name,
								},
							)
						: ""
				}
				cancelLabel={t("common.cancel")}
				actionLabel={
					pendingStatusAction
						? t(
								`project.projectPage.table.actions.${pendingStatusAction.action}`,
							)
						: ""
				}
				onAction={handleStatusConfirm}
			/>
		</ServicePageShell>
	);
}
