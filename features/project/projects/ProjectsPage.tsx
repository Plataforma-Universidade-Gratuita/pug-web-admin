"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Combobox,
	Label,
	NoContentState,
	SomeErrorState,
	toast,
} from "@/components";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
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
	buildProjectCreatorOptions,
	buildProjectEntityOptions,
	createProjectColumns,
	filterProjectsByBackendFilters,
	filterProjectsByFrontendFilters,
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
	ProjectStatus,
	ProjectStatusAction,
} from "@/types";
import { appendCopyToText } from "@/utils";

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
	const [frontendStatuses, setFrontendStatuses] = useState<ProjectStatus[]>([]);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialBackendFilters = useMemo<ProjectComplexSearchFilters>(
		() => ({
			name: "",
			entityIds: [],
			description: "",
			createdByIds: [],
			statuses: [],
			maxOfferedHours: "",
			minOfferedHours: "",
			dateFrom: "",
			dateTo: "",
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
	const projectsQuery = useProjectsQuery();
	const projectsSearchQuery = useProjectsSearchQuery(
		projectsPagination.backendPage ?? 0,
		projectsPagination.backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters,
		!projectsPagination.isAll,
	);
	const entitiesQuery = useEntitiesQuery();
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
	const entityOptions = useMemo(
		() => buildProjectEntityOptions(entitiesQuery.data ?? []),
		[entitiesQuery.data],
	);
	const creatorOptions = useMemo(
		() =>
			projectsQuery.data
				? buildProjectCreatorOptions(
						Array.from(
							new Map(
								projectsQuery.data.map(project => [
									project.projectInfo.createdBy.id,
									project.projectInfo.createdBy,
								]),
							).values(),
						),
					)
				: [],
		[projectsQuery.data],
	);
	const statusOptions = useMemo(
		() =>
			["PLANNED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELED"].map(
				status => ({
					value: status as ProjectStatus,
					label: t(`project.projectPage.status.options.${status}`),
				}),
			),
		[t],
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
				query: deferredQuerySearch,
				statuses: frontendStatuses,
			}),
		[deferredQuerySearch, frontendStatuses, tableSourceProjects],
	);
	const columns = useMemo(() => createProjectColumns(t), [t]);
	const hasAnyFilters = Boolean(
		querySearch.trim() || frontendStatuses.length > 0 || hasAppliedFilters,
	);
	const filterSummary = useMemo(
		() =>
			getProjectFilterSummary(t, {
				dateFrom: appliedFilters.dateFrom,
				dateTo: appliedFilters.dateTo,
				description: appliedFilters.description,
				entityById,
				entityIds: appliedFilters.entityIds,
				maxOfferedHours: appliedFilters.maxOfferedHours,
				minOfferedHours: appliedFilters.minOfferedHours,
				name: appliedFilters.name,
				query: deferredQuerySearch,
				statuses: appliedFilters.statuses,
			}),
		[appliedFilters, deferredQuerySearch, entityById, t],
	);
	const emptyStateCopy = useMemo(
		() => getProjectEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (activeQueryIsError) {
			return (
				<SomeErrorState
					title={t("common.loadErrors.projects.title")}
					description={t("common.loadErrors.projects.description")}
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
	]);

	function clearAllFilters() {
		setQuerySearch("");
		setFrontendStatuses([]);
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
					name: appendCopyToText(project.name),
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
			undoLabel: t("common.actions.undo"),
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
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t("common.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("common.filters.clear")}
						createLabel={t("project.projectPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] xl:items-end"
			>
				<TextFieldFilter
					label={t("project.projectPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("project.projectPage.filters.search.placeholder")}
				/>

				<div className="grid gap-2">
					<Label>{t("common.fields.status")}</Label>
					<Combobox
						multiple
						options={statusOptions}
						values={frontendStatuses}
						onValuesChange={value =>
							setFrontendStatuses(value as ProjectStatus[])
						}
						placeholder="Select..."
						maxVisibleValues={1}
					/>
				</div>

				<ProjectsFiltersDrawer
					creatorsError={projectsQuery.isError}
					createdByIds={draftFilters.createdByIds}
					creatorOptions={creatorOptions}
					dateFrom={draftFilters.dateFrom}
					dateTo={draftFilters.dateTo}
					description={draftFilters.description}
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
					onDescriptionChange={value => setDraftFilter("description", value)}
					onEntityIdsChange={value => setDraftFilter("entityIds", value)}
					onMaxOfferedHoursChange={value =>
						setDraftFilter("maxOfferedHours", value)
					}
					onMinOfferedHoursChange={value =>
						setDraftFilter("minOfferedHours", value)
					}
					onNameChange={value => setDraftFilter("name", value)}
					onOpenChange={setFiltersOpen}
					onRefreshCreators={() => {
						void projectsQuery.refetch();
					}}
					onRefreshEntities={() => {
						void entitiesQuery.refetch();
					}}
					onStatusesChange={value => setDraftFilter("statuses", value)}
					open={filtersOpen}
					statuses={draftFilters.statuses}
					maxOfferedHours={draftFilters.maxOfferedHours}
					minOfferedHours={draftFilters.minOfferedHours}
					name={draftFilters.name}
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
				actionLabel={t("common.table.actions.delete")}
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
