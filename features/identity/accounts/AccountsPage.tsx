"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { Button, NoContentState, SomeErrorState } from "@/components";
import { AccountsFiltersDrawer } from "@/features/identity/accounts/AccountsFiltersDrawer";
import { AccountsRowActions } from "@/features/identity/accounts/AccountsRowActions";
import { useAccountsQuery } from "@/features/identity/accounts/queries";
import {
	createAccountColumns,
	filterAccounts,
	getAccountEmptyStateCopy,
	getAccountFilterSummary,
	getAccountsListErrorToastContent,
} from "@/features/identity/accounts/utils";
import {
	ServicePageHeader,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import { useDraftFilters, useQueryErrorToasts } from "@/hooks";
import type { AccountResponse } from "@/types";
import type { AccountSecondaryFilters } from "@/types";

export function AccountsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<AccountSecondaryFilters>(
		() => ({
			activeFilter: "",
			accountTypeFilter: "",
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
	} = useDraftFilters<AccountSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const accountsQuery = useAccountsQuery();

	const filteredAccounts = useMemo(
		() =>
			filterAccounts(accountsQuery.data ?? [], {
				activeFilter: appliedFilters.activeFilter,
				accountTypeFilter: appliedFilters.accountTypeFilter,
				dateField: appliedFilters.dateField,
				query: deferredQuerySearch,
				endDate: appliedFilters.endDate,
				startDate: appliedFilters.startDate,
			}),
		[accountsQuery.data, appliedFilters, deferredQuerySearch],
	);
	const columns = useMemo(() => createAccountColumns(t), [t]);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getAccountFilterSummary(t, {
				activeFilter: appliedFilters.activeFilter,
				accountTypeFilter: appliedFilters.accountTypeFilter,
				dateField: appliedFilters.dateField,
				query: deferredQuerySearch,
				endDate: appliedFilters.endDate,
				startDate: appliedFilters.startDate,
			}),
		[appliedFilters, deferredQuerySearch, t],
	);
	const emptyStateCopy = useMemo(
		() => getAccountEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (accountsQuery.isError) {
			return (
				<SomeErrorState
					title={t("identity.accountPage.table.error.title")}
					description={t("identity.accountPage.table.error.description")}
					onRefresh={() => {
						void accountsQuery.refetch();
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
	}, [accountsQuery, emptyStateCopy.description, emptyStateCopy.title, t]);

	useQueryErrorToasts([
		{
			key: "accounts-list",
			error: accountsQuery.error,
			errorUpdatedAt: accountsQuery.errorUpdatedAt,
			getContent: error => getAccountsListErrorToastContent(t, error),
			isError: accountsQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearDraftFilters();
		setFiltersOpen(false);
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("identity.accountPage.title")}
				description={t("identity.accountPage.description")}
				metadata={{
					triggerLabel: t("identity.accountPage.metadata.trigger"),
					emptyTitle: t("identity.accountPage.metadata.empty.title"),
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
							{t("identity.accountPage.filters.clear")}
						</Button>
					) : undefined
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("identity.accountPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("identity.accountPage.filters.search.placeholder")}
				/>

				<AccountsFiltersDrawer
					activeFilter={draftFilters.activeFilter}
					accountTypeFilter={draftFilters.accountTypeFilter}
					dateField={draftFilters.dateField}
					endDate={draftFilters.endDate}
					hasActiveFilters={hasAppliedFilters}
					onActiveFilterChange={value => setDraftFilter("activeFilter", value)}
					onAccountTypeChange={value =>
						setDraftFilter("accountTypeFilter", value)
					}
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

			<ServicePageTableSection<AccountResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredAccounts,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<AccountsRowActions href={`/identity/accounts/${row.id}`} />
					),
					isLoading: accountsQuery.isLoading,
					loadingLabel: t("identity.accountPage.loading.list"),
				}}
			/>
		</ServicePageShell>
	);
}
