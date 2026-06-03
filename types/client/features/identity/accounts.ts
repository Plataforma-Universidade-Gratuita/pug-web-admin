export interface AccountPageProps {
	accountId: string;
}

export interface AccountDetailsContentProps {
	accountId: string;
	includeLinkedUser?: boolean;
}

export interface AccountRoutePageProps {
	params: Promise<{
		accountId: string;
	}>;
}

export type AccountSearchAccountType =
	| ""
	| "ADMIN"
	| "FORMER_STUDENT"
	| "PARTNER";

export interface AccountComplexSearchFilters {
	name: string;
	cpf: string;
	email: string;
	accountTypes: AccountSearchAccountType[];
	dateFrom: string;
	dateTo: string;
	activeOnly: boolean;
}

export interface AccountsFiltersDrawerProps {
	filters: AccountComplexSearchFilters;
	hasActiveFilters: boolean;
	onApply: () => void;
	onClear: () => void;
	onFilterChange: <TKey extends keyof AccountComplexSearchFilters>(
		key: TKey,
		value: AccountComplexSearchFilters[TKey],
	) => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export interface AccountFilterArgs {
	query: string;
}

export interface AccountsRowActionsProps {
	href: string;
}
