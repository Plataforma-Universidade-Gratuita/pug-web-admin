"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { useStudentsQuery } from "@/features/academic/student/queries";
import { useAdminsQuery } from "@/features/identity/admins/queries";
import { AttendanceCreateDrawer } from "@/features/project/attendance/AttendanceCreateDrawer";
import { AttendanceDetailDialog } from "@/features/project/attendance/AttendanceDetailDialog";
import { AttendanceFiltersDrawer } from "@/features/project/attendance/AttendanceFiltersDrawer";
import { AttendanceRowActions } from "@/features/project/attendance/AttendanceRowActions";
import {
	useRemoveAttendanceMutation,
	useValidateAttendanceMutation,
} from "@/features/project/attendance/mutations";
import {
	useAttendanceDetailQuery,
	useAttendancesQuery,
} from "@/features/project/attendance/queries";
import {
	buildAttendanceProjectOptions,
	buildAttendanceStudentOptions,
	createAttendanceColumns,
	filterAttendances,
	getAttendanceAdminsErrorToastContent,
	getAttendanceDeleteErrorToastContent,
	getAttendanceDetailErrorToastContent,
	getAttendanceEmptyStateCopy,
	getAttendanceFilterSummary,
	getAttendanceProjectsErrorToastContent,
	getAttendancesListErrorToastContent,
	getAttendanceStudentsErrorToastContent,
	getAttendanceValidateErrorToastContent,
	resolveAttendanceProjectLabel,
	resolveAttendanceStudentLabel,
} from "@/features/project/attendance/utils";
import { useProjectsQuery } from "@/features/project/project/queries";
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
} from "@/hooks";
import type { AttendanceResponse } from "@/types";
import type {
	AttendanceSecondaryFilters,
	AttendanceValidationAction,
} from "@/types";

function getValidationVariant(action: AttendanceValidationAction) {
	return action === "markPresent" ? "success" : "warning";
}

