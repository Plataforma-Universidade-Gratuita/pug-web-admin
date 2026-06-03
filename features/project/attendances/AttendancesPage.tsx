"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { useFormerStudentsQuery } from "@/features/academic/former-students/queries";
import { useAccountsQuery } from "@/features/identity/accounts/queries";
import { useUsersQuery } from "@/features/identity/users/queries";
import { AttendancesCreateDrawer } from "@/features/project/attendances/AttendancesCreateDrawer";
import { AttendancesFiltersDrawer } from "@/features/project/attendances/AttendancesFiltersDrawer";
import { AttendancesRowActions } from "@/features/project/attendances/AttendancesRowActions";
import {
	useRemoveAttendanceMutation,
	useValidateAttendanceMutation,
} from "@/features/project/attendances/mutations";
import { useAttendancesQuery } from "@/features/project/attendances/queries";
import {
	buildAttendanceFormerStudentOptions,
	buildAttendanceProjectOptions,
	createAttendanceColumns,
	filterAttendances,
	getAttendanceAdminsErrorToastContent,
	getAttendanceDeleteErrorToastContent,
	getAttendanceEmptyStateCopy,
	getAttendanceFilterSummary,
	getAttendanceProjectsErrorToastContent,
	getAttendancesListErrorToastContent,
	getAttendanceStudentsErrorToastContent,
	getAttendanceValidateErrorToastContent,
	resolveAttendanceFormerStudentLabel,
	resolveAttendanceProjectLabel,
} from "@/features/project/attendances/utils";
import { useProjectsQuery } from "@/features/project/projects/queries";
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
} from "@/hooks";
import type { AttendanceResponse } from "@/types";
import type {
	AttendanceSecondaryFilters,
	AttendanceValidationAction,
} from "@/types";

function getValidationVariant(action: AttendanceValidationAction) {
	return action === "markPresent" ? "success" : "warning";
}

export function AttendancesPage() {
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
			formerStudentIdFilter: "",
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
	const [pendingDeleteAttendance, setPendingDeleteAttendance] =
		useState<AttendanceResponse | null>(null);
	const [pendingValidation, setPendingValidation] = useState<{
		action: AttendanceValidationAction;
		attendance: AttendanceResponse;
	} | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const attendancesQuery = useAttendancesQuery();
	const projectsQuery = useProjectsQuery();
	const formerStudentsQuery = useFormerStudentsQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const removeAttendanceMutation = useRemoveAttendanceMutation();
	const validateAttendanceMutation = useValidateAttendanceMutation();
	const { schedule } = useDeferredUndoAction();

	const projectById = useMemo(
		() =>
			new Map((projectsQuery.data ?? []).map(project => [project.id, project])),
		[projectsQuery.data],
	);
	const formerStudentById = useMemo(
		() =>
			new Map(
				(formerStudentsQuery.data ?? []).map(formerStudent => [
					formerStudent.accountId,
					formerStudent,
				]),
			),
		[formerStudentsQuery.data],
	);
	const accountById = useMemo(
		() =>
			new Map((accountsQuery.data ?? []).map(account => [account.id, account])),
		[accountsQuery.data],
	);
	const userById = useMemo(
		() => new Map((usersQuery.data ?? []).map(user => [user.id, user])),
		[usersQuery.data],
	);
	const projectOptions = useMemo(
		() => buildAttendanceProjectOptions(projectsQuery.data ?? []),
		[projectsQuery.data],
	);
	const formerStudentOptions = useMemo(
		() =>
			buildAttendanceFormerStudentOptions(
				formerStudentsQuery.data ?? [],
				accountById,
				userById,
			),
		[accountById, formerStudentsQuery.data, userById],
	);
	const filteredAttendances = useMemo(
		() =>
			filterAttendances(attendancesQuery.data ?? [], {
				accountById,
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				projectById,
				projectIdFilter: appliedFilters.projectIdFilter,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
				statusFilter: appliedFilters.statusFilter,
				formerStudentById,
				formerStudentIdFilter: appliedFilters.formerStudentIdFilter,
				userById,
			}),
		[
			accountById,
			appliedFilters,
			attendancesQuery.data,
			deferredQuerySearch,
			formerStudentById,
			projectById,
			userById,
		],
	);
	const columns = useMemo(
		() =>
			createAttendanceColumns(
				t,
				projectById,
				formerStudentById,
				accountById,
				userById,
			),
		[accountById, formerStudentById, projectById, t, userById],
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getAttendanceFilterSummary(t, {
				accountById,
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				projectById,
				projectIdFilter: appliedFilters.projectIdFilter,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
				statusFilter: appliedFilters.statusFilter,
				formerStudentById,
				formerStudentIdFilter: appliedFilters.formerStudentIdFilter,
				userById,
			}),
		[
			accountById,
			appliedFilters,
			deferredQuerySearch,
			formerStudentById,
			projectById,
			t,
			userById,
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
			key: "attendance-projects",
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getAttendanceProjectsErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: "attendance-students",
			error: formerStudentsQuery.error,
			errorUpdatedAt: formerStudentsQuery.errorUpdatedAt,
			getContent: error => getAttendanceStudentsErrorToastContent(t, error),
			isError: formerStudentsQuery.isError,
		},
		{
			key: "attendance-admins",
			error: accountsQuery.error,
			errorUpdatedAt: accountsQuery.errorUpdatedAt,
			getContent: error => getAttendanceAdminsErrorToastContent(t, error),
			isError: accountsQuery.isError,
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
			student: resolveAttendanceFormerStudentLabel(
				formerStudentById,
				accountById,
				userById,
				attendance.formerStudentId,
			),
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
					{ id: attendance.id },
					{
						onSuccess: () => {
							toast.success(
								t("project.attendancePage.delete.feedback.success.title"),
								{
									description: t(
										"project.attendancePage.delete.feedback.success.description",
										{ ...labels, id: attendance.id },
									),
								},
							);
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
					qrValidationHash:
						currentAction.attendance.qrValidationInfo.qrValidationHash,
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

				<AttendancesFiltersDrawer
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
					onRefreshFormerStudents={() => {
						void formerStudentsQuery.refetch();
					}}
					onStartDateChange={value => setDraftFilter("startDate", value)}
					onStatusFilterChange={value => setDraftFilter("statusFilter", value)}
					onFormerStudentIdFilterChange={value =>
						setDraftFilter("formerStudentIdFilter", value)
					}
					open={filtersOpen}
					projectIdFilter={draftFilters.projectIdFilter}
					projectOptions={projectOptions}
					projectsError={projectsQuery.isError}
					startDate={draftFilters.startDate}
					statusFilter={draftFilters.statusFilter}
					formerStudentIdFilter={draftFilters.formerStudentIdFilter}
					formerStudentOptions={formerStudentOptions}
					formerStudentsError={formerStudentsQuery.isError}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<AttendanceResponse>
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
						/>
					),
					isLoading:
						attendancesQuery.isLoading ||
						projectsQuery.isLoading ||
						formerStudentsQuery.isLoading ||
						accountsQuery.isLoading ||
						usersQuery.isLoading,
					loadingLabel: t("project.attendancePage.loading.list"),
				}}
			/>

			<AttendancesCreateDrawer
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
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
						? resolveAttendanceFormerStudentLabel(
								formerStudentById,
								accountById,
								userById,
								pendingDeleteAttendance.formerStudentId,
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
