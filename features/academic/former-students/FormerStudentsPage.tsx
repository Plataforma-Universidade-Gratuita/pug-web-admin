"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { useCoursesQuery } from "@/features/academic/courses/queries";
import { FormerStudentEditorDrawer } from "@/features/academic/former-students/FormerStudentEditorDrawer";
import { FormerStudentsFiltersDrawer } from "@/features/academic/former-students/FormerStudentsFiltersDrawer";
import { FormerStudentsRowActions } from "@/features/academic/former-students/FormerStudentsRowActions";
import {
	useRemoveFormerStudentMutation,
	useSetFormerStudentActiveMutation,
} from "@/features/academic/former-students/mutations";
import { useFormerStudentsQuery } from "@/features/academic/former-students/queries";
import {
	buildFormerStudentCourseOptions,
	buildFormerStudentDirectoryItems,
	createFormerStudentColumns,
	filterFormerStudents,
	getStudentCoursesErrorToastContent,
	getStudentDeleteErrorToastContent,
	getStudentEmptyStateCopy,
	getStudentFilterSummary,
	getStudentSetActiveErrorToastContent,
	getStudentsListErrorToastContent,
} from "@/features/academic/former-students/utils";
import { useAccountsQuery } from "@/features/identity/accounts/queries";
import { useUsersQuery } from "@/features/identity/users/queries";
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
	useServicePageEditorState,
} from "@/hooks";
import type {
	FormerStudentDirectoryItem,
	FormerStudentEditorMode,
	FormerStudentSecondaryFilters,
} from "@/types";

