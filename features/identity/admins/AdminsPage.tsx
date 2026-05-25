"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { AdminsActionDialogs } from "@/features/identity/admins/AdminActionDialogs";
import { AdminsFilters } from "@/features/identity/admins/AdminsFilters";
import { AdminsRowActions } from "@/features/identity/admins/AdminsRowActions";
import { AdminsUpdateDrawer } from "@/features/identity/admins/AdminsUpdateDrawer";
import {
	useRemoveAdminMutation,
	useSetAdminActiveMutation,
} from "@/features/identity/admins/mutations";
import {
	useCurrentAdminQuery,
	useAdminsQuery,
} from "@/features/identity/admins/queries";
import {
	createAdminColumns,
	filterAdmins,
	getAdminDeleteErrorToastContent,
	getAdminEmptyStateCopy,
	getAdminFilterSummary,
	getAdminSetActiveErrorToastContent,
	getAdminsListErrorToastContent,
} from "@/features/identity/admins/utils";
import {
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePageShell,
	ServicePageTableSection,
} from "@/features/shared/service-pages";
import {
	useDeferredUndoAction,
	useQueryErrorToasts,
	useServicePageEditorState,
} from "@/hooks";
import type { AdminResponse } from "@/types";
import type { AdminCampusFilter, AdminEditorMode } from "@/types";

export function AdminsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [campusFilter, setCampusFilter] = useState<AdminCampusFilter>("");
	const editorState = useServicePageEditorState<AdminEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingStatusAdmin, setPendingStatusAdmin] = useState<{
		active: boolean;
		admin: AdminResponse;
	} | null>(null);
	const [pendingDeleteAdmin, setPendingDeleteAdmin] =
		useState<AdminResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const adminsQuery = useAdminsQuery();
	const currentAdminQuery = useCurrentAdminQuery();
	const setAdminActiveMutation = useSetAdminActiveMutation();
	const removeAdminMutation = useRemoveAdminMutation();
	const { schedule } = useDeferredUndoAction();

	const filteredAdmins = useMemo(
		() =>
			filterAdmins(adminsQuery.data ?? [], {
				campusFilter,
				query: deferredQuerySearch,
			}),
		[adminsQuery.data, campusFilter, deferredQuerySearch],
	);
	const columns = useMemo(() => createAdminColumns(t), [t]);
	const hasAnyFilters = Boolean(querySearch.trim() || campusFilter);
	const filterSummary = useMemo(
		() =>
			getAdminFilterSummary(t, {
				campusFilter,
				query: deferredQuerySearch,
			}),
		[campusFilter, deferredQuerySearch, t],
	);
	const emptyStateCopy = useMemo(
		() => getAdminEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (adminsQuery.isError) {
			return (
				<SomeErrorState
					title={t("identity.adminPage.table.error.title")}
					description={t("identity.adminPage.table.error.description")}
					onRefresh={() => {
						void adminsQuery.refetch();
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
	}, [adminsQuery, emptyStateCopy.description, emptyStateCopy.title, t]);

	useQueryErrorToasts([
		{
			key: "admins-list",
			error: adminsQuery.error,
			errorUpdatedAt: adminsQuery.errorUpdatedAt,
			getContent: error => getAdminsListErrorToastContent(t, error),
			isError: adminsQuery.isError,
		},
	]);

	function clearFilters() {
		setQuerySearch("");
		setCampusFilter("");
	}

	function handleStatusChangeConfirm() {
		if (!pendingStatusAdmin) {
			return;
		}

		const { active, admin } = pendingStatusAdmin;
		const isCurrentAdmin =
			currentAdminQuery.data?.accountId === admin.accountId;

		if (!active && isCurrentAdmin) {
			setPendingStatusAdmin(null);
			return;
		}

		setAdminActiveMutation.mutate(
			{
				active,
				id: admin.accountId,
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							active
								? "identity.adminPage.reactivate.feedback.success.title"
								: "identity.adminPage.deactivate.feedback.success.title",
						),
						{
							description: t(
								active
									? "identity.adminPage.reactivate.feedback.success.description"
									: "identity.adminPage.deactivate.feedback.success.description",
								{
									name: admin.userName,
								},
							),
						},
					);
					setPendingStatusAdmin(null);
				},
				onError: error => {
					const { title, description } = getAdminSetActiveErrorToastContent(
						t,
						error,
						active,
					);
					toast.danger(title, { description });
					setPendingStatusAdmin(null);
				},
			},
		);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteAdmin) {
			return;
		}

		const admin = pendingDeleteAdmin;
		setPendingDeleteAdmin(null);

		schedule({
			key: admin.accountId,
			title: t("identity.adminPage.delete.undo.title"),
			description: t("identity.adminPage.delete.undo.description", {
				name: admin.userName,
			}),
			undoLabel: t("identity.adminPage.delete.undo.action"),
			onCommit: () => {
				removeAdminMutation.mutate(
					{
						accountId: admin.accountId,
						userId: admin.userId,
					},
					{
						onSuccess: () => {
							toast.success(
								t("identity.adminPage.delete.feedback.success.title"),
								{
									description: t(
										"identity.adminPage.delete.feedback.success.description",
										{
											name: admin.userName,
										},
									),
								},
							);

							editorState.clearIfMatches(admin.accountId);
						},
						onError: error => {
							const { title, description } = getAdminDeleteErrorToastContent(
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
				title={t("identity.adminPage.title")}
				description={t("identity.adminPage.description")}
				metadata={{
					triggerLabel: t("identity.adminPage.metadata.trigger"),
					emptyTitle: t("identity.adminPage.metadata.empty.title"),
					emptyDescription: t("identity.adminPage.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("identity.adminPage.filters.clear")}
						createLabel={t("identity.adminPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(16rem,0.9fr)]"
			>
				<AdminsFilters
					campusFilter={campusFilter}
					onCampusFilterChange={setCampusFilter}
					onSearchChange={setQuerySearch}
					querySearch={querySearch}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<AdminResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredAdmins,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<AdminsRowActions
							admin={row}
							canDeactivate={
								row.accountId !== currentAdminQuery.data?.accountId
							}
							href={`/identity/admins/${row.accountId}`}
							onDelete={setPendingDeleteAdmin}
							onSetActive={(admin, active) =>
								setPendingStatusAdmin({ active, admin })
							}
							onOpenEditor={editorState.openEditor}
						/>
					),
					isLoading: adminsQuery.isLoading,
					loadingLabel: t("identity.adminPage.loading.list"),
				}}
			/>

			<AdminsUpdateDrawer
				adminId={editorState.editorId}
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
			/>

			<AdminsActionDialogs
				onConfirmDelete={handleDeleteConfirm}
				onConfirmStatusChange={handleStatusChangeConfirm}
				onDeleteOpenChange={open => {
					if (!open) {
						setPendingDeleteAdmin(null);
					}
				}}
				onStatusOpenChange={open => {
					if (!open) {
						setPendingStatusAdmin(null);
					}
				}}
				pendingDeleteAdmin={pendingDeleteAdmin}
				pendingStatusAdmin={pendingStatusAdmin}
			/>
		</ServicePageShell>
	);
}
