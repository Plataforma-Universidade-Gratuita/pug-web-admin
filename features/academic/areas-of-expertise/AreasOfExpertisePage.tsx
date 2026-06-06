"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { web } from "@/api";
import {
	DatePicker,
	Label,
	NoContentState,
	SomeErrorState,
	toast,
} from "@/components";
import { AreaOfExpertiseEditorDrawer } from "@/features/academic/areas-of-expertise/AreaOfExpertiseEditorDrawer";
import { AreasOfExpertiseRowActions } from "@/features/academic/areas-of-expertise/AreasOfExpertiseRowActions";
import {
	appendCopyToAreaOfExpertiseName,
	createAreaOfExpertiseColumns,
	filterAreasOfExpertise,
	getAreaOfExpertiseDeleteErrorToastContent,
	getAreaOfExpertiseDuplicateErrorToastContent,
	getAreaOfExpertiseEmptyStateCopy,
	getAreaOfExpertiseFilterSummary,
	getAreasOfExpertiseListErrorToastContent,
} from "@/features/academic/areas-of-expertise/utils";
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
	useQueryErrorToasts,
	useServicePageEditorState,
} from "@/hooks";
import type { AreaOfExpertiseEditorMode } from "@/types";
import type { AreaOfExpertiseResponse } from "@/types";

const { areasOfExpertise: areasOfExpertiseApi } = web.academic;
const {
	useCreateAreaOfExpertiseMutation,
	useRemoveAreaOfExpertiseMutation,
	useAreasOfExpertiseQuery,
} = areasOfExpertiseApi;

