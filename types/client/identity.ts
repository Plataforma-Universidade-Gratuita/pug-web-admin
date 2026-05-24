import type {
	AccountResponse,
	AdminResponse,
	Campi,
	UserResponse,
} from "@/types/api";

export type AccountAuditDateField = "" | "createdAt" | "updatedAt";
export type AccountActiveFilter = "" | "true" | "false";
export type AccountTypeFilter = "" | "ADMIN" | "PARTNER" | "STUDENT";

export type AccountFiltersDrawerProps = {
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
};

export interface AccountFilterArgs {
	activeFilter: AccountActiveFilter;
	accountTypeFilter: AccountTypeFilter;
	dateField: AccountAuditDateField;
	query: string;
	endDate: string;
	startDate: string;
}

export type AccountDetailDialogProps = {
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
};

export type AdminCampusFilter = "" | Campi;
export type AdminEditorMode = "create" | "duplicate" | "update";
export type AdminEditorFormValues = {
	cpf: string;
	name: string;
	email: string;
	password: string;
	campus: Campi;
	active: boolean;
};

export type AdminCreateMutationVariables = {
	active: boolean;
	body: import("@/types/api").AdminCreateRequest;
};

export type AdminUpdateMutationVariables = {
	body: import("@/types/api").AdminUpdateRequest;
	id: string;
};

export type AdminSetActiveMutationVariables = {
	active: boolean;
	id: string;
};

export type AdminUpdateDrawerProps = {
	adminId: string | null;
	mode: AdminEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export type AdminLinkedUser = Pick<UserResponse, "cpfFormatted" | "name">;

export type AdminEditorContentProps = {
	admin: AdminResponse | undefined;
	adminError: unknown;
	canRenderForm: boolean;
	campusOptions: {
		label: string;
		value: Campi;
	}[];
	form: import("react-hook-form").UseFormReturn<AdminEditorFormValues>;
	linkedAccount: AccountResponse | undefined;
	linkedAccountError: unknown;
	linkedUser: AdminLinkedUser | undefined;
	linkedUserError: unknown;
	mode: AdminEditorMode;
	onRefreshAccount: () => void;
	onRefreshAdmin: () => void;
	onRefreshUser: () => void;
};

export type AdminUserTabProps = {
	admin: AdminResponse;
	linkedUser: AdminLinkedUser | undefined;
	linkedUserError: unknown;
	onRefreshUser: () => void;
};

export type AdminFiltersProps = {
	campusFilter: AdminCampusFilter;
	onCampusFilterChange: (value: AdminCampusFilter) => void;
	onSearchChange: (value: string) => void;
	querySearch: string;
};

export interface AdminFilterArgs {
	campusFilter: AdminCampusFilter;
	query: string;
}

export interface AdminActionDialogsProps {
	onConfirmDelete: () => void;
	onConfirmStatusChange: () => void;
	onDeleteOpenChange: (open: boolean) => void;
	onStatusOpenChange: (open: boolean) => void;
	pendingDeleteAdmin: AdminResponse | null;
	pendingStatusAdmin: {
		active: boolean;
		admin: AdminResponse;
	} | null;
}

export type AdminDetailDialogProps = {
	admin: AdminResponse | undefined;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	linkedAccount: AccountResponse | undefined;
	linkedAccountError: unknown;
	linkedAccountIsError: boolean;
	linkedAccountIsLoading: boolean;
	linkedUser: Pick<UserResponse, "cpfFormatted" | "id" | "name"> | undefined;
	linkedUserError: unknown;
	linkedUserIsError: boolean;
	linkedUserIsLoading: boolean;
	onLinkedAccountRefresh: () => void;
	onLinkedUserRefresh: () => void;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
};

export interface AdminRowActionsProps {
	admin: AdminResponse;
	onDelete: (admin: AdminResponse) => void;
	onSetActive: (admin: AdminResponse, active: boolean) => void;
	onView: (id: string) => void;
	onOpenEditor: (id: string, mode: AdminEditorMode) => void;
}

export interface PatchAdminCachesArgs {
	accountId: string;
	accountActive: boolean;
}

export interface RemoveAdminMutationVariables {
	accountId: string;
	userId: string;
}

export type UserAuditDateField = "" | "createdAt" | "updatedAt";

export type UserFiltersProps = {
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
};

export type UserDetailDialogProps = {
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
	user: UserResponse | undefined;
};

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
