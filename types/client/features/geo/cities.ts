export interface CityPageProps {
	cityId: string;
}

export interface CityRoutePageProps {
	params: Promise<{
		cityId: string;
	}>;
}

export interface CitiesFiltersProps {
	backendNameFilter: string;
	backendFiltersOpen: boolean;
	hasBackendFilters: boolean;
	onApplyBackendFilters: () => void;
	onBackendFiltersOpenChange: (open: boolean) => void;
	onBackendNameFilterChange: (value: string) => void;
	onClearBackendFilters: () => void;
	onFrontendSearchChange: (value: string) => void;
	frontendSearch: string;
}

export interface CitiesFiltersDrawerProps {
	nameFilter: string;
	hasActiveFilters: boolean;
	onApply: () => void;
	onClear: () => void;
	onNameFilterChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export interface CitiesRowActionsProps {
	href: string;
}
