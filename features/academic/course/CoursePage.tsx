"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { CourseDetailDialog } from "@/features/academic/course/CourseDetailDialog";
import { CourseEditorDrawer } from "@/features/academic/course/CourseEditorDrawer";
import { CourseFiltersDrawer } from "@/features/academic/course/CourseFiltersDrawer";
import { CourseRowActions } from "@/features/academic/course/CourseRowActions";
import { useRemoveCourseMutation } from "@/features/academic/course/mutations";
import {
	useCourseDetailQuery,
	useCoursesQuery,
} from "@/features/academic/course/queries";
import {
	buildCourseSchoolOptions,
	createCourseColumns,
	filterCourses,
	getCourseDeleteErrorToastContent,
	getCourseDetailErrorToastContent,
	getCourseEmptyStateCopy,
	getCourseFilterSummary,
	getCoursesListErrorToastContent,
	getCourseSchoolsErrorToastContent,
} from "@/features/academic/course/utils";
import { useSchoolsQuery } from "@/features/academic/school/queries";
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
import type { CourseResponse, SchoolResponse } from "@/types/api";
import type {
	CourseEditorMode,
	CourseSecondaryFilters,
} from "@/types/client/academic";

export function CoursePage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<CourseSecondaryFilters>(
		() => ({
			schoolIdFilter: "",
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
	} = useDraftFilters<CourseSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const detailState = useServicePageDetailState();
	const editorState = useServicePageEditorState<CourseEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingDeleteCourse, setPendingDeleteCourse] =
		useState<CourseResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const coursesQuery = useCoursesQuery();
	const schoolsQuery = useSchoolsQuery();
	const courseDetailQuery = useCourseDetailQuery(detailState.selectedId);
	const removeCourseMutation = useRemoveCourseMutation();
	const { schedule } = useDeferredUndoAction();

	const schoolById = useMemo(
		() => new Map((schoolsQuery.data ?? []).map(school => [school.id, school])),
		[schoolsQuery.data],
	);
	const schoolOptions = useMemo(
		() => buildCourseSchoolOptions(schoolsQuery.data ?? []),
		[schoolsQuery.data],
	);
	const filteredCourses = useMemo(
		() =>
			filterCourses(coursesQuery.data ?? [], {
				query: deferredQuerySearch,
				schoolIdFilter: appliedFilters.schoolIdFilter,
				dateField: appliedFilters.dateField,
				startDate: appliedFilters.startDate,
				endDate: appliedFilters.endDate,
			}),
		[appliedFilters, coursesQuery.data, deferredQuerySearch],
	);
	const columns = useMemo(() => createCourseColumns(t), [t]);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getCourseFilterSummary(
				t,
				{
					query: deferredQuerySearch,
					schoolIdFilter: appliedFilters.schoolIdFilter,
					dateField: appliedFilters.dateField,
					startDate: appliedFilters.startDate,
					endDate: appliedFilters.endDate,
				},
				schoolById as Map<string, SchoolResponse>,
			),
		[appliedFilters, deferredQuerySearch, schoolById, t],
	);
	const emptyStateCopy = useMemo(
		() => getCourseEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (coursesQuery.isError) {
			return (
				<SomeErrorState
					title={t("academic.coursePage.table.error.title")}
					description={t("academic.coursePage.table.error.description")}
					onRefresh={() => {
						void coursesQuery.refetch();
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
	}, [coursesQuery, emptyStateCopy.description, emptyStateCopy.title, t]);

	useQueryErrorToasts([
		{
			key: "courses-list",
			error: coursesQuery.error,
			errorUpdatedAt: coursesQuery.errorUpdatedAt,
			getContent: error => getCoursesListErrorToastContent(t, error),
			isError: coursesQuery.isError,
		},
		{
			key: "course-detail",
			error: courseDetailQuery.error,
			errorUpdatedAt: courseDetailQuery.errorUpdatedAt,
			getContent: error => getCourseDetailErrorToastContent(t, error),
			isError: courseDetailQuery.isError,
		},
		{
			key: "course-schools",
			error: schoolsQuery.error,
			errorUpdatedAt: schoolsQuery.errorUpdatedAt,
			getContent: error => getCourseSchoolsErrorToastContent(t, error),
			isError: schoolsQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearDraftFilters();
		setFiltersOpen(false);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteCourse) {
			return;
		}

		const course = pendingDeleteCourse;
		setPendingDeleteCourse(null);

		schedule({
			key: course.id,
			title: t("academic.coursePage.delete.undo.title"),
			description: t("academic.coursePage.delete.undo.description", {
				name: course.name,
			}),
			undoLabel: t("academic.coursePage.delete.undo.action"),
			onCommit: () => {
				removeCourseMutation.mutate(
					{
						id: course.id,
					},
					{
						onSuccess: () => {
							toast.success(
								t("academic.coursePage.delete.feedback.success.title"),
								{
									description: t(
										"academic.coursePage.delete.feedback.success.description",
										{
											name: course.name,
										},
									),
								},
							);

							detailState.clearIfMatches(course.id);
							editorState.clearIfMatches(course.id);
						},
						onError: error => {
							const { title, description } = getCourseDeleteErrorToastContent(
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
				title={t("academic.coursePage.title")}
				description={t("academic.coursePage.description")}
				metadata={{
					triggerLabel: t("academic.coursePage.metadata.trigger"),
					emptyTitle: t("academic.coursePage.metadata.empty.title"),
					emptyDescription: t("academic.coursePage.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("academic.coursePage.filters.clear")}
						createLabel={t("academic.coursePage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("academic.coursePage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("academic.coursePage.filters.search.placeholder")}
				/>

				<CourseFiltersDrawer
					dateField={draftFilters.dateField}
					endDate={draftFilters.endDate}
					hasActiveFilters={hasAppliedFilters}
					isSchoolsLoading={schoolsQuery.isLoading}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onClear={clearAllFilters}
					onDateFieldChange={value => setDraftFilter("dateField", value)}
					onEndDateChange={value => setDraftFilter("endDate", value)}
					onOpenChange={setFiltersOpen}
					onRefreshSchools={() => {
						void schoolsQuery.refetch();
					}}
					onSchoolIdChange={value => setDraftFilter("schoolIdFilter", value)}
					onStartDateChange={value => setDraftFilter("startDate", value)}
					open={filtersOpen}
					schoolIdFilter={draftFilters.schoolIdFilter}
					schoolOptions={schoolOptions}
					schoolsError={schoolsQuery.isError}
					startDate={draftFilters.startDate}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<CourseResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredCourses,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<CourseRowActions
							course={row}
							onDelete={setPendingDeleteCourse}
							onOpenEditor={editorState.openEditor}
							onView={detailState.openDetail}
						/>
					),
					isLoading: coursesQuery.isLoading,
					loadingLabel: t("academic.coursePage.loading.list"),
				}}
			/>

			<CourseEditorDrawer
				courseId={editorState.editorId}
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
			/>

			<CourseDetailDialog
				course={courseDetailQuery.data}
				error={courseDetailQuery.error}
				isError={courseDetailQuery.isError}
				isLoading={courseDetailQuery.isLoading}
				onOpenChange={detailState.handleOpenChange}
				onRefresh={() => {
					void courseDetailQuery.refetch();
				}}
				open={detailState.isOpen}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteCourse !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteCourse(null);
					}
				}}
				variant="danger"
				title={t("academic.coursePage.delete.confirm.title")}
				description={t("academic.coursePage.delete.confirm.description", {
					name: pendingDeleteCourse?.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("academic.coursePage.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>
		</ServicePageShell>
	);
}
