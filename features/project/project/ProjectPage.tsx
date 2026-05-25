"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { useAdminsQuery } from "@/features/identity/admin/queries";
import { useEntitiesQuery } from "@/features/partner/entity/queries";
import { ProjectDetailDialog } from "@/features/project/project/ProjectDetailDialog";
import { ProjectEditorDrawer } from "@/features/project/project/ProjectEditorDrawer";
import { ProjectFiltersDrawer } from "@/features/project/project/ProjectFiltersDrawer";
import { ProjectRowActions } from "@/features/project/project/ProjectRowActions";
import {
	useProjectStatusMutation,
	useRemoveProjectMutation,
} from "@/features/project/project/mutations";
import {
	useProjectDetailQuery,
	useProjectsQuery,
	useProjectSchoolsQuery,
} from "@/features/project/project/queries";
import {
	buildProjectCreatorOptions,
	buildProjectEntityOptions,
	createProjectColumns,
	filterProjects,
	getProjectAdminsErrorToastContent,
	getProjectDeleteErrorToastContent,
	getProjectDetailErrorToastContent,
	getProjectEmptyStateCopy,
	getProjectEntitiesErrorToastContent,
	getProjectFilterSummary,
	getProjectsListErrorToastContent,
	getProjectSchoolsErrorToastContent,
	getProjectStatusActionErrorToastContent,
} from "@/features/project/project/utils";
import {
	ServicePageConfirmDialog,
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDeferredUndoAction,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageDetailState,
	useServicePageEditorState,
} from "@/hooks";
import type { ProjectResponse } from "@/types";
import type {
	ProjectEditorMode,
	ProjectSecondaryFilters,
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

export function ProjectPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<ProjectSecondaryFilters>(
		() => ({
			createdByFilter: "",
			dateField: "",
			endDate: "",
			entityIdFilter: "",
			startDate: "",
			statusFilter: "",
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
	} = useDraftFilters<ProjectSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const detailState = useServicePageDetailState();
	const editorState = useServicePageEditorState<ProjectEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingDeleteProject, setPendingDeleteProject] =
		useState<ProjectResponse | null>(null);
	const [pendingStatusAction, setPendingStatusAction] = useState<{
		action: ProjectStatusAction;
		project: ProjectResponse;
	} | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const projectsQuery = useProjectsQuery();
	const projectDetailQuery = useProjectDetailQuery(detailState.selectedId);
	const projectSchoolsQuery = useProjectSchoolsQuery(detailState.selectedId);
	const entitiesQuery = useEntitiesQuery();
	const adminsQuery = useAdminsQuery();
	const removeProjectMutation = useRemoveProjectMutation();
	const projectStatusMutation = useProjectStatusMutation();
	const { schedule } = useDeferredUndoAction();

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
	const entityOptions = useMemo(
		() => buildProjectEntityOptions(entitiesQuery.data ?? []),
		[entitiesQuery.data],
	);
	const creatorOptions = useMemo(
		() => buildProjectCreatorOptions(adminsQuery.data ?? []),
		[adminsQuery.data],
	);
	const filteredProjects = useMemo(
		() =>
			filterProjects(projectsQuery.data ?? [], {
				adminById,
				createdByFilter: appliedFilters.createdByFilter,
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				entityById,
				entityIdFilter: appliedFilters.entityIdFilter,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
				statusFilter: appliedFilters.statusFilter,
			}),
		[
			adminById,
			appliedFilters,
			deferredQuerySearch,
			entityById,
			projectsQuery.data,
		],
	);
	const columns = useMemo(
		() => createProjectColumns(t, entityById, adminById),
		[adminById, entityById, t],
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getProjectFilterSummary(t, {
				adminById,
				createdByFilter: appliedFilters.createdByFilter,
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				entityById,
				entityIdFilter: appliedFilters.entityIdFilter,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
				statusFilter: appliedFilters.statusFilter,
			}),
		[adminById, appliedFilters, deferredQuerySearch, entityById, t],
	);
	const emptyStateCopy = useMemo(
		() => getProjectEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (projectsQuery.isError) {
			return (
				<SomeErrorState
					title={t("project.projectPage.table.error.title")}
					description={t("project.projectPage.table.error.description")}
					onRefresh={() => {
						void projectsQuery.refetch();
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
	}, [emptyStateCopy.description, emptyStateCopy.title, projectsQuery, t]);

	useQueryErrorToasts([
		{
			key: "projects-list",
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getProjectsListErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: "projects-detail",
			error: projectDetailQuery.error,
			errorUpdatedAt: projectDetailQuery.errorUpdatedAt,
			getContent: error => getProjectDetailErrorToastContent(t, error),
			isError: projectDetailQuery.isError,
		},
		{
			key: "projects-schools",
			error: projectSchoolsQuery.error,
			errorUpdatedAt: projectSchoolsQuery.errorUpdatedAt,
			getContent: error => getProjectSchoolsErrorToastContent(t, error),
			isError: projectSchoolsQuery.isError,
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
		setFiltersOpen(false);
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

							detailState.clearIfMatches(project.id);
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

				<ProjectFiltersDrawer
					adminsError={adminsQuery.isError}
					createdByFilter={draftFilters.createdByFilter}
					creatorOptions={creatorOptions}
					dateField={draftFilters.dateField}
					endDate={draftFilters.endDate}
					entitiesError={entitiesQuery.isError}
					entityIdFilter={draftFilters.entityIdFilter}
					entityOptions={entityOptions}
					hasActiveFilters={hasAppliedFilters}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onCreatedByFilterChange={value =>
						setDraftFilter("createdByFilter", value)
					}
					onClear={clearAllFilters}
					onDateFieldChange={value => setDraftFilter("dateField", value)}
					onEndDateChange={value => setDraftFilter("endDate", value)}
					onEntityIdFilterChange={value =>
						setDraftFilter("entityIdFilter", value)
					}
					onOpenChange={setFiltersOpen}
					onRefreshAdmins={() => {
						void adminsQuery.refetch();
					}}
					onRefreshEntities={() => {
						void entitiesQuery.refetch();
					}}
					onStartDateChange={value => setDraftFilter("startDate", value)}
					onStatusFilterChange={value => setDraftFilter("statusFilter", value)}
					open={filtersOpen}
					startDate={draftFilters.startDate}
					statusFilter={draftFilters.statusFilter}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<ProjectResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredProjects,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<ProjectRowActions
							onDelete={setPendingDeleteProject}
							onOpenEditor={editorState.openEditor}
							onStatusAction={(project, action) =>
								setPendingStatusAction({ action, project })
							}
							onView={detailState.openDetail}
							project={row}
						/>
					),
					isLoading: projectsQuery.isLoading,
					loadingLabel: t("project.projectPage.loading.list"),
				}}
			/>

			<ProjectEditorDrawer
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
				projectId={editorState.editorId}
			/>

			<ProjectDetailDialog
				adminById={adminById}
				entityById={entityById}
				error={projectDetailQuery.error}
				isError={projectDetailQuery.isError}
				isLoading={projectDetailQuery.isLoading}
				onOpenChange={detailState.handleOpenChange}
				onRefresh={() => {
					void projectDetailQuery.refetch();
				}}
				onRefreshSchools={() => {
					void projectSchoolsQuery.refetch();
				}}
				open={detailState.isOpen}
				project={projectDetailQuery.data}
				schools={projectSchoolsQuery.data}
				schoolsIsError={projectSchoolsQuery.isError}
				schoolsIsLoading={projectSchoolsQuery.isLoading}
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
