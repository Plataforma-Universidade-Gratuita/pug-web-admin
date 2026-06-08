"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import {
	ServicePageConfirmDialog,
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/components/composite";
import {
	DatePicker,
	Label,
	NoContentState,
	SomeErrorState,
	toast,
} from "@/components/primitives";
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
	getCrudDeleteConfirmCopy,
	getCrudDeleteUndoToastContent,
	getCrudSuccessToastContent,
} from "@/features/utils";
import {
	useDeferredUndoAction,
	useQueryErrorToasts,
	useServicePageEditorState,
} from "@/hooks";
import type { AreaOfExpertiseResponse } from "@/types/api";
import type { AreaOfExpertiseEditorMode } from "@/types/client";

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
			getAreaOfExpertiseFilterSummary({
				query: deferredQuerySearch,
				startDate: startDateFilter,
				endDate: endDateFilter,
			}),
		[deferredQuerySearch, endDateFilter, startDateFilter],
	);
	const emptyStateCopy = useMemo(
		() => getAreaOfExpertiseEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const deleteConfirmCopy = useMemo(
		() =>
			getCrudDeleteConfirmCopy(
				t,
				t("common.objects.areaOfExpertise"),
				pendingDeleteAreaOfExpertise?.name ?? "",
			),
		[pendingDeleteAreaOfExpertise?.name, t],
	);
	const tableEmptyState = useMemo(() => {
		if (areasOfExpertiseQuery.isError) {
			return (
				<SomeErrorState
					title={t("common.errors.listLoad.title")}
					description={t("common.errors.listLoad.description")}
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
					const { title, description } = getCrudSuccessToastContent(
						t,
						"duplicate",
						createdAreaOfExpertise.name,
					);
					toast.success(title, { description });
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
			...getCrudDeleteUndoToastContent(t, areaOfExpertise.name),
			onCommit: () => {
				removeAreaOfExpertiseMutation.mutate(
					{
						id: areaOfExpertise.id,
					},
					{
						onSuccess: () => {
							const { title, description } = getCrudSuccessToastContent(
								t,
								"delete",
								areaOfExpertise.name,
							);
							toast.success(title, { description });

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
					label={t("common.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("common.filters.name.placeholder")}
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
				title={deleteConfirmCopy.title}
				description={deleteConfirmCopy.description}
				cancelLabel={t("common.cancel")}
				actionLabel={t("table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>
		</ServicePageShell>
	);
}
