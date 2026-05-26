export interface UserPageProps {
	userId: string;
}

export interface UserDetailsContentProps {
	userId: string;
}

export interface UserRoutePageProps {
	params: Promise<{
		userId: string;
	}>;
}

export interface UserComplexSearchFilters {
	name: string;
	cpf: string;
	dateFrom: string;
	dateTo: string;
}

export interface UsersFiltersProps {
	backendFilters: UserComplexSearchFilters;
	backendFiltersOpen: boolean;
	frontendCpfSearch: string;
	frontendNameSearch: string;
	hasBackendFilters: boolean;
	onApplyBackendFilters: () => void;
	onBackendFilterChange: <TKey extends keyof UserComplexSearchFilters>(
		key: TKey,
		value: UserComplexSearchFilters[TKey],
	) => void;
	onBackendFiltersOpenChange: (open: boolean) => void;
	onClearBackendFilters: () => void;
	onFrontendCpfSearchChange: (value: string) => void;
	onFrontendNameSearchChange: (value: string) => void;
}

export interface UsersFiltersDrawerProps {
	filters: UserComplexSearchFilters;
	hasActiveFilters: boolean;
	onApply: () => void;
	onFilterChange: <TKey extends keyof UserComplexSearchFilters>(
		key: TKey,
		value: UserComplexSearchFilters[TKey],
	) => void;
	onClear: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export interface UserFrontendFilterArgs {
	cpfQuery: string;
	nameQuery: string;
}

export interface UsersRowActionsProps {
	href: string;
}
