"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import {
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePageShell,
	ServicePageTableSection,
} from "@/components/composite";
import { NoContentState, SomeErrorState, toast } from "@/components/primitives";
import { FormerStudentEditorDrawer } from "@/features/academic/former-students/FormerStudentEditorDrawer";
import { FormerStudentsRowActions } from "@/features/academic/former-students/FormerStudentsRowActions";
import {
	FormerStudentsPageDialogs,
	FormerStudentsPageFilters,
} from "@/features/academic/former-students/components/FormerStudentsPageControls";
import {
	buildFormerStudentAreaOfExpertiseOptions,
	buildFormerStudentCourseOptions,
	buildFormerStudentDirectoryItems,
	appendCopyToEmail,
	createFormerStudentColumns,
	filterFormerStudents,
	getStudentCoursesErrorToastContent,
	getStudentDeleteErrorToastContent,
	getStudentDuplicateErrorToastContent,
	getStudentEmptyStateCopy,
	getStudentFilterSummary,
	getStudentSetActiveErrorToastContent,
	getStudentsListErrorToastContent,
} from "@/features/academic/former-students/utils";
import {
	useActivatableRecordActions,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageEditorState,
} from "@/hooks";
import type {
	FormerStudentDirectoryItem,
	FormerStudentEditorMode,
	FormerStudentSecondaryFilters,
} from "@/types/client";

const { courses: coursesApi, formerStudents: formerStudentsApi } = web.academic;
const { accounts: accountsApi, users: usersApi } = web.identity;
const { useCoursesQuery } = coursesApi;
const {
	get: getFormerStudent,
	useCreateFormerStudentMutation,
	useRemoveFormerStudentMutation,
	useSetFormerStudentActiveMutation,
	useFormerStudentsQuery,
} = formerStudentsApi;
const { get: getAccount, useAccountsQuery } = accountsApi;
const { get: getUser, useUsersQuery } = usersApi;

