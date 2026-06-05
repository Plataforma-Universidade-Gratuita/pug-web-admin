"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import {
	useAccountsQuery,
	useAccountsSearchQuery,
} from "@/api/web/identity/accounts";
import { useUsersQuery } from "@/api/web/identity/users";
import { Button, NoContentState, SomeErrorState } from "@/components";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import { AccountsFiltersDrawer } from "@/features/identity/accounts/AccountsFiltersDrawer";
import { AccountsRowActions } from "@/features/identity/accounts/AccountsRowActions";
import {
	createAccountColumns,
	filterAccountListByBackendFilters,
	filterAccountsByBackendFilters,
	filterAccountsByFrontendFilters,
	getAccountEmptyStateCopy,
	getAccountFilterSummary,
	getAccountsListErrorToastContent,
	mapAccountsToSearchResponses,
} from "@/features/identity/accounts/utils";
import {
	ServicePageHeader,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDraftFilters,
	useQueryErrorToasts,
	useServicePagePagination,
} from "@/hooks";
import type {
	AccountComplexSearchFilters,
	AccountSearchResponse,
} from "@/types";

export function AccountsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const {
		appliedFilters,
		applyDraftFilters,
		clearFilters,
		draftFilters,
		hasAppliedFilters,
		setDraftFilter,
	} = useDraftFilters<AccountComplexSearchFilters>({
		initialFilters: {
			name: "",
			cpf: "",
			email: "",
			accountTypes: [],
			dateFrom: "",
			dateTo: "",
			activeOnly: true,
		},
	});
	const accountsPagination = useServicePagePagination({
		key: "identity.accounts",
	});
	const accountsQuery = useAccountsQuery(accountsPagination.isAll);
	const usersQuery = useUsersQuery(accountsPagination.isAll);
	const accountsSearchQuery = useAccountsSearchQuery(
		accountsPagination.backendPage ?? 0,
		accountsPagination.backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters,
		!accountsPagination.isAll,
	);
	const activeQueryError = accountsPagination.isAll
		? (accountsQuery.error ?? usersQuery.error)
		: accountsSearchQuery.error;
	const activeQueryErrorUpdatedAt = accountsPagination.isAll
		? Math.max(accountsQuery.errorUpdatedAt, usersQuery.errorUpdatedAt)
		: accountsSearchQuery.errorUpdatedAt;
	const activeQueryIsError = accountsPagination.isAll
		? accountsQuery.isError || usersQuery.isError
		: accountsSearchQuery.isError;
	const activeQueryIsLoading = accountsPagination.isAll
		? accountsQuery.isLoading || usersQuery.isLoading
		: accountsSearchQuery.isLoading;
	const allAccounts = useMemo(
		() => accountsQuery.data ?? [],
		[accountsQuery.data],
	);
	const allUsers = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
	const backendFilteredAllAccounts = useMemo(() => {
		if (!accountsPagination.isAll) {
			return [];
		}

		const filteredAccounts = filterAccountListByBackendFilters(
			allAccounts,
			allUsers,
			appliedFilters,
		);
		const userNameById = new Map(allUsers.map(user => [user.id, user.name]));

		return mapAccountsToSearchResponses(filteredAccounts, userNameById);
	}, [accountsPagination.isAll, allAccounts, allUsers, appliedFilters]);
	const backendFilteredSearchAccounts = useMemo(
		() =>
			filterAccountsByBackendFilters(
				accountsSearchQuery.data?.content ?? [],
				appliedFilters,
			),
		[accountsSearchQuery.data, appliedFilters],
	);
	const tableSourceAccounts = useMemo(
		() =>
			accountsPagination.isAll
				? backendFilteredAllAccounts
				: backendFilteredSearchAccounts,
		[
			accountsPagination.isAll,
			backendFilteredAllAccounts,
			backendFilteredSearchAccounts,
		],
	);
	const filteredAccounts = useMemo(
		() =>
			filterAccountsByFrontendFilters(tableSourceAccounts, {
				query: deferredQuerySearch,
			}),
		[tableSourceAccounts, deferredQuerySearch],
	);
	const columns = useMemo(() => createAccountColumns(t), [t]);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() => getAccountFilterSummary(t, appliedFilters, deferredQuerySearch),
		[appliedFilters, deferredQuerySearch, t],
	);
	const emptyStateCopy = useMemo(
		() => getAccountEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (activeQueryIsError) {
			return (
				<SomeErrorState
					title={t("identity.accountPage.table.error.title")}
					description={t("identity.accountPage.table.error.description")}
					onRefresh={() => {
						if (accountsPagination.isAll) {
							void Promise.all([accountsQuery.refetch(), usersQuery.refetch()]);
							return;
						}

						void accountsSearchQuery.refetch();
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
		accountsPagination.isAll,
		accountsQuery,
		accountsSearchQuery,
		activeQueryIsError,
		emptyStateCopy,
		t,
		usersQuery,
	]);

	const totalElements = accountsPagination.isAll
		? backendFilteredAllAccounts.length
		: (accountsSearchQuery.data?.totalElements ?? 0);
	const totalPages = accountsPagination.isAll
		? 1
		: Math.max(accountsSearchQuery.data?.totalPages ?? 1, 1);
	const accountsCurrentPage = accountsPagination.currentPage;
	const accountsAreShowingAll = accountsPagination.isAll;
	const setAccountsCurrentPage = accountsPagination.setCurrentPage;

	useEffect(() => {
		if (
			accountsAreShowingAll ||
			!accountsSearchQuery.data ||
			accountsCurrentPage <= totalPages
		) {
			return;
		}

		setAccountsCurrentPage(totalPages);
	}, [
		accountsAreShowingAll,
		accountsCurrentPage,
		accountsSearchQuery.data,
		setAccountsCurrentPage,
		totalPages,
	]);

	useQueryErrorToasts([
		{
			key: "accounts-list",
			error: activeQueryError,
			errorUpdatedAt: activeQueryErrorUpdatedAt,
			getContent: error => getAccountsListErrorToastContent(t, error),
			isError: activeQueryIsError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearFilters();
		accountsPagination.resetPage();
		setFiltersOpen(false);
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("identity.accountPage.title")}
				description={t("identity.accountPage.description")}
				metadata={{
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t(
						"identity.accountPage.metadata.empty.description",
					),
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
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("common.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("identity.accountPage.filters.search.placeholder")}
				/>

				<AccountsFiltersDrawer
					filters={draftFilters}
					hasActiveFilters={hasAppliedFilters}
					onApply={() => {
						accountsPagination.resetPage();
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onClear={clearAllFilters}
					onFilterChange={(key, value) => setDraftFilter(key, value)}
					onOpenChange={setFiltersOpen}
					open={filtersOpen}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<AccountSearchResponse>
				footer={
					<ServicePagePagination
						currentPage={accountsPagination.currentPage}
						pageSize={accountsPagination.pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={accountsPagination.setCurrentPage}
						onPageSizeChange={accountsPagination.setPageSize}
						disabled={activeQueryIsLoading}
					/>
				}
				tableProps={{
					className: "h-full",
					columns,
					data: filteredAccounts,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<AccountsRowActions href={`/identity/accounts/${row.id}`} />
					),
					isLoading: activeQueryIsLoading,
					loadingLabel: t("identity.accountPage.loading.list"),
				}}
			/>
		</ServicePageShell>
	);
}
