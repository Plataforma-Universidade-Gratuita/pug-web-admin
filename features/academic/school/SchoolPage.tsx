"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { SchoolDetailDialog } from "@/features/academic/school/SchoolDetailDialog";
import { SchoolEditorDrawer } from "@/features/academic/school/SchoolEditorDrawer";
import { SchoolFiltersDrawer } from "@/features/academic/school/SchoolFiltersDrawer";
import { SchoolRowActions } from "@/features/academic/school/SchoolRowActions";
import { useRemoveSchoolMutation } from "@/features/academic/school/mutations";
import {
	useSchoolDetailQuery,
	useSchoolsQuery,
} from "@/features/academic/school/queries";
import {
	createSchoolColumns,
	filterSchools,
	getSchoolDeleteErrorToastContent,
	getSchoolDetailErrorToastContent,
	getSchoolEmptyStateCopy,
	getSchoolFilterSummary,
	getSchoolsListErrorToastContent,
} from "@/features/academic/school/utils";
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
import type { SchoolResponse } from "@/types";
import type { SchoolEditorMode, SchoolSecondaryFilters } from "@/types";

export function SchoolPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<SchoolSecondaryFilters>(
		() => ({
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
	} = useDraftFilters<SchoolSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const detailState = useServicePageDetailState();
	const editorState = useServicePageEditorState<SchoolEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingDeleteSchool, setPendingDeleteSchool] =
		useState<SchoolResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const schoolsQuery = useSchoolsQuery();
	const schoolDetailQuery = useSchoolDetailQuery(detailState.selectedId);
	const removeSchoolMutation = useRemoveSchoolMutation();
	const { schedule } = useDeferredUndoAction();

	const filteredSchools = useMemo(
		() =>
			filterSchools(schoolsQuery.data ?? [], {
				query: deferredQuerySearch,
				dateField: appliedFilters.dateField,
				startDate: appliedFilters.startDate,
				endDate: appliedFilters.endDate,
			}),
		[appliedFilters, deferredQuerySearch, schoolsQuery.data],
	);
	const columns = useMemo(() => createSchoolColumns(t), [t]);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getSchoolFilterSummary(t, {
				query: deferredQuerySearch,
				dateField: appliedFilters.dateField,
				startDate: appliedFilters.startDate,
				endDate: appliedFilters.endDate,
			}),
		[appliedFilters, deferredQuerySearch, t],
	);
	const emptyStateCopy = useMemo(
		() => getSchoolEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (schoolsQuery.isError) {
			return (
				<SomeErrorState
					title={t("academic.schoolPage.table.error.title")}
					description={t("academic.schoolPage.table.error.description")}
					onRefresh={() => {
						void schoolsQuery.refetch();
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
	}, [emptyStateCopy.description, emptyStateCopy.title, schoolsQuery, t]);

	useQueryErrorToasts([
		{
			key: "schools-list",
			error: schoolsQuery.error,
			errorUpdatedAt: schoolsQuery.errorUpdatedAt,
			getContent: error => getSchoolsListErrorToastContent(t, error),
			isError: schoolsQuery.isError,
		},
		{
			key: "school-detail",
			error: schoolDetailQuery.error,
			errorUpdatedAt: schoolDetailQuery.errorUpdatedAt,
			getContent: error => getSchoolDetailErrorToastContent(t, error),
			isError: schoolDetailQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearDraftFilters();
		setFiltersOpen(false);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteSchool) {
			return;
		}

		const school = pendingDeleteSchool;
		setPendingDeleteSchool(null);

		schedule({
			key: school.id,
			title: t("academic.schoolPage.delete.undo.title"),
			description: t("academic.schoolPage.delete.undo.description", {
				name: school.name,
			}),
			undoLabel: t("academic.schoolPage.delete.undo.action"),
			onCommit: () => {
				removeSchoolMutation.mutate(
					{
						id: school.id,
					},
					{
						onSuccess: () => {
							toast.success(
								t("academic.schoolPage.delete.feedback.success.title"),
								{
									description: t(
										"academic.schoolPage.delete.feedback.success.description",
										{
											name: school.name,
										},
									),
								},
							);

							detailState.clearIfMatches(school.id);
							editorState.clearIfMatches(school.id);
						},
						onError: error => {
							const { title, description } = getSchoolDeleteErrorToastContent(
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
				title={t("academic.schoolPage.title")}
				description={t("academic.schoolPage.description")}
				metadata={{
					triggerLabel: t("academic.schoolPage.metadata.trigger"),
					emptyTitle: t("academic.schoolPage.metadata.empty.title"),
					emptyDescription: t("academic.schoolPage.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("academic.schoolPage.filters.clear")}
						createLabel={t("academic.schoolPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("academic.schoolPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("academic.schoolPage.filters.search.placeholder")}
				/>

				<SchoolFiltersDrawer
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
					onStartDateChange={value => setDraftFilter("startDate", value)}
					open={filtersOpen}
					startDate={draftFilters.startDate}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<SchoolResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredSchools,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<SchoolRowActions
							onDelete={setPendingDeleteSchool}
							onOpenEditor={editorState.openEditor}
							onView={detailState.openDetail}
							school={row}
						/>
					),
					isLoading: schoolsQuery.isLoading,
					loadingLabel: t("academic.schoolPage.loading.list"),
				}}
			/>

			<SchoolEditorDrawer
				schoolId={editorState.editorId}
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
			/>

			<SchoolDetailDialog
				error={schoolDetailQuery.error}
				isError={schoolDetailQuery.isError}
				isLoading={schoolDetailQuery.isLoading}
				onOpenChange={detailState.handleOpenChange}
				onRefresh={() => {
					void schoolDetailQuery.refetch();
				}}
				open={detailState.isOpen}
				school={schoolDetailQuery.data}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteSchool !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteSchool(null);
					}
				}}
				variant="danger"
				title={t("academic.schoolPage.delete.confirm.title")}
				description={t("academic.schoolPage.delete.confirm.description", {
					name: pendingDeleteSchool?.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("academic.schoolPage.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>
		</ServicePageShell>
	);
}
