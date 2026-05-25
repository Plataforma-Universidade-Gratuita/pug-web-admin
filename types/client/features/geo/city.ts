import type { CityResponse } from "@/types";

export interface CityFiltersProps {
	onSearchChange: (value: string) => void;
	search: string;
}

export interface CityDetailDialogProps {
	city: CityResponse | undefined;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
}

export interface CityRowActionsProps {
	city: CityResponse;
	onView: (id: string) => void;
}
