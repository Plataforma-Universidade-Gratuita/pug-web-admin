"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { AdminActionDialogs } from "@/features/identity/admin/AdminActionDialogs";
import { AdminDetailDialog } from "@/features/identity/admin/AdminDetailDialog";
import { AdminFilters } from "@/features/identity/admin/AdminFilters";
import { AdminRowActions } from "@/features/identity/admin/AdminRowActions";
import { AdminUpdateDrawer } from "@/features/identity/admin/AdminUpdateDrawer";
import {
	useRemoveAdminMutation,
	useSetAdminActiveMutation,
} from "@/features/identity/admin/mutations";
import {
	useAdminDetailQuery,
	useAdminsQuery,
	useLinkedAdminAccountQuery,
	useLinkedAdminUserQuery,
} from "@/features/identity/admin/queries";
import {
	createAdminColumns,
	filterAdmins,
	getAdminDeleteErrorToastContent,
	getAdminDetailErrorToastContent,
	getAdminEmptyStateCopy,
	getAdminFilterSummary,
	getAdminSetActiveErrorToastContent,
	getAdminsListErrorToastContent,
	getLinkedAdminAccountErrorToastContent,
	getLinkedAdminUserErrorToastContent,
} from "@/features/identity/admin/utils";
import {
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePageShell,
	ServicePageTableSection,
} from "@/features/shared/service-pages";
import { useDeferredUndoAction, useQueryErrorToast } from "@/hooks";
import type { AdminResponse } from "@/types/api";
import type {
	AdminCampusFilter,
	AdminEditorMode,
} from "@/types/client/identity";

export function AdminPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [campusFilter, setCampusFilter] = useState<AdminCampusFilter>("");
	const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
	const [editorState, setEditorState] = useState<{
		id: string | null;
		mode: AdminEditorMode;
	} | null>(null);
	const [pendingStatusAdmin, setPendingStatusAdmin] = useState<{
		active: boolean;
		admin: AdminResponse;
	} | null>(null);
	const [pendingDeleteAdmin, setPendingDeleteAdmin] =
		useState<AdminResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const adminsQuery = useAdminsQuery();
	const adminDetailQuery = useAdminDetailQuery(selectedAdminId);
	const linkedAccountQuery = useLinkedAdminAccountQuery(
		adminDetailQuery.data?.accountId ?? null,
	);
	const linkedUserQuery = useLinkedAdminUserQuery(
		adminDetailQuery.data?.userId ?? null,
	);
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

	useQueryErrorToast({
		error: adminsQuery.error,
		errorUpdatedAt: adminsQuery.errorUpdatedAt,
		getContent: error => getAdminsListErrorToastContent(t, error),
		isError: adminsQuery.isError,
	});
	useQueryErrorToast({
		error: adminDetailQuery.error,
		errorUpdatedAt: adminDetailQuery.errorUpdatedAt,
		getContent: error => getAdminDetailErrorToastContent(t, error),
		isError: adminDetailQuery.isError,
	});
	useQueryErrorToast({
		error: linkedAccountQuery.error,
		errorUpdatedAt: linkedAccountQuery.errorUpdatedAt,
		getContent: error => getLinkedAdminAccountErrorToastContent(t, error),
		isError: linkedAccountQuery.isError,
	});
	useQueryErrorToast({
		error: linkedUserQuery.error,
		errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
		getContent: error => getLinkedAdminUserErrorToastContent(t, error),
		isError: linkedUserQuery.isError,
	});

	function clearFilters() {
		setQuerySearch("");
		setCampusFilter("");
	}

	function handleStatusChangeConfirm() {
		if (!pendingStatusAdmin) {
			return;
		}

		const { active, admin } = pendingStatusAdmin;

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

							if (selectedAdminId === admin.accountId) {
								setSelectedAdminId(null);
							}

							if (editorState?.id === admin.accountId) {
								setEditorState(null);
							}
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

	function openEditor(id: string, mode: AdminEditorMode) {
		window.setTimeout(() => {
			setEditorState({ id, mode });
		}, 0);
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
						onCreate={() => setEditorState({ id: null, mode: "create" })}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(16rem,0.9fr)]"
			>
				<AdminFilters
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
						<AdminRowActions
							admin={row}
							onDelete={setPendingDeleteAdmin}
							onSetActive={(admin, active) =>
								setPendingStatusAdmin({ active, admin })
							}
							onView={setSelectedAdminId}
							onOpenEditor={openEditor}
						/>
					),
					isLoading: adminsQuery.isLoading,
					loadingLabel: t("identity.adminPage.loading.list"),
				}}
			/>

			<AdminUpdateDrawer
				adminId={editorState?.id ?? null}
				mode={editorState?.mode ?? "update"}
				open={editorState !== null}
				onOpenChange={open => {
					if (!open) {
						setEditorState(null);
					}
				}}
			/>

			<AdminDetailDialog
				admin={adminDetailQuery.data}
				error={adminDetailQuery.error}
				isError={adminDetailQuery.isError}
				isLoading={adminDetailQuery.isLoading}
				linkedAccount={linkedAccountQuery.data}
				linkedAccountError={linkedAccountQuery.error}
				linkedAccountIsError={linkedAccountQuery.isError}
				linkedAccountIsLoading={linkedAccountQuery.isLoading}
				linkedUser={linkedUserQuery.data}
				linkedUserError={linkedUserQuery.error}
				linkedUserIsError={linkedUserQuery.isError}
				linkedUserIsLoading={linkedUserQuery.isLoading}
				onLinkedAccountRefresh={() => {
					void linkedAccountQuery.refetch();
				}}
				onLinkedUserRefresh={() => {
					void linkedUserQuery.refetch();
				}}
				onOpenChange={open => {
					if (!open) {
						setSelectedAdminId(null);
					}
				}}
				onRefresh={() => {
					void adminDetailQuery.refetch();
				}}
				open={selectedAdminId !== null}
			/>

			<AdminActionDialogs
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