export function FormerStudentsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<FormerStudentSecondaryFilters>(
		() => ({
			activeFilter: "",
			campusFilter: "",
			courseIdFilter: "",
			dateField: "",
			startDate: "",
			endDate: "",
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
	const [pendingStatusStudent, setPendingStatusStudent] =
		useState<FormerStudentDirectoryItem | null>(null);
	const [pendingDeleteStudent, setPendingDeleteStudent] =
		useState<FormerStudentDirectoryItem | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const formerStudentsQuery = useFormerStudentsQuery();
	const coursesQuery = useCoursesQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const removeFormerStudentMutation = useRemoveFormerStudentMutation();
	const setFormerStudentActiveMutation = useSetFormerStudentActiveMutation();
	const { schedule } = useDeferredUndoAction();

	const courseById = useMemo(
		() => new Map((coursesQuery.data ?? []).map(course => [course.id, course])),
		[coursesQuery.data],
	);
	const courseOptions = useMemo(
		() => buildFormerStudentCourseOptions(coursesQuery.data ?? []),
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
				activeFilter: appliedFilters.activeFilter,
				campusFilter: appliedFilters.campusFilter,
				courseById,
				courseIdFilter: appliedFilters.courseIdFilter,
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
			}),
		[appliedFilters, courseById, deferredQuerySearch, directoryItems],
	);
	const columns = useMemo(
		() => createFormerStudentColumns(t, courseById),
		[courseById, t],
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getStudentFilterSummary(t, {
				activeFilter: appliedFilters.activeFilter,
				campusFilter: appliedFilters.campusFilter,
				courseById,
				courseIdFilter: appliedFilters.courseIdFilter,
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
			}),
		[appliedFilters, courseById, deferredQuerySearch, t],
	);
	const emptyStateCopy = useMemo(
		() => getStudentEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (formerStudentsQuery.isError) {
			return (
				<SomeErrorState
					title={t("academic.studentPage.table.error.title")}
					description={t("academic.studentPage.table.error.description")}
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
		clearDraftFilters();
		setFiltersOpen(false);
	}

	function handleStatusConfirm() {
		if (!pendingStatusStudent) {
			return;
		}

		const formerStudent = pendingStatusStudent;
		const nextActive = !(formerStudent.account?.active ?? false);

		setFormerStudentActiveMutation.mutate(
			{
				id: formerStudent.accountId,
				active: nextActive,
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							nextActive
								? "academic.studentPage.reactivate.feedback.success.title"
								: "academic.studentPage.deactivate.feedback.success.title",
						),
						{
							description: t(
								nextActive
									? "academic.studentPage.reactivate.feedback.success.description"
									: "academic.studentPage.deactivate.feedback.success.description",
								{
									name: formerStudent.user?.name ?? formerStudent.accountId,
								},
							),
						},
					);
					setPendingStatusStudent(null);
				},
				onError: error => {
					const { title, description } = getStudentSetActiveErrorToastContent(
						t,
						error,
						nextActive,
					);
					toast.danger(title, { description });
					setPendingStatusStudent(null);
				},
			},
		);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteStudent) {
			return;
		}

		const formerStudent = pendingDeleteStudent;
		setPendingDeleteStudent(null);

		schedule({
			key: formerStudent.accountId,
			title: t("academic.studentPage.delete.undo.title"),
			description: t("academic.studentPage.delete.undo.description", {
				name: formerStudent.user?.name ?? formerStudent.accountId,
			}),
			undoLabel: t("academic.studentPage.delete.undo.action"),
			onCommit: () => {
				removeFormerStudentMutation.mutate(
					{
						accountId: formerStudent.accountId,
						userId: formerStudent.account?.userId ?? "",
					},
					{
						onSuccess: () => {
							toast.success(
								t("academic.studentPage.delete.feedback.success.title"),
								{
									description: t(
										"academic.studentPage.delete.feedback.success.description",
										{
											name: formerStudent.user?.name ?? formerStudent.accountId,
										},
									),
								},
							);

							editorState.clearIfMatches(formerStudent.accountId);
						},
						onError: error => {
							const { title, description } = getStudentDeleteErrorToastContent(
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

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("academic.studentPage.title")}
				description={t("academic.studentPage.description")}
				metadata={{
					triggerLabel: t("academic.studentPage.metadata.trigger"),
					emptyTitle: t("academic.studentPage.metadata.empty.title"),
					emptyDescription: t(
						"academic.studentPage.metadata.empty.description",
					),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("academic.studentPage.filters.clear")}
						createLabel={t("academic.studentPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("academic.studentPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("academic.studentPage.filters.search.placeholder")}
				/>

				<FormerStudentsFiltersDrawer
					activeFilter={draftFilters.activeFilter}
					campusFilter={draftFilters.campusFilter}
					courseIdFilter={draftFilters.courseIdFilter}
					courseOptions={courseOptions}
					coursesError={coursesQuery.isError}
					dateField={draftFilters.dateField}
					endDate={draftFilters.endDate}
					hasActiveFilters={hasAppliedFilters}
					isCoursesLoading={coursesQuery.isLoading}
					onActiveFilterChange={value => setDraftFilter("activeFilter", value)}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onCampusFilterChange={value => setDraftFilter("campusFilter", value)}
					onClear={clearAllFilters}
					onCourseIdFilterChange={value =>
						setDraftFilter("courseIdFilter", value)
					}
					onDateFieldChange={value => setDraftFilter("dateField", value)}
					onEndDateChange={value => setDraftFilter("endDate", value)}
					onOpenChange={setFiltersOpen}
					onRefreshCourses={() => {
						void coursesQuery.refetch();
					}}
					onStartDateChange={value => setDraftFilter("startDate", value)}
					open={filtersOpen}
					startDate={draftFilters.startDate}
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
							onDelete={setPendingDeleteStudent}
							onOpenEditor={editorState.openEditor}
							onSetActive={formerStudent =>
								setPendingStatusStudent(formerStudent)
							}
						/>
					),
					isLoading:
						formerStudentsQuery.isLoading ||
						coursesQuery.isLoading ||
						accountsQuery.isLoading ||
						usersQuery.isLoading,
					loadingLabel: t("academic.studentPage.loading.list"),
				}}
			/>

			<FormerStudentEditorDrawer
				mode={editorState.editorMode}
				onOpenChange={editorState.handleOpenChange}
				open={editorState.isOpen}
				formerStudentId={editorState.editorId}
			/>

			<ServicePageConfirmDialog
				open={pendingStatusStudent !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingStatusStudent(null);
					}
				}}
				variant={pendingStatusStudent?.account?.active ? "warning" : "success"}
				title={t(
					pendingStatusStudent?.account?.active
						? "academic.studentPage.deactivate.confirm.title"
						: "academic.studentPage.reactivate.confirm.title",
				)}
				description={t(
					pendingStatusStudent?.account?.active
						? "academic.studentPage.deactivate.confirm.description"
						: "academic.studentPage.reactivate.confirm.description",
					{
						name: pendingStatusStudent?.user?.name ?? "",
					},
				)}
				cancelLabel={t("common.cancel")}
				actionLabel={t(
					pendingStatusStudent?.account?.active
						? "academic.studentPage.table.actions.deactivate"
						: "academic.studentPage.table.actions.reactivate",
				)}
				onAction={handleStatusConfirm}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteStudent !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteStudent(null);
					}
				}}
				variant="danger"
				title={t("academic.studentPage.delete.confirm.title")}
				description={t("academic.studentPage.delete.confirm.description", {
					name: pendingDeleteStudent?.user?.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("academic.studentPage.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>
		</ServicePageShell>
	);
}
