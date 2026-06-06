"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { NoContentState, SomeErrorState, toast } from "@/components";
import {
	buildEnrollmentFormerStudentOptions,
	buildEnrollmentProjectOptions,
	createEnrollmentColumns,
	createEnrollmentCompositeKey,
	filterEnrollmentListByBackendFilters,
	filterEnrollmentsByBackendFilters,
	filterEnrollmentsByFrontendFilters,
	getEnrollmentDeleteErrorToastContent,
	getEnrollmentEmptyStateCopy,
	getEnrollmentFilterSummary,
	getEnrollmentProjectsErrorToastContent,
	getEnrollmentsListErrorToastContent,
	getEnrollmentStatusActionErrorToastContent,
	getEnrollmentStatusOptions,
	getEnrollmentStudentsErrorToastContent,
	mapEnrollmentsToDirectoryItems,
} from "@/features/project/enrollments/utils";
import {
	useDeferredUndoAction,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageEditorState,
	useServicePagePagination,
} from "@/hooks";
import type {
	EnrollmentComplexSearchFilters,
	EnrollmentDirectoryItem,
	EnrollmentEditorMode,
	EnrollmentStatus,
	EnrollmentStatusAction,
} from "@/types";

const { formerStudents: formerStudentsApi } = web.academic;
const { accounts: accountsApi, users: usersApi } = web.identity;
const { enrollments: enrollmentsApi, projects: projectsApi } = web.project;
const { useFormerStudentsQuery } = formerStudentsApi;
const { useAccountsQuery } = accountsApi;
const { useUsersQuery } = usersApi;
const {
	useDeleteEnrollmentMutation,
	useEnrollmentStatusMutation,
	useEnrollmentsQuery,
	useEnrollmentsSearchQuery,
} = enrollmentsApi;
const { useProjectsQuery } = projectsApi;