export function AreasOfExpertisePage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [startDateFilter, setStartDateFilter] = useState("");
	const [endDateFilter, setEndDateFilter] = useState("");
	const editorState = useServicePageEditorState<AreaOfExpertiseEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingDeleteAreaOfExpertise, setPendingDeleteAreaOfExpertise] =
		useState<AreaOfExpertiseResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const areasOfExpertiseQuery = useAreasOfExpertiseQuery();
	const createAreaOfExpertiseMutation = useCreateAreaOfExpertiseMutation();
	const removeAreaOfExpertiseMutation = useRemoveAreaOfExpertiseMutation();
	const { schedule } = useDeferredUndoAction();

	const filteredAreasOfExpertise = useMemo(
		() =>
			filterAreasOfExpertise(areasOfExpertiseQuery.data ?? [], {
				query: deferredQuerySearch,
				startDate: startDateFilter,
				endDate: endDateFilter,
			}),
		[
			areasOfExpertiseQuery.data,
			deferredQuerySearch,
			endDateFilter,
			startDateFilter,
		],
	);
	const columns = useMemo(() => createAreaOfExpertiseColumns(t), [t]);
	const hasAnyFilters = Boolean(
		querySearch.trim() || startDateFilter || endDateFilter,
	);
	const filterSummary = useMemo(
		() =>
			getAreaOfExpertiseFilterSummary(t, {
				query: deferredQuerySearch,
				startDate: startDateFilter,
				endDate: endDateFilter,
			}),
		[deferredQuerySearch, endDateFilter, startDateFilter, t],
	);
	const emptyStateCopy = useMemo(
		() => getAreaOfExpertiseEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (areasOfExpertiseQuery.isError) {
			return (
				<SomeErrorState
					title={t("academic.areaOfExpertisePage.table.error.title")}
					description={t(
						"academic.areaOfExpertisePage.table.error.description",
					)}
					onRefresh={() => {
						void areasOfExpertiseQuery.refetch();
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
		areasOfExpertiseQuery,
		emptyStateCopy.description,
		emptyStateCopy.title,
		t,
	]);

	useQueryErrorToasts([
		{
			key: "areas-of-expertise-list",
			error: areasOfExpertiseQuery.error,
			errorUpdatedAt: areasOfExpertiseQuery.errorUpdatedAt,
			getContent: error => getAreasOfExpertiseListErrorToastContent(t, error),
			isError: areasOfExpertiseQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		setStartDateFilter("");
		setEndDateFilter("");
	}

	function handleDuplicate(areaOfExpertise: AreaOfExpertiseResponse) {
		const copiedName = appendCopyToAreaOfExpertiseName(areaOfExpertise.name);

		createAreaOfExpertiseMutation.mutate(
			{
				body: {
					name: copiedName,
				},
			},
			{
				onSuccess: createdAreaOfExpertise => {
					toast.success(
						t("academic.areaOfExpertisePage.duplicate.feedback.success.title"),
						{
							description: t(
								"academic.areaOfExpertisePage.duplicate.feedback.success.description",
								{
									name: createdAreaOfExpertise.name,
								},
							),
						},
					);
				},
				onError: error => {
					const { title, description } =
						getAreaOfExpertiseDuplicateErrorToastContent(t, error);
					toast.danger(title, { description });
				},
			},
		);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteAreaOfExpertise) {
			return;
		}

		const areaOfExpertise = pendingDeleteAreaOfExpertise;
		setPendingDeleteAreaOfExpertise(null);

		schedule({
			key: areaOfExpertise.id,
			title: t("academic.areaOfExpertisePage.delete.undo.title"),
			description: t("academic.areaOfExpertisePage.delete.undo.description", {
				name: areaOfExpertise.name,
			}),
			undoLabel: t("academic.areaOfExpertisePage.delete.undo.action"),
			onCommit: () => {
				removeAreaOfExpertiseMutation.mutate(
					{
						id: areaOfExpertise.id,
					},
					{
						onSuccess: () => {
							toast.success(
								t("academic.areaOfExpertisePage.delete.feedback.success.title"),
								{
									description: t(
										"academic.areaOfExpertisePage.delete.feedback.success.description",
										{
											name: areaOfExpertise.name,
										},
									),
								},
							);

							editorState.clearIfMatches(areaOfExpertise.id);
						},
						onError: error => {
							const { title, description } =
								getAreaOfExpertiseDeleteErrorToastContent(t, error);
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
				title={t("academic.areaOfExpertisePage.title")}
				description={t("academic.areaOfExpertisePage.description")}
				metadata={{
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t("common.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("common.filters.clear")}
						createLabel={t("academic.areaOfExpertisePage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,0.8fr)]"
			>
				<TextFieldFilter
					label={t("academic.areaOfExpertisePage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t(
						"academic.areaOfExpertisePage.filters.search.placeholder",
					)}
				/>

				<div className="grid gap-2">
					<Label>
						{t("academic.areaOfExpertisePage.filters.startDate.label")}
					</Label>
					<DatePicker
						value={startDateFilter}
						onValueChange={setStartDateFilter}
						placeholder={t(
							"academic.areaOfExpertisePage.filters.startDate.placeholder",
						)}
						panelSide="bottom"
						panelAlign="start"
						panelAvoidCollisions
						panelCollisionPadding={16}
					/>
				</div>

				<div className="grid gap-2">
					<Label>
						{t("academic.areaOfExpertisePage.filters.endDate.label")}
					</Label>
					<DatePicker
						value={endDateFilter}
						onValueChange={setEndDateFilter}
						placeholder={t(
							"academic.areaOfExpertisePage.filters.endDate.placeholder",
						)}
						panelSide="bottom"
						panelAlign="start"
						panelAvoidCollisions
						panelCollisionPadding={16}
					/>
				</div>
			</ServicePageHeader>

			<ServicePageTableSection<AreaOfExpertiseResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredAreasOfExpertise,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<AreasOfExpertiseRowActions
							areaOfExpertise={row}
							href={`/academic/areas-of-expertise/${row.id}`}
							onDelete={setPendingDeleteAreaOfExpertise}
							onDuplicate={handleDuplicate}
							onOpenEditor={editorState.openEditor}
						/>
					),
					isLoading: areasOfExpertiseQuery.isLoading,
					loadingLabel: t("academic.areaOfExpertisePage.loading.list"),
				}}
			/>

			<AreaOfExpertiseEditorDrawer
				areaOfExpertiseId={editorState.editorId}
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteAreaOfExpertise !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteAreaOfExpertise(null);
					}
				}}
				variant="danger"
				title={t("academic.areaOfExpertisePage.delete.confirm.title")}
				description={t(
					"academic.areaOfExpertisePage.delete.confirm.description",
					{
						name: pendingDeleteAreaOfExpertise?.name ?? "",
					},
				)}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>
		</ServicePageShell>
	);
}