export function FormerStudentsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [registrationSearch, setRegistrationSearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<FormerStudentSecondaryFilters>(
		() => ({
			name: "",
			cpf: "",
			email: "",
			academicRegistration: "",
			activeOnly: true,
			campi: [],
			courseIds: [],
			areaOfExpertiseIds: [],
			includeConcluded: false,
			periodFrom: "",
			periodTo: "",
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
	} = useDraftFilters<FormerStudentSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const editorState = useServicePageEditorState<FormerStudentEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const deferredRegistrationSearch = useDeferredValue(
		registrationSearch.trim(),
	);
	const formerStudentsQuery = useFormerStudentsQuery();
	const coursesQuery = useCoursesQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const createFormerStudentMutation = useCreateFormerStudentMutation();
	const removeFormerStudentMutation = useRemoveFormerStudentMutation();
	const setFormerStudentActiveMutation = useSetFormerStudentActiveMutation();
	const {
		confirmDelete,
		confirmStatusChange,
		pendingDeleteRecord,
		pendingStatusRecord,
		setPendingDeleteRecord,
		setPendingStatusRecord,
	} = useActivatableRecordActions<
		FormerStudentDirectoryItem,
		{ id: string; active: boolean },
		{ accountId: string; userId: string }
	>({
		deleteMutation: removeFormerStudentMutation,
		getDeleteErrorToastContent: error =>
			getStudentDeleteErrorToastContent(t, error),
		getDeleteSuccessToastContent: formerStudent => ({
			title: t("academic.formerStudentPage.delete.feedback.success.title"),
			description: t(
				"academic.formerStudentPage.delete.feedback.success.description",
				{
					name: formerStudent.user?.name ?? formerStudent.accountId,
				},
			),
		}),
		getDeleteUndoToastContent: formerStudent => ({
			key: formerStudent.accountId,
			title: t("academic.formerStudentPage.delete.undo.title"),
			description: t("academic.formerStudentPage.delete.undo.description", {
				name: formerStudent.user?.name ?? formerStudent.accountId,
			}),
			undoLabel: t("common.actions.undo"),
		}),
		getDeleteVariables: formerStudent => ({
			accountId: formerStudent.accountId,
			userId: formerStudent.account?.userId ?? "",
		}),
		getStatusErrorToastContent: (error, _formerStudent, active) =>
			getStudentSetActiveErrorToastContent(t, error, active),
		getStatusSuccessToastContent: (formerStudent, active) => ({
			title: t(
				active
					? "academic.formerStudentPage.reactivate.feedback.success.title"
					: "academic.formerStudentPage.deactivate.feedback.success.title",
			),
			description: t(
				active
					? "academic.formerStudentPage.reactivate.feedback.success.description"
					: "academic.formerStudentPage.deactivate.feedback.success.description",
				{
					name: formerStudent.user?.name ?? formerStudent.accountId,
				},
			),
		}),
		getStatusVariables: (formerStudent, active) => ({
			id: formerStudent.accountId,
			active,
		}),
		onDeleteSuccess: formerStudent => {
			editorState.clearIfMatches(formerStudent.accountId);
		},
		statusMutation: setFormerStudentActiveMutation,
	});

	const courseById = useMemo(
		() => new Map((coursesQuery.data ?? []).map(course => [course.id, course])),
		[coursesQuery.data],
	);
	const courseOptions = useMemo(
		() => buildFormerStudentCourseOptions(coursesQuery.data ?? []),
		[coursesQuery.data],
	);
	const areaOfExpertiseOptions = useMemo(
		() => buildFormerStudentAreaOfExpertiseOptions(coursesQuery.data ?? []),
		[coursesQuery.data],
	);
	const directoryItems = useMemo(
		() =>
			buildFormerStudentDirectoryItems(
				formerStudentsQuery.data ?? [],
				accountsQuery.data ?? [],
				usersQuery.data ?? [],
				coursesQuery.data ?? [],
			),
		[
			accountsQuery.data,
			coursesQuery.data,
			formerStudentsQuery.data,
			usersQuery.data,
		],
	);
	const filteredStudents = useMemo(
		() =>
			filterFormerStudents(directoryItems, {
				academicRegistration: appliedFilters.academicRegistration,
				activeOnly: appliedFilters.activeOnly,
				areaOfExpertiseIds: appliedFilters.areaOfExpertiseIds,
				campi: appliedFilters.campi,
				cpf: appliedFilters.cpf,
				courseById,
				courseIds: appliedFilters.courseIds,
				dateFrom: appliedFilters.dateFrom,
				dateTo: appliedFilters.dateTo,
				email: appliedFilters.email,
				includeConcluded: appliedFilters.includeConcluded,
				name: appliedFilters.name,
				periodFrom: appliedFilters.periodFrom,
				periodTo: appliedFilters.periodTo,
				query: deferredQuerySearch,
				registrationQuery: deferredRegistrationSearch,
			}),
		[
			appliedFilters,
			courseById,
			deferredQuerySearch,
			deferredRegistrationSearch,
			directoryItems,
		],
	);
	const columns = useMemo(() => createFormerStudentColumns(t), [t]);
	const hasAnyFilters = Boolean(
		querySearch.trim() || registrationSearch.trim() || hasAppliedFilters,
	);
	const filterSummary = useMemo(
		() =>
			getStudentFilterSummary(t, {
				academicRegistration: appliedFilters.academicRegistration,
				activeOnly: appliedFilters.activeOnly,
				areaOfExpertiseIds: appliedFilters.areaOfExpertiseIds,
				campi: appliedFilters.campi,
				cpf: appliedFilters.cpf,
				courseById,
				courseIds: appliedFilters.courseIds,
				dateFrom: appliedFilters.dateFrom,
				dateTo: appliedFilters.dateTo,
				email: appliedFilters.email,
				includeConcluded: appliedFilters.includeConcluded,
				name: appliedFilters.name,
				periodFrom: appliedFilters.periodFrom,
				periodTo: appliedFilters.periodTo,
				query: deferredQuerySearch,
				registrationQuery: deferredRegistrationSearch,
			}),
		[
			appliedFilters,
			courseById,
			deferredQuerySearch,
			deferredRegistrationSearch,
			t,
		],
	);
	const emptyStateCopy = useMemo(
		() => getStudentEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (formerStudentsQuery.isError) {
			return (
				<SomeErrorState
					title={t("academic.formerStudentPage.table.error.title")}
					description={t("academic.formerStudentPage.table.error.description")}
					onRefresh={() => {
						void formerStudentsQuery.refetch();
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
		emptyStateCopy.description,
		emptyStateCopy.title,
		formerStudentsQuery,
		t,
	]);

	useQueryErrorToasts([
		{
			key: "former-students-list",
			error: formerStudentsQuery.error,
			errorUpdatedAt: formerStudentsQuery.errorUpdatedAt,
			getContent: error => getStudentsListErrorToastContent(t, error),
			isError: formerStudentsQuery.isError,
		},
		{
			key: "former-student-courses",
			error: coursesQuery.error,
			errorUpdatedAt: coursesQuery.errorUpdatedAt,
			getContent: error => getStudentCoursesErrorToastContent(t, error),
			isError: coursesQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		setRegistrationSearch("");
		clearDraftFilters();
		setFiltersOpen(false);
	}

	async function handleDuplicate(formerStudent: FormerStudentDirectoryItem) {
		try {
			const formerStudentDetail = await getFormerStudent(
				formerStudent.accountId,
			);
			const linkedAccount = await getAccount(formerStudent.accountId);
			const linkedUser = await getUser(linkedAccount.userId);

			createFormerStudentMutation.mutate(
				{
					body: {
						cpf: linkedUser.cpf,
						name: linkedUser.name,
						email: appendCopyToEmail(
							linkedAccount.email,
							(accountsQuery.data ?? []).map(account => account.email),
						),
						academicRegistration: formerStudentDetail.academicRegistration,
						campus: formerStudentDetail.campus.campus,
						courseId: formerStudentDetail.courseId,
						requiredHours: formerStudentDetail.counterpartHours.requiredHours,
						startDate: formerStudentDetail.period.startDate,
						dueDate: formerStudentDetail.period.dueDate,
					},
				},
				{
					onSuccess: () => {
						toast.success(
							t("academic.formerStudentPage.duplicate.feedback.success.title"),
							{
								description: t(
									"academic.formerStudentPage.duplicate.feedback.success.description",
									{
										name: linkedUser.name,
									},
								),
							},
						);
					},
					onError: error => {
						const { title, description } = getStudentDuplicateErrorToastContent(
							t,
							error,
						);
						toast.danger(title, { description });
					},
				},
			);
		} catch (error) {
			const { title, description } = getStudentDuplicateErrorToastContent(
				t,
				error,
			);
			toast.danger(title, { description });
		}
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("academic.formerStudentPage.title")}
				description={t("academic.formerStudentPage.description")}
				metadata={{
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t(
						"academic.formerStudentPage.metadata.empty.description",
					),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("common.filters.clear")}
						createLabel={t("academic.formerStudentPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
			>
				<FormerStudentsPageFilters
					querySearch={querySearch}
					onQuerySearchChange={setQuerySearch}
					registrationSearch={registrationSearch}
					onRegistrationSearchChange={setRegistrationSearch}
					draftFilters={draftFilters}
					courseOptions={courseOptions}
					areaOfExpertiseOptions={areaOfExpertiseOptions}
					coursesError={coursesQuery.isError}
					coursesLoading={coursesQuery.isLoading}
					hasAppliedFilters={hasAppliedFilters}
					filtersOpen={filtersOpen}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onClear={clearAllFilters}
					onOpenChange={setFiltersOpen}
					onRefreshCourses={() => {
						void coursesQuery.refetch();
					}}
					onFilterChange={(key, value) => setDraftFilter(key, value)}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<FormerStudentDirectoryItem>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredStudents,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<FormerStudentsRowActions
							href={`/academic/former-students/${row.accountId}`}
							formerStudent={row}
							onDelete={setPendingDeleteRecord}
							onDuplicate={handleDuplicate}
							onOpenEditor={editorState.openEditor}
							onSetActive={formerStudent =>
								setPendingStatusRecord({
									active: !(formerStudent.account?.active ?? false),
									record: formerStudent,
								})
							}
						/>
					),
					isLoading:
						formerStudentsQuery.isLoading ||
						coursesQuery.isLoading ||
						accountsQuery.isLoading ||
						usersQuery.isLoading,
					loadingLabel: t("academic.formerStudentPage.loading.list"),
				}}
			/>

			<FormerStudentEditorDrawer
				mode={editorState.editorMode}
				onOpenChange={editorState.handleOpenChange}
				open={editorState.isOpen}
				formerStudentId={editorState.editorId}
			/>

			<FormerStudentsPageDialogs
				pendingDeleteRecord={pendingDeleteRecord}
				pendingStatusRecord={pendingStatusRecord}
				onDeleteOpenChange={open => {
					if (!open) {
						setPendingDeleteRecord(null);
					}
				}}
				onStatusOpenChange={open => {
					if (!open) {
						setPendingStatusRecord(null);
					}
				}}
				onDeleteConfirm={confirmDelete}
				onStatusConfirm={confirmStatusChange}
			/>
		</ServicePageShell>
	);
}