export function useEnrollmentsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [frontendStatuses, setFrontendStatuses] = useState<EnrollmentStatus[]>(
		[],
	);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [pendingDeleteEnrollment, setPendingDeleteEnrollment] =
		useState<EnrollmentDirectoryItem | null>(null);
	const [pendingStatusAction, setPendingStatusAction] = useState<{
		action: EnrollmentStatusAction;
		enrollment: EnrollmentDirectoryItem;
	} | null>(null);
	const editorState = useServicePageEditorState<EnrollmentEditorMode>({
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
	} = useDraftFilters<EnrollmentComplexSearchFilters>({
		initialFilters: {
			projectIds: [],
			formerStudentIds: [],
			statuses: [],
			dateFrom: "",
			dateTo: "",
			periodFrom: "",
			periodTo: "",
		},
	});
	const enrollmentsPagination = useServicePagePagination({
		key: "project.enrollments",
	});
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const enrollmentsQuery = useEnrollmentsQuery(enrollmentsPagination.isAll);
	const projectsQuery = useProjectsQuery();
	const formerStudentsQuery = useFormerStudentsQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const enrollmentsSearchQuery = useEnrollmentsSearchQuery(
		enrollmentsPagination.backendPage ?? 0,
		enrollmentsPagination.backendSize ?? 10,
		appliedFilters,
		!enrollmentsPagination.isAll,
	);
	const deleteEnrollmentMutation = useDeleteEnrollmentMutation();
	const enrollmentStatusMutation = useEnrollmentStatusMutation();
	const { schedule } = useDeferredUndoAction();

	const activeQueryError = enrollmentsPagination.isAll
		? enrollmentsQuery.error
		: enrollmentsSearchQuery.error;
	const activeQueryErrorUpdatedAt = enrollmentsPagination.isAll
		? enrollmentsQuery.errorUpdatedAt
		: enrollmentsSearchQuery.errorUpdatedAt;
	const activeQueryIsError = enrollmentsPagination.isAll
		? enrollmentsQuery.isError
		: enrollmentsSearchQuery.isError;
	const activeQueryIsLoading = enrollmentsPagination.isAll
		? enrollmentsQuery.isLoading
		: enrollmentsSearchQuery.isLoading;

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
		() => buildEnrollmentProjectOptions(projectsQuery.data ?? []),
		[projectsQuery.data],
	);
	const formerStudentOptions = useMemo(
		() =>
			buildEnrollmentFormerStudentOptions(
				formerStudentsQuery.data ?? [],
				accountById,
				userById,
			),
		[accountById, formerStudentsQuery.data, userById],
	);
	const statusOptions = useMemo(() => getEnrollmentStatusOptions(t), [t]);
	const backendFilteredAllEnrollments = useMemo(() => {
		if (!enrollmentsPagination.isAll) {
			return [];
		}

		const filtered = filterEnrollmentListByBackendFilters(
			enrollmentsQuery.data ?? [],
			appliedFilters,
			formerStudentById,
		);

		return mapEnrollmentsToDirectoryItems(
			filtered,
			projectById,
			formerStudentById,
			accountById,
			userById,
		);
	}, [
		accountById,
		appliedFilters,
		enrollmentsPagination.isAll,
		enrollmentsQuery.data,
		formerStudentById,
		projectById,
		userById,
	]);
	const backendFilteredSearchEnrollments = useMemo(
		() =>
			filterEnrollmentsByBackendFilters(
				enrollmentsSearchQuery.data?.content ?? [],
				appliedFilters,
			),
		[appliedFilters, enrollmentsSearchQuery.data],
	);
	const tableSourceEnrollments = useMemo(
		() =>
			enrollmentsPagination.isAll
				? backendFilteredAllEnrollments
				: backendFilteredSearchEnrollments,
		[
			backendFilteredAllEnrollments,
			backendFilteredSearchEnrollments,
			enrollmentsPagination.isAll,
		],
	);
	const filteredEnrollments = useMemo(
		() =>
			filterEnrollmentsByFrontendFilters(tableSourceEnrollments, {
				query: deferredQuerySearch,
				statuses: frontendStatuses,
			}),
		[deferredQuerySearch, frontendStatuses, tableSourceEnrollments],
	);
	const columns = useMemo(() => createEnrollmentColumns(t), [t]);
	const hasAnyFilters = Boolean(
		querySearch.trim() || hasAppliedFilters || frontendStatuses.length > 0,
	);
	const filterSummary = useMemo(
		() => getEnrollmentFilterSummary(t, appliedFilters, deferredQuerySearch),
		[appliedFilters, deferredQuerySearch, t],
	);
	const emptyStateCopy = useMemo(
		() => getEnrollmentEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (activeQueryIsError) {
			return (
				<SomeErrorState
					title={t("project.enrollmentPage.table.error.title")}
					description={t("project.enrollmentPage.table.error.description")}
					onRefresh={() => {
						if (enrollmentsPagination.isAll) {
							void enrollmentsQuery.refetch();
							return;
						}

						void enrollmentsSearchQuery.refetch();
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
		enrollmentsPagination.isAll,
		enrollmentsQuery,
		enrollmentsSearchQuery,
		t,
	]);

	const totalElements = enrollmentsPagination.isAll
		? backendFilteredAllEnrollments.length
		: (enrollmentsSearchQuery.data?.totalElements ?? 0);
	const totalPages = enrollmentsPagination.isAll
		? 1
		: Math.max(enrollmentsSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (
			enrollmentsPagination.isAll ||
			!enrollmentsSearchQuery.data ||
			enrollmentsPagination.currentPage <= totalPages
		) {
			return;
		}

		enrollmentsPagination.setCurrentPage(totalPages);
	}, [enrollmentsPagination, enrollmentsSearchQuery.data, totalPages]);

	useQueryErrorToasts([
		{
			key: "enrollments-list",
			error: activeQueryError,
			errorUpdatedAt: activeQueryErrorUpdatedAt,
			getContent: error => getEnrollmentsListErrorToastContent(t, error),
			isError: activeQueryIsError,
		},
		{
			key: "enrollment-projects",
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentProjectsErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: "enrollment-students",
			error: formerStudentsQuery.error,
			errorUpdatedAt: formerStudentsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentStudentsErrorToastContent(t, error),
			isError: formerStudentsQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		setFrontendStatuses([]);
		clearFilters();
		enrollmentsPagination.resetPage();
		setFiltersOpen(false);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteEnrollment) {
			return;
		}

		const enrollment = pendingDeleteEnrollment;
		setPendingDeleteEnrollment(null);

		schedule({
			key: createEnrollmentCompositeKey(
				enrollment.project.id,
				enrollment.student.account.id,
			),
			title: t("project.enrollmentPage.delete.undo.title"),
			description: t("project.enrollmentPage.delete.undo.description", {
				project: enrollment.project.name,
				student: enrollment.student.account.name,
			}),
			undoLabel: t("common.actions.undo"),
			onCommit: () => {
				deleteEnrollmentMutation.mutate(
					{
						projectId: enrollment.project.id,
						formerStudentId: enrollment.student.account.id,
					},
					{
						onSuccess: () => {
							toast.success(
								t("project.enrollmentPage.delete.feedback.success.title"),
								{
									description: t(
										"project.enrollmentPage.delete.feedback.success.description",
										{
											project: enrollment.project.name,
											student: enrollment.student.account.name,
										},
									),
								},
							);
						},
						onError: error => {
							const { title, description } =
								getEnrollmentDeleteErrorToastContent(t, error);
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

		const current = pendingStatusAction;
		setPendingStatusAction(null);

		enrollmentStatusMutation.mutate(
			{
				action: current.action,
				projectId: current.enrollment.project.id,
				formerStudentId: current.enrollment.student.account.id,
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							`project.enrollmentPage.${current.action}.feedback.success.title`,
						),
						{
							description: t(
								`project.enrollmentPage.${current.action}.feedback.success.description`,
								{
									project: current.enrollment.project.name,
									student: current.enrollment.student.account.name,
								},
							),
						},
					);
				},
				onError: error => {
					const { title, description } =
						getEnrollmentStatusActionErrorToastContent(
							t,
							error,
							current.action,
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
	};
}
