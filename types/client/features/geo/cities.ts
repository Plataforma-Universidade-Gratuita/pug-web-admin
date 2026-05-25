export interface CityPageProps {
	cityId: string;
}

export interface CityRoutePageProps {
	params: Promise<{
		cityId: string;
	}>;
}

export interface CitiesFiltersProps {
	onSearchChange: (value: string) => void;
	search: string;
}

export interface CitiesRowActionsProps {
	href: string;
}
