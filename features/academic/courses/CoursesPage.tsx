"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { useAreasOfExpertiseQuery } from "@/features/academic/areas-of-expertise/queries";
import { CourseEditorDrawer } from "@/features/academic/courses/CourseEditorDrawer";
import { CoursesFiltersDrawer } from "@/features/academic/courses/CoursesFiltersDrawer";
import { CoursesRowActions } from "@/features/academic/courses/CoursesRowActions";
import {
	useCreateCourseMutation,
	useRemoveCourseMutation,
} from "@/features/academic/courses/mutations";
import { useCoursesQuery } from "@/features/academic/courses/queries";
import {
	appendCopyToCourseName,
	buildCourseAreaOfExpertiseOptions,
	createCourseColumns,
	filterCourses,
	getCourseDeleteErrorToastContent,
	getCourseEmptyStateCopy,
	getCourseFilterSummary,
	getCourseDuplicateErrorToastContent,
	getCourseSchoolsErrorToastContent,
	getCoursesListErrorToastContent,
} from "@/features/academic/courses/utils";
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
import type { AreaOfExpertiseResponse, CourseResponse } from "@/types";
import type { CourseEditorMode, CourseSecondaryFilters } from "@/types";

export function CoursesPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<CourseSecondaryFilters>(
		() => ({
			areaOfExpertiseIds: [],
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
	const editorState = useServicePageEditorState<CourseEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingDeleteCourse, setPendingDeleteCourse] =
		useState<CourseResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const coursesQuery = useCoursesQuery();
	const areasOfExpertiseQuery = useAreasOfExpertiseQuery();
	const createCourseMutation = useCreateCourseMutation();
	const removeCourseMutation = useRemoveCourseMutation();
	const { schedule } = useDeferredUndoAction();

	const areaOfExpertiseById = useMemo(
		() =>
			new Map(
				(areasOfExpertiseQuery.data ?? []).map(areaOfExpertise => [
					areaOfExpertise.id,
					areaOfExpertise,
				]),
			),
		[areasOfExpertiseQuery.data],
	);
	const areaOfExpertiseOptions = useMemo(
		() => buildCourseAreaOfExpertiseOptions(areasOfExpertiseQuery.data ?? []),
		[areasOfExpertiseQuery.data],
	);
	const filteredCourses = useMemo(
		() =>
			filterCourses(coursesQuery.data ?? [], {
				query: deferredQuerySearch,
				areaOfExpertiseIds: appliedFilters.areaOfExpertiseIds,
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
					areaOfExpertiseIds: appliedFilters.areaOfExpertiseIds,
					startDate: appliedFilters.startDate,
					endDate: appliedFilters.endDate,
				},
				areaOfExpertiseById as Map<string, AreaOfExpertiseResponse>,
			),
		[appliedFilters, areaOfExpertiseById, deferredQuerySearch, t],
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
			key: "course-areas-of-expertise",
			error: areasOfExpertiseQuery.error,
			errorUpdatedAt: areasOfExpertiseQuery.errorUpdatedAt,
			getContent: error => getCourseSchoolsErrorToastContent(t, error),
			isError: areasOfExpertiseQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearDraftFilters();
		setFiltersOpen(false);
	}

	function handleDuplicate(course: CourseResponse) {
		createCourseMutation.mutate(
			{
				body: {
					name: appendCopyToCourseName(course.name),
					areaOfExpertiseId: course.areaOfExpertise.id,
				},
			},
			{
				onSuccess: createdCourse => {
					toast.success(
						t("academic.coursePage.duplicate.feedback.success.title"),
						{
							description: t(
								"academic.coursePage.duplicate.feedback.success.description",
								{
									name: createdCourse.name,
								},
							),
						},
					);
				},
				onError: error => {
					const { title, description } = getCourseDuplicateErrorToastContent(
						t,
						error,
					);
					toast.danger(title, { description });
				},
			},
		);
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
			undoLabel: t("common.actions.undo"),
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
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t("common.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("common.filters.clear")}
						createLabel={t("academic.coursePage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("common.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("academic.coursePage.filters.search.placeholder")}
				/>

				<CoursesFiltersDrawer
					areaOfExpertiseIds={draftFilters.areaOfExpertiseIds}
					areaOfExpertiseOptions={areaOfExpertiseOptions}
					areasOfExpertiseError={areasOfExpertiseQuery.isError}
					endDate={draftFilters.endDate}
					hasActiveFilters={hasAppliedFilters}
					isAreasOfExpertiseLoading={areasOfExpertiseQuery.isLoading}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onAreaOfExpertiseIdsChange={value =>
						setDraftFilter("areaOfExpertiseIds", value)
					}
					onClear={clearAllFilters}
					onEndDateChange={value => setDraftFilter("endDate", value)}
					onOpenChange={setFiltersOpen}
					onRefreshAreasOfExpertise={() => {
						void areasOfExpertiseQuery.refetch();
					}}
					onStartDateChange={value => setDraftFilter("startDate", value)}
					open={filtersOpen}
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
						<CoursesRowActions
							course={row}
							href={`/academic/courses/${row.id}`}
							onDelete={setPendingDeleteCourse}
							onDuplicate={handleDuplicate}
							onOpenEditor={editorState.openEditor}
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
				actionLabel={t("common.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>
		</ServicePageShell>
	);
}
