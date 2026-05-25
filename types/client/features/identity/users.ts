import type { UserResponse } from "@/types";

export interface UserPageProps {
	userId: string;
}

export interface UserRoutePageProps {
	params: Promise<{
		userId: string;
	}>;
}

export type UserAuditDateField = "" | "createdAt" | "updatedAt";

export interface UserDateFilters {
	dateField: UserAuditDateField;
	startDate: string;
	endDate: string;
}

export interface UsersFiltersProps {
	cpfSearch: string;
	dateField: UserAuditDateField;
	dateFiltersOpen: boolean;
	endDate: string;
	onCpfSearchChange: (value: string) => void;
	onDateFieldChange: (value: UserAuditDateField) => void;
	onDateFiltersOpenChange: (open: boolean) => void;
	onEndDateChange: (value: string) => void;
	onNameSearchChange: (value: string) => void;
	onStartDateChange: (value: string) => void;
	startDate: string;
	nameSearch: string;
}

export interface UserFilterArgs {
	cpfQuery: string;
	dateField: UserAuditDateField;
	endDate: string;
	nameQuery: string;
	startDate: string;
}

export interface UsersRowActionsProps {
	href: string;
}
