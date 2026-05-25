"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	DropdownMenuInfoItem,
	NoContentState,
	SomeErrorState,
} from "@/components";
import { AccountDetailDialog } from "@/features/identity/account/AccountDetailDialog";
import { AccountFiltersDrawer } from "@/features/identity/account/AccountFiltersDrawer";
import {
	useAccountDetailQuery,
	useAccountsQuery,
	useLinkedUserQuery,
} from "@/features/identity/account/queries";
import {
	createAccountColumns,
	filterAccounts,
	getAccountDetailErrorToastContent,
	getAccountEmptyStateCopy,
	getAccountFilterSummary,
	getAccountsListErrorToastContent,
	getLinkedUserErrorToastContent,
} from "@/features/identity/account/utils";
import {
	ServicePageHeader,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageDetailState,
} from "@/hooks";
import type { AccountResponse } from "@/types";
import type { AccountSecondaryFilters } from "@/types";

export function AccountPage() {
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
	const detailState = useServicePageDetailState();
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const accountsQuery = useAccountsQuery();
	const accountDetailQuery = useAccountDetailQuery(detailState.selectedId);
	const linkedUserQuery = useLinkedUserQuery(
		accountDetailQuery.data?.userId ?? null,
	);

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
		{
			key: "account-detail",
			error: accountDetailQuery.error,
			errorUpdatedAt: accountDetailQuery.errorUpdatedAt,
			getContent: error => getAccountDetailErrorToastContent(t, error),
			isError: accountDetailQuery.isError,
		},
		{
			key: "account-linked-user",
			error: linkedUserQuery.error,
			errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
			getContent: error => getLinkedUserErrorToastContent(t, error),
			isError: linkedUserQuery.isError,
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

				<AccountFiltersDrawer
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
						<DropdownMenuInfoItem
							icon={Eye}
							label={t("identity.accountPage.table.actions.viewDetails")}
							onClick={() => detailState.openDetail(row.id)}
						/>
					),
					isLoading: accountsQuery.isLoading,
					loadingLabel: t("identity.accountPage.loading.list"),
				}}
			/>

			<AccountDetailDialog
				account={accountDetailQuery.data}
				error={accountDetailQuery.error}
				isError={accountDetailQuery.isError}
				isLoading={accountDetailQuery.isLoading}
				linkedUser={linkedUserQuery.data}
				linkedUserError={linkedUserQuery.error}
				linkedUserIsError={linkedUserQuery.isError}
				linkedUserIsLoading={linkedUserQuery.isLoading}
				onLinkedUserRefresh={() => {
					void linkedUserQuery.refetch();
				}}
				onOpenChange={detailState.handleOpenChange}
				onRefresh={() => {
					void accountDetailQuery.refetch();
				}}
				open={detailState.isOpen}
			/>
		</ServicePageShell>
	);
}
