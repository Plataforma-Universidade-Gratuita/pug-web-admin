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
import { useQueryErrorToast } from "@/hooks";
import type { AccountResponse } from "@/types/api";
import type {
	AccountActiveFilter,
	AccountAuditDateField,
	AccountTypeFilter,
} from "@/types/client/identity";

export function AccountPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [draftActiveFilter, setDraftActiveFilter] =
		useState<AccountActiveFilter>("");
	const [draftAccountTypeFilter, setDraftAccountTypeFilter] =
		useState<AccountTypeFilter>("");
	const [draftDateField, setDraftDateField] =
		useState<AccountAuditDateField>("");
	const [draftStartDate, setDraftStartDate] = useState("");
	const [draftEndDate, setDraftEndDate] = useState("");
	const [activeFilter, setActiveFilter] = useState<AccountActiveFilter>("");
	const [accountTypeFilter, setAccountTypeFilter] =
		useState<AccountTypeFilter>("");
	const [dateField, setDateField] = useState<AccountAuditDateField>("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
		null,
	);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const accountsQuery = useAccountsQuery();
	const accountDetailQuery = useAccountDetailQuery(selectedAccountId);
	const linkedUserQuery = useLinkedUserQuery(
		accountDetailQuery.data?.userId ?? null,
	);

	const filteredAccounts = useMemo(
		() =>
			filterAccounts(accountsQuery.data ?? [], {
				activeFilter,
				accountTypeFilter,
				dateField,
				query: deferredQuerySearch,
				endDate,
				startDate,
			}),
		[
			accountTypeFilter,
			activeFilter,
			accountsQuery.data,
			dateField,
			deferredQuerySearch,
			endDate,
			startDate,
		],
	);
	const columns = useMemo(() => createAccountColumns(t), [t]);
	const hasSecondaryFilters = Boolean(
		activeFilter || accountTypeFilter || dateField || startDate || endDate,
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasSecondaryFilters);
	const filterSummary = useMemo(
		() =>
			getAccountFilterSummary(t, {
				activeFilter,
				accountTypeFilter,
				dateField,
				query: deferredQuerySearch,
				endDate,
				startDate,
			}),
		[
			accountTypeFilter,
			activeFilter,
			dateField,
			deferredQuerySearch,
			endDate,
			startDate,
			t,
		],
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

	useQueryErrorToast({
		error: accountsQuery.error,
		errorUpdatedAt: accountsQuery.errorUpdatedAt,
		getContent: error => getAccountsListErrorToastContent(t, error),
		isError: accountsQuery.isError,
	});
	useQueryErrorToast({
		error: accountDetailQuery.error,
		errorUpdatedAt: accountDetailQuery.errorUpdatedAt,
		getContent: error => getAccountDetailErrorToastContent(t, error),
		isError: accountDetailQuery.isError,
	});
	useQueryErrorToast({
		error: linkedUserQuery.error,
		errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
		getContent: error => getLinkedUserErrorToastContent(t, error),
		isError: linkedUserQuery.isError,
	});

	function applySecondaryFilters() {
		setActiveFilter(draftActiveFilter);
		setAccountTypeFilter(draftAccountTypeFilter);
		setDateField(draftDateField);
		setStartDate(draftStartDate);
		setEndDate(draftEndDate);
		setFiltersOpen(false);
	}

	function clearAllFilters() {
		setQuerySearch("");
		setDraftActiveFilter("");
		setDraftAccountTypeFilter("");
		setDraftDateField("");
		setDraftStartDate("");
		setDraftEndDate("");
		setActiveFilter("");
		setAccountTypeFilter("");
		setDateField("");
		setStartDate("");
		setEndDate("");
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
					activeFilter={draftActiveFilter}
					accountTypeFilter={draftAccountTypeFilter}
					dateField={draftDateField}
					endDate={draftEndDate}
					hasActiveFilters={hasSecondaryFilters}
					onActiveFilterChange={setDraftActiveFilter}
					onAccountTypeChange={setDraftAccountTypeFilter}
					onApply={applySecondaryFilters}
					onClear={clearAllFilters}
					onDateFieldChange={setDraftDateField}
					onEndDateChange={setDraftEndDate}
					onOpenChange={setFiltersOpen}
					onStartDateChange={setDraftStartDate}
					open={filtersOpen}
					startDate={draftStartDate}
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
							onClick={() => setSelectedAccountId(row.id)}
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
				onOpenChange={open => {
					if (!open) {
						setSelectedAccountId(null);
					}
				}}
				onRefresh={() => {
					void accountDetailQuery.refetch();
				}}
				open={selectedAccountId !== null}
			/>
		</ServicePageShell>
	);
}
