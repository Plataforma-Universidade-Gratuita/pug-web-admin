"use client";

import {
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
} from "@/components/composite";
import { ProjectsEditorDrawer } from "@/features/project/projects/ProjectsEditorDrawer";
import { ProjectsRowActions } from "@/features/project/projects/ProjectsRowActions";
import {
	ProjectsPageDialogs,
	ProjectsPageFilters,
} from "@/features/project/projects/components/ProjectsPageControls";
import { useProjectsPage } from "@/features/project/projects/useProjectsPage";
import type { ProjectResponse } from "@/types/api";

export function ProjectsPage() {
	const {
		t,
		editorState,
		querySearch,
		setQuerySearch,
		frontendStatuses,
		setFrontendStatuses,
		filtersOpen,
		setFiltersOpen,
		draftFilters,
		hasAppliedFilters,
		entityOptions,
		creatorOptions,
		statusOptions,
		entitiesQuery,
		projectsQuery,
		columns,
		filteredProjects,
		activeQueryIsLoading,
		tableEmptyState,
		hasAnyFilters,
		totalElements,
		totalPages,
		projectsPagination,
		pendingDeleteProject,
		setPendingDeleteProject,
		pendingStatusAction,
		setPendingStatusAction,
		handleDeleteConfirm,
		handleDuplicate,
		handleStatusConfirm,
		clearAllFilters,
		applyDraftFilters,
		setDraftFilter,
	} = useProjectsPage();

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
				<ProjectsPageFilters
					querySearch={querySearch}
					onQuerySearchChange={setQuerySearch}
					frontendStatuses={frontendStatuses}
					onFrontendStatusesChange={setFrontendStatuses}
					statusOptions={statusOptions}
					draftFilters={draftFilters}
					filtersOpen={filtersOpen}
					hasAppliedFilters={hasAppliedFilters}
					entityOptions={entityOptions}
					creatorOptions={creatorOptions}
					entitiesError={entitiesQuery.isError}
					creatorsError={projectsQuery.isError}
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

			<ProjectsPageDialogs
				pendingDeleteProject={pendingDeleteProject}
				pendingStatusAction={pendingStatusAction}
				onDeleteOpenChange={open => {
					if (!open) {
						setPendingDeleteProject(null);
					}
				}}
				onStatusOpenChange={open => {
					if (!open) {
						setPendingStatusAction(null);
					}
				}}
				onDeleteConfirm={handleDeleteConfirm}
				onStatusConfirm={handleStatusConfirm}
			/>
		</ServicePageShell>
	);
}
