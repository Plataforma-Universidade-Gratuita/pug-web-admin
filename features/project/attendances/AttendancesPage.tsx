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
import { useFormerStudentsQuery } from "@/features/academic/former-students/queries";
import { useAccountsQuery } from "@/features/identity/accounts/queries";
import { useUsersQuery } from "@/features/identity/users/queries";
import { AttendanceEditorDrawer } from "@/features/project/attendances/AttendanceEditorDrawer";
import { AttendanceQrCodeDialog } from "@/features/project/attendances/AttendanceQrCodeDialog";
import { AttendancesFiltersDrawer } from "@/features/project/attendances/AttendancesFiltersDrawer";
import { AttendancesRowActions } from "@/features/project/attendances/AttendancesRowActions";
import {
	useRemoveAttendanceMutation,
	useValidateAttendanceMutation,
} from "@/features/project/attendances/mutations";
import {
	useAttendancesQuery,
	useAttendancesSearchQuery,
} from "@/features/project/attendances/queries";
import {
	buildAttendanceFormerStudentOptions,
	buildAttendanceProjectOptions,
	getAttendanceStatusOptions,
	buildAttendanceValidatorOptions,
	createAttendanceColumns,
	filterAttendanceListByBackendFilters,
	filterAttendancesByBackendFilters,
	filterAttendancesByFrontendFilters,
	getAttendanceAdminsErrorToastContent,
	getAttendanceDeleteErrorToastContent,
	getAttendanceEmptyStateCopy,
	getAttendanceFilterSummary,
	getAttendanceProjectsErrorToastContent,
	getAttendancesListErrorToastContent,
	getAttendanceStudentsErrorToastContent,
	getAttendanceValidateErrorToastContent,
	mapAttendancesToDirectoryItems,
} from "@/features/project/attendances/utils";
import { useProjectsQuery } from "@/features/project/projects/queries";
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
import type {
	AttendanceComplexSearchFilters,
	AttendanceDirectoryItem,
	AttendanceEditorMode,
	AttendanceValidationAction,
} from "@/types";

function getValidationVariant(action: AttendanceValidationAction) {
	return action === "markPresent" ? "success" : "warning";
}

