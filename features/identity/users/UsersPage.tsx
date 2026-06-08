"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import {
	ServicePageHeader,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
} from "@/components/composite";
import {
	Button,
	NoContentState,
	SomeErrorState,
} from "@/components/primitives";
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
	useDraftFilters,
	useQueryErrorToasts,
	useServicePagePagination,
} from "@/hooks";
import type { UserResponse } from "@/types/api";
import type { UserComplexSearchFilters } from "@/types/client";

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
	const {
		currentPage,
		isAll,
		pageSize,
		resetPage,
		setCurrentPage,
		setPageSize,
		backendPage,
		backendSize,
	} = usersPagination;
	const usersQuery = useUsersQuery(usersPagination.isAll);
	const usersSearchQuery = useUsersSearchQuery(
		backendPage ?? 0,
		backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters,
		!isAll,
	);
	const activeQuery = isAll ? usersQuery : usersSearchQuery;
	const allUsers = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
	const backendFilteredUsers = useMemo(
		() => filterUsersByComplexSearch(allUsers, appliedFilters),
		[allUsers, appliedFilters],
	);
	const tableSourceUsers = useMemo(
		() =>
			isAll ? backendFilteredUsers : (usersSearchQuery.data?.content ?? []),
		[backendFilteredUsers, isAll, usersSearchQuery.data],
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
					title={t("common.errors.listLoad.title")}
					description={t("common.errors.listLoad.description")}
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

	const totalElements = isAll
		? backendFilteredUsers.length
		: (usersSearchQuery.data?.totalElements ?? 0);
	const totalPages = isAll
		? 1
		: Math.max(usersSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (isAll || !usersSearchQuery.data || currentPage <= totalPages) {
			return;
		}

		setCurrentPage(totalPages);
	}, [currentPage, isAll, setCurrentPage, usersSearchQuery.data, totalPages]);

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
		resetPage();
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
						resetPage();
						applyDraftFilters();
						setBackendFiltersOpen(false);
					}}
					onBackendFilterChange={(key, value) => {
						setDraftFilter(key, value);
					}}
					onBackendFiltersOpenChange={setBackendFiltersOpen}
					onClearBackendFilters={() => {
						clearFilters();
						resetPage();
						setBackendFiltersOpen(false);
					}}
					onFrontendCpfSearchChange={setFrontendCpfSearch}
					onFrontendNameSearchChange={setFrontendNameSearch}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<UserResponse>
				footer={
					<ServicePagePagination
						currentPage={currentPage}
						pageSize={pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						onPageSizeChange={setPageSize}
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
