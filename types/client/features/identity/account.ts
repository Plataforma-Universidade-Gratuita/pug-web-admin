import type { AccountResponse, UserResponse } from "@/types/api";

export type AccountAuditDateField = "" | "createdAt" | "updatedAt";
export type AccountActiveFilter = "" | "true" | "false";
export type AccountTypeFilter = "" | "ADMIN" | "PARTNER" | "STUDENT";

export interface AccountSecondaryFilters {
	activeFilter: AccountActiveFilter;
	accountTypeFilter: AccountTypeFilter;
	dateField: AccountAuditDateField;
	startDate: string;
	endDate: string;
}

export interface AccountFiltersDrawerProps {
	activeFilter: AccountActiveFilter;
	accountTypeFilter: AccountTypeFilter;
	dateField: AccountAuditDateField;
	endDate: string;
	hasActiveFilters: boolean;
	onActiveFilterChange: (value: AccountActiveFilter) => void;
	onAccountTypeChange: (value: AccountTypeFilter) => void;
	onApply: () => void;
	onClear: () => void;
	onDateFieldChange: (value: AccountAuditDateField) => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onStartDateChange: (value: string) => void;
	open: boolean;
	startDate: string;
}

export interface AccountFilterArgs {
	activeFilter: AccountActiveFilter;
	accountTypeFilter: AccountTypeFilter;
	dateField: AccountAuditDateField;
	query: string;
	endDate: string;
	startDate: string;
}

export interface AccountDetailDialogProps {
	account: AccountResponse | undefined;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	linkedUser: Pick<UserResponse, "cpfFormatted" | "id" | "name"> | undefined;
	linkedUserError: unknown;
	linkedUserIsError: boolean;
	linkedUserIsLoading: boolean;
	onLinkedUserRefresh: () => void;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
}
