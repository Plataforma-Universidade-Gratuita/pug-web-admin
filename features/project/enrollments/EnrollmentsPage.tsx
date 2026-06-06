"use client";

import {
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
} from "@/components";
import { EnrollmentEditorDrawer } from "@/features/project/enrollments/EnrollmentEditorDrawer";
import { EnrollmentsRowActions } from "@/features/project/enrollments/EnrollmentsRowActions";
import {
	EnrollmentsPageDialogs,
	EnrollmentsPageFilters,
} from "@/features/project/enrollments/components/EnrollmentsPageControls";
import { useEnrollmentsPage } from "@/features/project/enrollments/useEnrollmentsPage";
import { createEnrollmentCompositeKey } from "@/features/project/enrollments/utils";
import type { EnrollmentDirectoryItem } from "@/types";

export function EnrollmentsPage() {
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
		projectOptions,
		formerStudentOptions,
		statusOptions,
		projectsQuery,
		formerStudentsQuery,
		columns,
		filteredEnrollments,
		activeQueryIsLoading,
		tableEmptyState,
		hasAnyFilters,
		totalElements,
		totalPages,
		enrollmentsPagination,
		pendingDeleteEnrollment,
		setPendingDeleteEnrollment,
		pendingStatusAction,
		setPendingStatusAction,
		handleDeleteConfirm,
		handleStatusConfirm,
		clearAllFilters,
		applyDraftFilters,
		setDraftFilter,
	} = useEnrollmentsPage();

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("project.enrollmentPage.title")}
				description={t("project.enrollmentPage.description")}
				metadata={{
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t(
						"project.enrollmentPage.metadata.empty.description",
					),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("common.filters.clear")}
						createLabel={t("project.enrollmentPage.create.trigger")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<EnrollmentsPageFilters
					querySearch={querySearch}
					onQuerySearchChange={setQuerySearch}
					frontendStatuses={frontendStatuses}
					onFrontendStatusesChange={setFrontendStatuses}
					statusOptions={statusOptions}
					draftFilters={draftFilters}
					filtersOpen={filtersOpen}
					projectOptions={projectOptions}
					formerStudentOptions={formerStudentOptions}
					hasAppliedFilters={hasAppliedFilters}
					projectsError={projectsQuery.isError}
					formerStudentsError={formerStudentsQuery.isError}
					onApply={() => {
						enrollmentsPagination.resetPage();
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onClear={clearAllFilters}
					onFilterChange={(key, value) => setDraftFilter(key, value)}
					onOpenChange={setFiltersOpen}
					onRefreshFormerStudents={() => {
						void formerStudentsQuery.refetch();
					}}
					onRefreshProjects={() => {
						void projectsQuery.refetch();
					}}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<EnrollmentDirectoryItem>
				footer={
					<ServicePagePagination
						currentPage={enrollmentsPagination.currentPage}
						pageSize={enrollmentsPagination.pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={enrollmentsPagination.setCurrentPage}
						onPageSizeChange={enrollmentsPagination.setPageSize}
						disabled={activeQueryIsLoading}
					/>
				}
				tableProps={{
					className: "h-full",
					columns,
					data: filteredEnrollments,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<EnrollmentsRowActions
							href={`/project/enrollments/${createEnrollmentCompositeKey(
								row.project.id,
								row.student.account.id,
							)}`}
							onDelete={setPendingDeleteEnrollment}
							onStatusAction={(enrollment, action) =>
								setPendingStatusAction({ action, enrollment })
							}
							enrollment={row}
						/>
					),
					isLoading: activeQueryIsLoading,
					loadingLabel: t("project.enrollmentPage.loading.list"),
				}}
			/>

			<EnrollmentEditorDrawer
				mode="create"
				onOpenChange={editorState.handleOpenChange}
				open={editorState.isOpen}
				enrollmentId={null}
			/>

			<EnrollmentsPageDialogs
				pendingDeleteEnrollment={pendingDeleteEnrollment}
				pendingStatusAction={pendingStatusAction}
				onDeleteOpenChange={open => {
					if (!open) {
						setPendingDeleteEnrollment(null);
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
