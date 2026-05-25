"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { Button, NoContentState, SomeErrorState } from "@/components";
import { UsersFilters } from "@/features/identity/users/UsersFilters";
import { UsersRowActions } from "@/features/identity/users/UsersRowActions";
import { useUsersQuery } from "@/features/identity/users/queries";
import {
	createUserColumns,
	filterUsers,
	getUserEmptyStateCopy,
	getUsersListErrorToastContent,
} from "@/features/identity/users/utils";
import {
	ServicePageHeader,
	ServicePageShell,
	ServicePageTableSection,
} from "@/features/shared/service-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { UserResponse } from "@/types";
import type { UserAuditDateField } from "@/types";

export function UsersPage() {
	const { t } = useTranslation();
	const [nameSearch, setNameSearch] = useState("");
	const [cpfSearch, setCpfSearch] = useState("");
	const [dateField, setDateField] = useState<UserAuditDateField>("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [dateFiltersOpen, setDateFiltersOpen] = useState(false);
	const deferredNameSearch = useDeferredValue(nameSearch.trim());
	const deferredCpfSearch = useDeferredValue(cpfSearch.trim());
	const usersQuery = useUsersQuery();

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
				<UsersFilters
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
						<UsersRowActions href={`/identity/users/${row.id}`} />
					),
					isLoading: usersQuery.isLoading,
					loadingLabel: t("identity.userPage.loading.list"),
				}}
			/>
		</ServicePageShell>
	);
}
