"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { NoContentState, SomeErrorState, toast } from "@/components/primitives";
import {
	buildAttendanceFormerStudentOptions,
	buildAttendanceProjectOptions,
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
	getAttendanceStatusOptions,
	getAttendanceStudentsErrorToastContent,
	getAttendanceValidateErrorToastContent,
	mapAttendancesToDirectoryItems,
} from "@/features/project/attendances/utils";
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
} from "@/types/client";

const { formerStudents: formerStudentsApi } = web.academic;
const { accounts: accountsApi, users: usersApi } = web.identity;
const { attendances: attendancesApi, projects: projectsApi } = web.project;
const { useFormerStudentsQuery } = formerStudentsApi;
const { useAccountsQuery } = accountsApi;
const { useUsersQuery } = usersApi;
const {
	useRemoveAttendanceMutation,
	useValidateAttendanceMutation,
	useAttendancesQuery,
	useAttendancesSearchQuery,
} = attendancesApi;
const { useProjectsQuery } = projectsApi;

export function useAttendancesPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [frontendStatuses, setFrontendStatuses] = useState<
		AttendanceDirectoryItem["status"]["status"][]
	>([]);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [pendingDeleteAttendance, setPendingDeleteAttendance] =
		useState<AttendanceDirectoryItem | null>(null);
	const [pendingValidation, setPendingValidation] = useState<{
		action: AttendanceValidationAction;
		attendance: AttendanceDirectoryItem;
	} | null>(null);
	const [qrDialogAttendance, setQrDialogAttendance] =
		useState<AttendanceDirectoryItem | null>(null);
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
					title={t("common.errors.listLoad.title")}
					description={t("common.errors.listLoad.description")}
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
				formerStudent: attendance.student.account.name,
			}),
			undoLabel: t("common.actions.undo"),
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
											formerStudent: attendance.student.account.name,
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
									formerStudent: currentAction.attendance.student.account.name,
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

	return {
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
	};
}
