"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { Button, NoContentState, SomeErrorState } from "@/components";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import { UsersFilters } from "@/features/identity/users/UsersFilters";
import { UsersRowActions } from "@/features/identity/users/UsersRowActions";
import {
	createUserColumns,
	filterUsersByComplexSearch,
	filterUsersByFrontendFilters,
	getUserEmptyStateCopy,
	getUsersListErrorToastContent,
} from "@/features/identity/users/utils";
import {
	ServicePageHeader,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
} from "@/features/shared/service-pages";
import {
	useDraftFilters,
	useQueryErrorToasts,
	useServicePagePagination,
} from "@/hooks";
import type { UserComplexSearchFilters, UserResponse } from "@/types";

const { users: usersApi } = web.identity;
const { useUsersQuery, useUsersSearchQuery } = usersApi;

export function UsersPage() {
	const { t } = useTranslation();
	const [frontendNameSearch, setFrontendNameSearch] = useState("");
	const [frontendCpfSearch, setFrontendCpfSearch] = useState("");
	const [backendFiltersOpen, setBackendFiltersOpen] = useState(false);
	const deferredFrontendNameSearch = useDeferredValue(
		frontendNameSearch.trim(),
	);
	const deferredFrontendCpfSearch = useDeferredValue(frontendCpfSearch.trim());
	const {
		appliedFilters,
		draftFilters,
		hasAppliedFilters,
		applyDraftFilters,
		clearFilters,
		setDraftFilter,
	} = useDraftFilters<UserComplexSearchFilters>({
		initialFilters: {
			name: "",
			cpf: "",
			dateFrom: "",
			dateTo: "",
		},
	});
	const usersPagination = useServicePagePagination({
		key: "identity.users",
	});
	const usersQuery = useUsersQuery(usersPagination.isAll);
	const usersSearchQuery = useUsersSearchQuery(
		usersPagination.backendPage ?? 0,
		usersPagination.backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters,
		!usersPagination.isAll,
	);
	const activeQuery = usersPagination.isAll ? usersQuery : usersSearchQuery;
	const allUsers = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
	const backendFilteredUsers = useMemo(
		() => filterUsersByComplexSearch(allUsers, appliedFilters),
		[allUsers, appliedFilters],
	);
	const tableSourceUsers = useMemo(
		() =>
			usersPagination.isAll
				? backendFilteredUsers
				: (usersSearchQuery.data?.content ?? []),
		[backendFilteredUsers, usersPagination.isAll, usersSearchQuery.data],
	);
	const filteredUsers = useMemo(
		() =>
			filterUsersByFrontendFilters(tableSourceUsers, {
				cpfQuery: deferredFrontendCpfSearch,
				nameQuery: deferredFrontendNameSearch,
			}),
		[tableSourceUsers, deferredFrontendCpfSearch, deferredFrontendNameSearch],
	);
	const columns = useMemo(() => createUserColumns(t), [t]);
	const hasAnyFilters = Boolean(
		frontendNameSearch.trim() || frontendCpfSearch.trim() || hasAppliedFilters,
	);
	const emptyStateQuery = useMemo(
		() =>
			[
				deferredFrontendNameSearch,
				deferredFrontendCpfSearch,
				appliedFilters.name.trim(),
				appliedFilters.cpf.trim(),
				appliedFilters.dateFrom.trim(),
				appliedFilters.dateTo.trim(),
			]
				.filter(Boolean)
				.join(" | "),
		[
			appliedFilters.cpf,
			appliedFilters.dateFrom,
			appliedFilters.dateTo,
			appliedFilters.name,
			deferredFrontendCpfSearch,
			deferredFrontendNameSearch,
		],
	);
	const emptyStateCopy = useMemo(
		() => getUserEmptyStateCopy(t, emptyStateQuery),
		[t, emptyStateQuery],
	);
	const tableEmptyState = useMemo(() => {
		if (activeQuery.isError) {
			return (
				<SomeErrorState
					title={t("identity.userPage.table.error.title")}
					description={t("identity.userPage.table.error.description")}
					onRefresh={() => {
						void activeQuery.refetch();
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
	}, [activeQuery, emptyStateCopy, t]);

	const totalElements = usersPagination.isAll
		? backendFilteredUsers.length
		: (usersSearchQuery.data?.totalElements ?? 0);
	const totalPages = usersPagination.isAll
		? 1
		: Math.max(usersSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (
			usersPagination.isAll ||
			!usersSearchQuery.data ||
			usersPagination.currentPage <= totalPages
		) {
			return;
		}

		usersPagination.setCurrentPage(totalPages);
	}, [
		usersPagination.currentPage,
		usersPagination.isAll,
		usersPagination.setCurrentPage,
		usersSearchQuery.data,
		totalPages,
	]);

	useQueryErrorToasts([
		{
			key: "users-list",
			error: activeQuery.error,
			errorUpdatedAt: activeQuery.errorUpdatedAt,
			getContent: error => getUsersListErrorToastContent(t, error),
			isError: activeQuery.isError,
		},
	]);

	function clearAllFilters() {
		setFrontendNameSearch("");
		setFrontendCpfSearch("");
		clearFilters();
		usersPagination.resetPage();
		setBackendFiltersOpen(false);
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("identity.userPage.title")}
				description={t("identity.userPage.description")}
				metadata={{
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t("common.metadata.empty.description"),
				}}
				actions={
					hasAnyFilters ? (
						<Button
							variant="secondary"
							onClick={clearAllFilters}
						>
							{t("common.filters.clear")}
						</Button>
					) : undefined
				}
				filtersClassName="grid gap-2"
			>
				<UsersFilters
					backendFilters={draftFilters}
					backendFiltersOpen={backendFiltersOpen}
					frontendCpfSearch={frontendCpfSearch}
					frontendNameSearch={frontendNameSearch}
					hasBackendFilters={hasAppliedFilters}
					onApplyBackendFilters={() => {
						usersPagination.resetPage();
						applyDraftFilters();
						setBackendFiltersOpen(false);
					}}
					onBackendFilterChange={(key, value) => {
						setDraftFilter(key, value);
					}}
					onBackendFiltersOpenChange={setBackendFiltersOpen}
					onClearBackendFilters={() => {
						clearFilters();
						usersPagination.resetPage();
						setBackendFiltersOpen(false);
					}}
					onFrontendCpfSearchChange={setFrontendCpfSearch}
					onFrontendNameSearchChange={setFrontendNameSearch}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<UserResponse>
				footer={
					<ServicePagePagination
						currentPage={usersPagination.currentPage}
						pageSize={usersPagination.pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={usersPagination.setCurrentPage}
						onPageSizeChange={usersPagination.setPageSize}
						disabled={activeQuery.isLoading}
					/>
				}
				tableProps={{
					className: "h-full",
					columns,
					data: filteredUsers,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<UsersRowActions href={`/identity/users/${row.id}`} />
					),
					isLoading: activeQuery.isLoading,
					loadingLabel: t("identity.userPage.loading.list"),
				}}
			/>
		</ServicePageShell>
	);
}
