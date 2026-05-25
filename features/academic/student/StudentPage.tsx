"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { useCoursesQuery } from "../courses/queries";
import { StudentDetailDialog } from "@/features/academic/student/StudentDetailDialog";
import { StudentEditorDrawer } from "@/features/academic/student/StudentEditorDrawer";
import { StudentFiltersDrawer } from "@/features/academic/student/StudentFiltersDrawer";
import { StudentRowActions } from "@/features/academic/student/StudentRowActions";
import {
	useRemoveStudentMutation,
	useSetStudentActiveMutation,
} from "@/features/academic/student/mutations";
import {
	useStudentDetailQuery,
	useStudentsQuery,
} from "@/features/academic/student/queries";
import {
	buildStudentCourseOptions,
	createStudentColumns,
	filterStudents,
	getStudentDeleteErrorToastContent,
	getStudentDetailErrorToastContent,
	getStudentEmptyStateCopy,
	getStudentFilterSummary,
	getStudentCoursesErrorToastContent,
	getStudentSetActiveErrorToastContent,
	getStudentsListErrorToastContent,
	resolveStudentCourseLabel,
} from "@/features/academic/student/utils";
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
	useServicePageEditorState,
} from "@/hooks";
import type { CourseResponse, StudentResponse } from "@/types";
import type { StudentEditorMode, StudentSecondaryFilters } from "@/types";

export function StudentPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<StudentSecondaryFilters>(
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
	} = useDraftFilters<StudentSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const detailState = useServicePageDetailState();
	const editorState = useServicePageEditorState<StudentEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingStatusStudent, setPendingStatusStudent] = useState<{
		active: boolean;
		student: StudentResponse;
	} | null>(null);
	const [pendingDeleteStudent, setPendingDeleteStudent] =
		useState<StudentResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const studentsQuery = useStudentsQuery();
	const coursesQuery = useCoursesQuery();
	const studentDetailQuery = useStudentDetailQuery(detailState.selectedId);
	const removeStudentMutation = useRemoveStudentMutation();
	const setStudentActiveMutation = useSetStudentActiveMutation();
	const { schedule } = useDeferredUndoAction();

	const courseById = useMemo(
		() => new Map((coursesQuery.data ?? []).map(course => [course.id, course])),
		[coursesQuery.data],
	);
	const courseOptions = useMemo(
		() => buildStudentCourseOptions(coursesQuery.data ?? []),
		[coursesQuery.data],
	);
	const filteredStudents = useMemo(
		() =>
			filterStudents(studentsQuery.data ?? [], {
				activeFilter: appliedFilters.activeFilter,
				campusFilter: appliedFilters.campusFilter,
				courseById,
				courseIdFilter: appliedFilters.courseIdFilter,
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
			}),
		[appliedFilters, courseById, deferredQuerySearch, studentsQuery.data],
	);
	const columns = useMemo(
		() => createStudentColumns(t, courseById),
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
		if (studentsQuery.isError) {
			return (
				<SomeErrorState
					title={t("academic.studentPage.table.error.title")}
					description={t("academic.studentPage.table.error.description")}
					onRefresh={() => {
						void studentsQuery.refetch();
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
	}, [emptyStateCopy.description, emptyStateCopy.title, studentsQuery, t]);

	useQueryErrorToasts([
		{
			key: "students-list",
			error: studentsQuery.error,
			errorUpdatedAt: studentsQuery.errorUpdatedAt,
			getContent: error => getStudentsListErrorToastContent(t, error),
			isError: studentsQuery.isError,
		},
		{
			key: "student-detail",
			error: studentDetailQuery.error,
			errorUpdatedAt: studentDetailQuery.errorUpdatedAt,
			getContent: error => getStudentDetailErrorToastContent(t, error),
			isError: studentDetailQuery.isError,
		},
		{
			key: "student-courses",
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

		const { active, student } = pendingStatusStudent;

		setStudentActiveMutation.mutate(
			{
				id: student.accountId,
				active,
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							active
								? "academic.studentPage.reactivate.feedback.success.title"
								: "academic.studentPage.deactivate.feedback.success.title",
						),
						{
							description: t(
								active
									? "academic.studentPage.reactivate.feedback.success.description"
									: "academic.studentPage.deactivate.feedback.success.description",
								{
									name: student.userName,
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
						active,
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

		const student = pendingDeleteStudent;
		setPendingDeleteStudent(null);

		schedule({
			key: student.accountId,
			title: t("academic.studentPage.delete.undo.title"),
			description: t("academic.studentPage.delete.undo.description", {
				name: student.userName,
			}),
			undoLabel: t("academic.studentPage.delete.undo.action"),
			onCommit: () => {
				removeStudentMutation.mutate(
					{
						accountId: student.accountId,
						userId: student.userId,
					},
					{
						onSuccess: () => {
							toast.success(
								t("academic.studentPage.delete.feedback.success.title"),
								{
									description: t(
										"academic.studentPage.delete.feedback.success.description",
										{
											name: student.userName,
										},
									),
								},
							);

							detailState.clearIfMatches(student.accountId);
							editorState.clearIfMatches(student.accountId);
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

				<StudentFiltersDrawer
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

			<ServicePageTableSection<StudentResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredStudents,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<StudentRowActions
							onDelete={setPendingDeleteStudent}
							onOpenEditor={editorState.openEditor}
							onSetActive={(student, active) =>
								setPendingStatusStudent({ active, student })
							}
							onView={detailState.openDetail}
							student={row}
						/>
					),
					isLoading: studentsQuery.isLoading,
					loadingLabel: t("academic.studentPage.loading.list"),
				}}
			/>

			<StudentEditorDrawer
				mode={editorState.editorMode}
				onOpenChange={editorState.handleOpenChange}
				open={editorState.isOpen}
				studentId={editorState.editorId}
			/>

			<StudentDetailDialog
				courseName={
					studentDetailQuery.data
						? resolveStudentCourseLabel(
								courseById as Map<string, CourseResponse>,
								studentDetailQuery.data.courseId,
							)
						: ""
				}
				error={studentDetailQuery.error}
				isError={studentDetailQuery.isError}
				isLoading={studentDetailQuery.isLoading}
				onOpenChange={detailState.handleOpenChange}
				onRefresh={() => {
					void studentDetailQuery.refetch();
				}}
				open={detailState.isOpen}
				student={studentDetailQuery.data}
			/>

			<ServicePageConfirmDialog
				open={pendingStatusStudent !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingStatusStudent(null);
					}
				}}
				variant={pendingStatusStudent?.active ? "success" : "warning"}
				title={t(
					pendingStatusStudent?.active
						? "academic.studentPage.reactivate.confirm.title"
						: "academic.studentPage.deactivate.confirm.title",
				)}
				description={t(
					pendingStatusStudent?.active
						? "academic.studentPage.reactivate.confirm.description"
						: "academic.studentPage.deactivate.confirm.description",
					{
						name: pendingStatusStudent?.student.userName ?? "",
					},
				)}
				cancelLabel={t("common.cancel")}
				actionLabel={t(
					pendingStatusStudent?.active
						? "academic.studentPage.table.actions.reactivate"
						: "academic.studentPage.table.actions.deactivate",
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
					name: pendingDeleteStudent?.userName ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("academic.studentPage.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>
		</ServicePageShell>
	);
}
