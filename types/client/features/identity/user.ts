import type { UserResponse } from "@/types/api";

export type UserAuditDateField = "" | "createdAt" | "updatedAt";

export interface UserDateFilters {
	dateField: UserAuditDateField;
	startDate: string;
	endDate: string;
}

export interface UserFiltersProps {
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

export interface UserDetailDialogProps {
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
	user: UserResponse | undefined;
}

export interface UserFilterArgs {
	cpfQuery: string;
	dateField: UserAuditDateField;
	endDate: string;
	nameQuery: string;
	startDate: string;
}

export interface UserRowActionsProps {
	onView: (id: string) => void;
	user: UserResponse;
}
