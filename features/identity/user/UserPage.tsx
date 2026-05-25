"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { Button, NoContentState, SomeErrorState } from "@/components";
import { UserDetailDialog } from "@/features/identity/user/UserDetailDialog";
import { UserFilters } from "@/features/identity/user/UserFilters";
import { UserRowActions } from "@/features/identity/user/UserRowActions";
import {
	useUserDetailQuery,
	useUsersQuery,
} from "@/features/identity/user/queries";
import {
	createUserColumns,
	filterUsers,
	getUserDetailErrorToastContent,
	getUserEmptyStateCopy,
	getUsersListErrorToastContent,
} from "@/features/identity/user/utils";
import {
	ServicePageHeader,
	ServicePageShell,
	ServicePageTableSection,
} from "@/features/shared/service-pages";
import { useQueryErrorToasts, useServicePageDetailState } from "@/hooks";
import type { UserResponse } from "@/types";
import type { UserAuditDateField } from "@/types";

export function UserPage() {
	const { t } = useTranslation();
	const [nameSearch, setNameSearch] = useState("");
	const [cpfSearch, setCpfSearch] = useState("");
	const [dateField, setDateField] = useState<UserAuditDateField>("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [dateFiltersOpen, setDateFiltersOpen] = useState(false);
	const detailState = useServicePageDetailState();
	const deferredNameSearch = useDeferredValue(nameSearch.trim());
	const deferredCpfSearch = useDeferredValue(cpfSearch.trim());
	const usersQuery = useUsersQuery();
	const userDetailQuery = useUserDetailQuery(detailState.selectedId);

	const allUsers = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
	const filteredUsers = useMemo(
		() =>
			filterUsers(allUsers, {
				cpfQuery: deferredCpfSearch,
				dateField,
				endDate,
				nameQuery: deferredNameSearch,
				startDate,
			}),
		[
			allUsers,
			dateField,
			deferredCpfSearch,
			deferredNameSearch,
			endDate,
			startDate,
		],
	);
	const columns = useMemo(() => createUserColumns(t), [t]);
	const hasActiveDateFilters = Boolean(dateField || startDate || endDate);
	const hasAnyFilters = Boolean(
		nameSearch.trim() || cpfSearch.trim() || hasActiveDateFilters,
	);
	const emptyStateCopy = useMemo(
		() =>
			getUserEmptyStateCopy(
				t,
				deferredNameSearch || deferredCpfSearch || startDate || endDate,
			),
		[t, deferredCpfSearch, deferredNameSearch, endDate, startDate],
	);
	const tableEmptyState = useMemo(() => {
		if (usersQuery.isError) {
			return (
				<SomeErrorState
					title={t("identity.userPage.table.error.title")}
					description={t("identity.userPage.table.error.description")}
					onRefresh={() => {
						void usersQuery.refetch();
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
	}, [emptyStateCopy, t, usersQuery]);

	useQueryErrorToasts([
		{
			key: "users-list",
			error: usersQuery.error,
			errorUpdatedAt: usersQuery.errorUpdatedAt,
			getContent: error => getUsersListErrorToastContent(t, error),
			isError: usersQuery.isError,
		},
		{
			key: "user-detail",
			error: userDetailQuery.error,
			errorUpdatedAt: userDetailQuery.errorUpdatedAt,
			getContent: error => getUserDetailErrorToastContent(t, error),
			isError: userDetailQuery.isError,
		},
	]);

	function clearFilters() {
		setNameSearch("");
		setCpfSearch("");
		setDateField("");
		setStartDate("");
		setEndDate("");
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("identity.userPage.title")}
				description={t("identity.userPage.description")}
				metadata={{
					triggerLabel: t("identity.userPage.metadata.trigger"),
					emptyTitle: t("identity.userPage.metadata.empty.title"),
					emptyDescription: t("identity.userPage.metadata.empty.description"),
				}}
				actions={
					hasAnyFilters ? (
						<Button
							variant="secondary"
							onClick={clearFilters}
						>
							{t("identity.userPage.filters.clear")}
						</Button>
					) : undefined
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)_auto]"
			>
				<UserFilters
					cpfSearch={cpfSearch}
					dateField={dateField}
					dateFiltersOpen={dateFiltersOpen}
					endDate={endDate}
					nameSearch={nameSearch}
					onCpfSearchChange={setCpfSearch}
					onDateFieldChange={setDateField}
					onDateFiltersOpenChange={setDateFiltersOpen}
					onEndDateChange={setEndDate}
					onNameSearchChange={setNameSearch}
					onStartDateChange={setStartDate}
					startDate={startDate}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<UserResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredUsers,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<UserRowActions
							user={row}
							onView={detailState.openDetail}
						/>
					),
					isLoading: usersQuery.isLoading,
					loadingLabel: t("identity.userPage.loading.list"),
				}}
			/>

			<UserDetailDialog
				error={userDetailQuery.error}
				isError={userDetailQuery.isError}
				isLoading={userDetailQuery.isLoading}
				onOpenChange={detailState.handleOpenChange}
				onRefresh={() => {
					void userDetailQuery.refetch();
				}}
				open={detailState.isOpen}
				user={userDetailQuery.data}
			/>
		</ServicePageShell>
	);
}