export function AttendancesPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [frontendStatuses, setFrontendStatuses] = useState<
		AttendanceDirectoryItem["status"]["status"][]
	>([]);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const editorState = useServicePageEditorState<AttendanceEditorMode>({
		createMode: "create",
		defaultMode: "create",
	});
	const {
		appliedFilters,
		applyDraftFilters,
		clearFilters,
		draftFilters,
		hasAppliedFilters,
		setDraftFilter,
	} = useDraftFilters<AttendanceComplexSearchFilters>({
		initialFilters: {
			projectIds: [],
			formerStudentIds: [],
			statuses: [],
			validatedByIds: [],
			durationFrom: "",
			durationTo: "",
			dateFrom: "",
			dateTo: "",
		},
	});
	const attendancesPagination = useServicePagePagination({
		key: "project.attendances",
	});
	const [pendingDeleteAttendance, setPendingDeleteAttendance] =
		useState<AttendanceDirectoryItem | null>(null);
	const [pendingValidation, setPendingValidation] = useState<{
		action: AttendanceValidationAction;
		attendance: AttendanceDirectoryItem;
	} | null>(null);
	const [qrDialogAttendance, setQrDialogAttendance] =
		useState<AttendanceDirectoryItem | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const attendancesQuery = useAttendancesQuery(attendancesPagination.isAll);
	const attendancesSearchQuery = useAttendancesSearchQuery(
		attendancesPagination.backendPage ?? 0,
		attendancesPagination.backendSize ?? 10,
		appliedFilters,
		!attendancesPagination.isAll,
	);
	const projectsQuery = useProjectsQuery();
	const formerStudentsQuery = useFormerStudentsQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const removeAttendanceMutation = useRemoveAttendanceMutation();
	const validateAttendanceMutation = useValidateAttendanceMutation();
	const { schedule } = useDeferredUndoAction();

	const activeQueryError = attendancesPagination.isAll
		? attendancesQuery.error
		: attendancesSearchQuery.error;
	const activeQueryErrorUpdatedAt = attendancesPagination.isAll
		? attendancesQuery.errorUpdatedAt
		: attendancesSearchQuery.errorUpdatedAt;
	const activeQueryIsError = attendancesPagination.isAll
		? attendancesQuery.isError
		: attendancesSearchQuery.isError;
	const activeQueryIsLoading = attendancesPagination.isAll
		? attendancesQuery.isLoading
		: attendancesSearchQuery.isLoading;

	const projectById = useMemo(
		() =>
			new Map((projectsQuery.data ?? []).map(project => [project.id, project])),
		[projectsQuery.data],
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
	const validatorOptions = useMemo(
		() => buildAttendanceValidatorOptions(accountsQuery.data ?? [], userById),
		[accountsQuery.data, userById],
	);
	const statusOptions = useMemo(() => getAttendanceStatusOptions(t), [t]);
	const backendFilteredAllAttendances = useMemo(() => {
		if (!attendancesPagination.isAll) {
			return [];
		}

		const filtered = filterAttendanceListByBackendFilters(
			attendancesQuery.data ?? [],
			appliedFilters,
		);

		return mapAttendancesToDirectoryItems(
			filtered,
			projectById,
			formerStudentById,
			accountById,
			userById,
		);
	}, [
		accountById,
		appliedFilters,
		attendancesPagination.isAll,
		attendancesQuery.data,
		formerStudentById,
		projectById,
		userById,
	]);
	const backendFilteredSearchAttendances = useMemo(
		() =>
			filterAttendancesByBackendFilters(
				attendancesSearchQuery.data?.content ?? [],
				appliedFilters,
			),
		[appliedFilters, attendancesSearchQuery.data],
	);
	const tableSourceAttendances = useMemo(
		() =>
			attendancesPagination.isAll
				? backendFilteredAllAttendances
				: backendFilteredSearchAttendances,
		[
			attendancesPagination.isAll,
			backendFilteredAllAttendances,
			backendFilteredSearchAttendances,
		],
	);
	const filteredAttendances = useMemo(
		() =>
			filterAttendancesByFrontendFilters(tableSourceAttendances, {
				query: deferredQuerySearch,
				statuses: frontendStatuses,
			}),
		[deferredQuerySearch, frontendStatuses, tableSourceAttendances],
	);
	const columns = useMemo(() => createAttendanceColumns(t), [t]);
	const hasAnyFilters = Boolean(
		querySearch.trim() || hasAppliedFilters || frontendStatuses.length > 0,
	);
	const filterSummary = useMemo(
		() => getAttendanceFilterSummary(t, appliedFilters, deferredQuerySearch),
		[appliedFilters, deferredQuerySearch, t],
	);
	const emptyStateCopy = useMemo(
		() => getAttendanceEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (activeQueryIsError) {
			return (
				<SomeErrorState
					title={t("project.attendancePage.table.error.title")}
					description={t("project.attendancePage.table.error.description")}
					onRefresh={() => {
						if (attendancesPagination.isAll) {
							void attendancesQuery.refetch();
							return;
						}

						void attendancesSearchQuery.refetch();
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
		attendancesPagination.isAll,
		attendancesQuery,
		attendancesSearchQuery,
		emptyStateCopy.description,
		emptyStateCopy.title,
		t,
	]);

	const totalElements = attendancesPagination.isAll
		? backendFilteredAllAttendances.length
		: (attendancesSearchQuery.data?.totalElements ?? 0);
	const totalPages = attendancesPagination.isAll
		? 1
		: Math.max(attendancesSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (
			attendancesPagination.isAll ||
			!attendancesSearchQuery.data ||
			attendancesPagination.currentPage <= totalPages
		) {
			return;
		}

		attendancesPagination.setCurrentPage(totalPages);
	}, [attendancesPagination, attendancesSearchQuery.data, totalPages]);

	useQueryErrorToasts([
		{
			key: "attendances-list",
			error: activeQueryError,
			errorUpdatedAt: activeQueryErrorUpdatedAt,
			getContent: error => getAttendancesListErrorToastContent(t, error),
			isError: activeQueryIsError,
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
		setFrontendStatuses([]);
		clearFilters();
		attendancesPagination.resetPage();
		setFiltersOpen(false);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteAttendance) {
			return;
		}

		const attendance = pendingDeleteAttendance;
		setPendingDeleteAttendance(null);

		schedule({
			key: attendance.id,
			title: t("project.attendancePage.delete.undo.title"),
			description: t("project.attendancePage.delete.undo.description", {
				id: attendance.id,
				project: attendance.project.name,
				student: attendance.student.account.name,
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
										{
											id: attendance.id,
											project: attendance.project.name,
											student: attendance.student.account.name,
										},
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
								{
									project: currentAction.attendance.project.name,
									student: currentAction.attendance.student.account.name,
								},
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
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(220px,0.8fr)]">
					<TextFieldFilter
						label={t("project.attendancePage.filters.search.label")}
						value={querySearch}
						onChange={setQuerySearch}
						placeholder={t("project.attendancePage.filters.search.placeholder")}
					/>

					<div className="grid gap-2">
						<Label>{t("project.attendancePage.filters.status.label")}</Label>
						<Combobox
							multiple
							options={statusOptions}
							values={frontendStatuses}
							onValuesChange={value =>
								setFrontendStatuses(
									value as AttendanceDirectoryItem["status"]["status"][],
								)
							}
							placeholder={t(
								"project.attendancePage.filters.status.placeholder",
							)}
							searchPlaceholder={t(
								"project.attendancePage.filters.status.searchPlaceholder",
							)}
							emptyMessage={t(
								"project.attendancePage.filters.status.emptyMessage",
							)}
							maxVisibleValues={1}
						/>
					</div>
				</div>

				<AttendancesFiltersDrawer
					filters={draftFilters}
					formerStudentOptions={formerStudentOptions}
					formerStudentsError={formerStudentsQuery.isError}
					hasActiveFilters={hasAppliedFilters}
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
					open={filtersOpen}
					projectOptions={projectOptions}
					projectsError={projectsQuery.isError}
					validatorOptions={validatorOptions}
					validatorsError={accountsQuery.isError}
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

			<AttendanceQrCodeDialog
				hash={qrDialogAttendance?.qrValidationInfo.qrValidationHash ?? null}
				onOpenChange={open => {
					if (!open) {
						setQrDialogAttendance(null);
					}
				}}
				open={qrDialogAttendance !== null}
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
					project: pendingDeleteAttendance?.project.name ?? "",
					student: pendingDeleteAttendance?.student.account.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.table.actions.delete")}
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
								{
									project: pendingValidation.attendance.project.name,
									student: pendingValidation.attendance.student.account.name,
								},
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