export function AttendancePage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const initialSecondaryFilters = useMemo<AttendanceSecondaryFilters>(
		() => ({
			dateField: "",
			endDate: "",
			projectIdFilter: "",
			startDate: "",
			statusFilter: "",
			studentIdFilter: "",
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
	} = useDraftFilters<AttendanceSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const detailState = useServicePageDetailState();
	const [pendingDeleteAttendance, setPendingDeleteAttendance] =
		useState<AttendanceResponse | null>(null);
	const [pendingValidation, setPendingValidation] = useState<{
		action: AttendanceValidationAction;
		attendance: AttendanceResponse;
	} | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const attendancesQuery = useAttendancesQuery();
	const attendanceDetailQuery = useAttendanceDetailQuery(
		detailState.selectedId,
	);
	const projectsQuery = useProjectsQuery();
	const studentsQuery = useStudentsQuery();
	const adminsQuery = useAdminsQuery();
	const removeAttendanceMutation = useRemoveAttendanceMutation();
	const validateAttendanceMutation = useValidateAttendanceMutation();
	const { schedule } = useDeferredUndoAction();

	const projectById = useMemo(
		() =>
			new Map((projectsQuery.data ?? []).map(project => [project.id, project])),
		[projectsQuery.data],
	);
	const studentById = useMemo(
		() =>
			new Map(
				(studentsQuery.data ?? []).map(student => [student.accountId, student]),
			),
		[studentsQuery.data],
	);
	const adminById = useMemo(
		() =>
			new Map((adminsQuery.data ?? []).map(admin => [admin.accountId, admin])),
		[adminsQuery.data],
	);
	const projectOptions = useMemo(
		() => buildAttendanceProjectOptions(projectsQuery.data ?? []),
		[projectsQuery.data],
	);
	const studentOptions = useMemo(
		() => buildAttendanceStudentOptions(studentsQuery.data ?? []),
		[studentsQuery.data],
	);
	const filteredAttendances = useMemo(
		() =>
			filterAttendances(attendancesQuery.data ?? [], {
				adminById,
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				projectById,
				projectIdFilter: appliedFilters.projectIdFilter,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
				statusFilter: appliedFilters.statusFilter,
				studentById,
				studentIdFilter: appliedFilters.studentIdFilter,
			}),
		[
			adminById,
			appliedFilters,
			attendancesQuery.data,
			deferredQuerySearch,
			projectById,
			studentById,
		],
	);
	const columns = useMemo(
		() => createAttendanceColumns(t, projectById, studentById, adminById),
		[adminById, projectById, studentById, t],
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getAttendanceFilterSummary(t, {
				adminById,
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				projectById,
				projectIdFilter: appliedFilters.projectIdFilter,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
				statusFilter: appliedFilters.statusFilter,
				studentById,
				studentIdFilter: appliedFilters.studentIdFilter,
			}),
		[
			adminById,
			appliedFilters,
			deferredQuerySearch,
			projectById,
			studentById,
			t,
		],
	);
	const emptyStateCopy = useMemo(
		() => getAttendanceEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (attendancesQuery.isError) {
			return (
				<SomeErrorState
					title={t("project.attendancePage.table.error.title")}
					description={t("project.attendancePage.table.error.description")}
					onRefresh={() => {
						void attendancesQuery.refetch();
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
	}, [attendancesQuery, emptyStateCopy.description, emptyStateCopy.title, t]);

	useQueryErrorToasts([
		{
			key: "attendances-list",
			error: attendancesQuery.error,
			errorUpdatedAt: attendancesQuery.errorUpdatedAt,
			getContent: error => getAttendancesListErrorToastContent(t, error),
			isError: attendancesQuery.isError,
		},
		{
			key: "attendance-detail",
			error: attendanceDetailQuery.error,
			errorUpdatedAt: attendanceDetailQuery.errorUpdatedAt,
			getContent: error => getAttendanceDetailErrorToastContent(t, error),
			isError: attendanceDetailQuery.isError,
		},
		{
			key: "attendance-projects",
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getAttendanceProjectsErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: "attendance-students",
			error: studentsQuery.error,
			errorUpdatedAt: studentsQuery.errorUpdatedAt,
			getContent: error => getAttendanceStudentsErrorToastContent(t, error),
			isError: studentsQuery.isError,
		},
		{
			key: "attendance-admins",
			error: adminsQuery.error,
			errorUpdatedAt: adminsQuery.errorUpdatedAt,
			getContent: error => getAttendanceAdminsErrorToastContent(t, error),
			isError: adminsQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearDraftFilters();
		setFiltersOpen(false);
	}

	function getAttendanceLabels(attendance: AttendanceResponse) {
		return {
			project: resolveAttendanceProjectLabel(projectById, attendance.projectId),
			student: resolveAttendanceStudentLabel(studentById, attendance.studentId),
		};
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteAttendance) {
			return;
		}

		const attendance = pendingDeleteAttendance;
		const labels = getAttendanceLabels(attendance);
		setPendingDeleteAttendance(null);

		schedule({
			key: attendance.id,
			title: t("project.attendancePage.delete.undo.title"),
			description: t("project.attendancePage.delete.undo.description", {
				...labels,
				id: attendance.id,
			}),
			undoLabel: t("project.attendancePage.delete.undo.action"),
			onCommit: () => {
				removeAttendanceMutation.mutate(
					{
						id: attendance.id,
					},
					{
						onSuccess: () => {
							toast.success(
								t("project.attendancePage.delete.feedback.success.title"),
								{
									description: t(
										"project.attendancePage.delete.feedback.success.description",
										{
											...labels,
											id: attendance.id,
										},
									),
								},
							);

							detailState.clearIfMatches(attendance.id);
						},
						onError: error => {
							const { title, description } =
								getAttendanceDeleteErrorToastContent(t, error);
							toast.danger(title, { description });
						},
					},
				);
			},
		});
	}

	function handleValidationConfirm() {
		if (!pendingValidation) {
			return;
		}

		const currentAction = pendingValidation;
		const labels = getAttendanceLabels(currentAction.attendance);
		setPendingValidation(null);

		validateAttendanceMutation.mutate(
			{
				id: currentAction.attendance.id,
				body: {
					qrValidationHash: currentAction.attendance.qrValidationHash,
					status: currentAction.action === "markPresent" ? "PRESENT" : "ABSENT",
				},
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							`project.attendancePage.${currentAction.action}.feedback.success.title`,
						),
						{
							description: t(
								`project.attendancePage.${currentAction.action}.feedback.success.description`,
								labels,
							),
						},
					);
				},
				onError: error => {
					const { title, description } = getAttendanceValidateErrorToastContent(
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
				title={t("project.attendancePage.title")}
				description={t("project.attendancePage.description")}
				metadata={{
					triggerLabel: t("project.attendancePage.metadata.trigger"),
					emptyTitle: t("project.attendancePage.metadata.empty.title"),
					emptyDescription: t(
						"project.attendancePage.metadata.empty.description",
					),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("project.attendancePage.filters.clear")}
						createLabel={t("project.attendancePage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={() => setIsCreateOpen(true)}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("project.attendancePage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("project.attendancePage.filters.search.placeholder")}
				/>

				<AttendanceFiltersDrawer
					dateField={draftFilters.dateField}
					endDate={draftFilters.endDate}
					hasActiveFilters={hasAppliedFilters}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onClear={clearAllFilters}
					onDateFieldChange={value => setDraftFilter("dateField", value)}
					onEndDateChange={value => setDraftFilter("endDate", value)}
					onOpenChange={setFiltersOpen}
					onProjectIdFilterChange={value =>
						setDraftFilter("projectIdFilter", value)
					}
					onRefreshProjects={() => {
						void projectsQuery.refetch();
					}}
					onRefreshStudents={() => {
						void studentsQuery.refetch();
					}}
					onStartDateChange={value => setDraftFilter("startDate", value)}
					onStatusFilterChange={value => setDraftFilter("statusFilter", value)}
					onStudentIdFilterChange={value =>
						setDraftFilter("studentIdFilter", value)
					}
					open={filtersOpen}
					projectIdFilter={draftFilters.projectIdFilter}
					projectOptions={projectOptions}
					projectsError={projectsQuery.isError}
					startDate={draftFilters.startDate}
					statusFilter={draftFilters.statusFilter}
					studentIdFilter={draftFilters.studentIdFilter}
					studentOptions={studentOptions}
					studentsError={studentsQuery.isError}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<AttendanceResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredAttendances,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<AttendanceRowActions
							attendance={row}
							onDelete={setPendingDeleteAttendance}
							onValidate={(attendance, action) =>
								setPendingValidation({ action, attendance })
							}
							onView={detailState.openDetail}
						/>
					),
					isLoading: attendancesQuery.isLoading,
					loadingLabel: t("project.attendancePage.loading.list"),
				}}
			/>

			<AttendanceCreateDrawer
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
			/>

			<AttendanceDetailDialog
				adminById={adminById}
				attendance={attendanceDetailQuery.data}
				error={attendanceDetailQuery.error}
				isError={attendanceDetailQuery.isError}
				isLoading={attendanceDetailQuery.isLoading}
				onOpenChange={detailState.handleOpenChange}
				onRefresh={() => {
					void attendanceDetailQuery.refetch();
				}}
				open={detailState.isOpen}
				projectById={projectById}
				studentById={studentById}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteAttendance !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteAttendance(null);
					}
				}}
				variant="danger"
				title={t("project.attendancePage.delete.confirm.title")}
				description={t("project.attendancePage.delete.confirm.description", {
					id: pendingDeleteAttendance?.id ?? "",
					project: pendingDeleteAttendance
						? resolveAttendanceProjectLabel(
								projectById,
								pendingDeleteAttendance.projectId,
							)
						: "",
					student: pendingDeleteAttendance
						? resolveAttendanceStudentLabel(
								studentById,
								pendingDeleteAttendance.studentId,
							)
						: "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("project.attendancePage.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>

			<ServicePageConfirmDialog
				open={pendingValidation !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingValidation(null);
					}
				}}
				variant={
					pendingValidation
						? getValidationVariant(pendingValidation.action)
						: "success"
				}
				title={
					pendingValidation
						? t(
								`project.attendancePage.${pendingValidation.action}.confirm.title`,
							)
						: ""
				}
				description={
					pendingValidation
						? t(
								`project.attendancePage.${pendingValidation.action}.confirm.description`,
								getAttendanceLabels(pendingValidation.attendance),
							)
						: ""
				}
				cancelLabel={t("common.cancel")}
				actionLabel={
					pendingValidation
						? t(
								`project.attendancePage.table.actions.${pendingValidation.action}`,
							)
						: ""
				}
				onAction={handleValidationConfirm}
			/>
		</ServicePageShell>
	);
}
