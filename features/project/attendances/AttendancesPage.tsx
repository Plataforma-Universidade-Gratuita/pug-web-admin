"use client";

import {
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
} from "@/components";
import { AttendanceEditorDrawer } from "@/features/project/attendances/AttendanceEditorDrawer";
import { AttendancesRowActions } from "@/features/project/attendances/AttendancesRowActions";
import {
	AttendancesPageDialogs,
	AttendancesPageFilters,
} from "@/features/project/attendances/components/AttendancesPageControls";
import { useAttendancesPage } from "@/features/project/attendances/useAttendancesPage";
import type { AttendanceDirectoryItem } from "@/types";

export function AttendancesPage() {
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
		validatorOptions,
		statusOptions,
		projectsQuery,
		formerStudentsQuery,
		accountsQuery,
		usersQuery,
		columns,
		filteredAttendances,
		activeQueryIsLoading,
		tableEmptyState,
		hasAnyFilters,
		totalElements,
		totalPages,
		attendancesPagination,
		qrDialogAttendance,
		setQrDialogAttendance,
		pendingDeleteAttendance,
		setPendingDeleteAttendance,
		pendingValidation,
		setPendingValidation,
		handleDeleteConfirm,
		handleValidationConfirm,
		clearAllFilters,
		applyDraftFilters,
		setDraftFilter,
	} = useAttendancesPage();

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("project.attendancePage.title")}
				description={t("project.attendancePage.description")}
				metadata={{
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t(
						"project.attendancePage.metadata.empty.description",
					),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("common.filters.clear")}
						createLabel={t("project.attendancePage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<AttendancesPageFilters
					querySearch={querySearch}
					onQuerySearchChange={setQuerySearch}
					frontendStatuses={frontendStatuses}
					onFrontendStatusesChange={setFrontendStatuses}
					statusOptions={statusOptions}
					draftFilters={draftFilters}
					filtersOpen={filtersOpen}
					projectOptions={projectOptions}
					formerStudentOptions={formerStudentOptions}
					validatorOptions={validatorOptions}
					hasAppliedFilters={hasAppliedFilters}
					projectsError={projectsQuery.isError}
					formerStudentsError={formerStudentsQuery.isError}
					validatorsError={accountsQuery.isError}
					onApply={() => {
						attendancesPagination.resetPage();
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
					onRefreshValidators={() => {
						void accountsQuery.refetch();
					}}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<AttendanceDirectoryItem>
				footer={
					<ServicePagePagination
						currentPage={attendancesPagination.currentPage}
						pageSize={attendancesPagination.pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={attendancesPagination.setCurrentPage}
						onPageSizeChange={attendancesPagination.setPageSize}
						disabled={activeQueryIsLoading}
					/>
				}
				tableProps={{
					className: "h-full",
					columns,
					data: filteredAttendances,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<AttendancesRowActions
							attendance={row}
							href={`/project/attendances/${row.id}`}
							onDelete={setPendingDeleteAttendance}
							onValidate={(attendance, action) =>
								setPendingValidation({ action, attendance })
							}
							onViewQrCode={setQrDialogAttendance}
						/>
					),
					isLoading:
						activeQueryIsLoading ||
						projectsQuery.isLoading ||
						formerStudentsQuery.isLoading ||
						accountsQuery.isLoading ||
						usersQuery.isLoading,
					loadingLabel: t("project.attendancePage.loading.list"),
				}}
			/>

			<AttendanceEditorDrawer
				mode="create"
				onOpenChange={editorState.handleOpenChange}
				open={editorState.isOpen}
				attendanceId={null}
			/>

			<AttendancesPageDialogs
				qrDialogAttendance={qrDialogAttendance}
				pendingDeleteAttendance={pendingDeleteAttendance}
				pendingValidation={pendingValidation}
				onQrDialogOpenChange={open => {
					if (!open) {
						setQrDialogAttendance(null);
					}
				}}
				onDeleteOpenChange={open => {
					if (!open) {
						setPendingDeleteAttendance(null);
					}
				}}
				onValidationOpenChange={open => {
					if (!open) {
						setPendingValidation(null);
					}
				}}
				onDeleteConfirm={handleDeleteConfirm}
				onValidationConfirm={handleValidationConfirm}
			/>
		</ServicePageShell>
	);
}
