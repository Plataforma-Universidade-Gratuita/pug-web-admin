import type { UseFormReturn } from "react-hook-form";

import type {
	AccountResponse,
	AccountSearchResponse,
	AdminCreateRequest,
	AdminResponse,
	AdminSearchResponse,
	AdminUpdateRequest,
	Campi,
	UserResponse,
} from "@/types";

export type AdminEditorMode = "create" | "update";

export interface AdminPageProps {
	adminId: string;
}

export interface AdminRoutePageProps {
	params: Promise<{
		adminId: string;
	}>;
}

export interface AdminComplexSearchFilters {
	name: string;
	cpf: string;
	email: string;
	accountType: "" | AccountSearchResponse["accountType"];
	dateFrom: string;
	dateTo: string;
	activeOnly: boolean;
	campuses: Campi[];
}

export interface AdminFrontendFilterArgs {
	campusFilters: Campi[];
	query: string;
}

export interface AdminEditorFormValues {
	cpf: string;
	name: string;
	email: string;
	password: string;
	campus: Campi;
	active: boolean;
}

export type AdminCreateExistingUser = Pick<
	UserResponse,
	"id" | "cpf" | "cpfFormatted" | "name"
>;

export interface AdminCreateMutationVariables {
	body: AdminCreateRequest;
}

export interface AdminUpdateMutationVariables {
	body: AdminUpdateRequest;
	id: string;
}

export interface AdminSetActiveMutationVariables {
	active: boolean;
	id: string;
}

export interface AdminsUpdateDrawerProps {
	adminId: string | null;
	mode: AdminEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export type AdminLinkedUser = Pick<UserResponse, "cpfFormatted" | "name">;

export interface AdminEditorContentProps {
	admin: AdminResponse | undefined;
	adminError: unknown;
	canRenderForm: boolean;
	campusOptions: {
		label: string;
		value: Campi;
	}[];
	existingUsers: AdminCreateExistingUser[];
	form: UseFormReturn<AdminEditorFormValues>;
	linkedAccount: AccountResponse | undefined;
	linkedAccountError: unknown;
	linkedUser: AdminLinkedUser | undefined;
	linkedUserError: unknown;
	mode: AdminEditorMode;
	onRefreshAccount: () => void;
	onRefreshAdmin: () => void;
	onRefreshUser: () => void;
}

export interface AdminUserTabProps {
	admin: AdminResponse;
	linkedUser: AdminLinkedUser | undefined;
	linkedUserError: unknown;
	onRefreshUser: () => void;
}

export interface AdminsFiltersProps {
	backendFilters: AdminComplexSearchFilters;
	backendFiltersOpen: boolean;
	frontendCampusFilters: Campi[];
	frontendQuerySearch: string;
	hasBackendFilters: boolean;
	onApplyBackendFilters: () => void;
	onBackendFilterChange: <TKey extends keyof AdminComplexSearchFilters>(
		key: TKey,
		value: AdminComplexSearchFilters[TKey],
	) => void;
	onBackendFiltersOpenChange: (open: boolean) => void;
	onClearBackendFilters: () => void;
	onFrontendCampusFiltersChange: (value: Campi[]) => void;
	onFrontendQuerySearchChange: (value: string) => void;
}

export interface AdminsFiltersDrawerProps {
	filters: AdminComplexSearchFilters;
	hasActiveFilters: boolean;
	onApply: () => void;
	onClear: () => void;
	onFilterChange: <TKey extends keyof AdminComplexSearchFilters>(
		key: TKey,
		value: AdminComplexSearchFilters[TKey],
	) => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export interface AdminsActionDialogsProps {
	onConfirmDelete: () => void;
	onConfirmStatusChange: () => void;
	onDeleteOpenChange: (open: boolean) => void;
	onStatusOpenChange: (open: boolean) => void;
	pendingDeleteAdmin: AdminSearchResponse | null;
	pendingStatusAdmin: {
		active: boolean;
		admin: AdminSearchResponse;
	} | null;
}

export interface AdminsRowActionsProps {
	admin: AdminSearchResponse;
	canDeactivate: boolean;
	href: string;
	onDelete: (admin: AdminSearchResponse) => void;
	onDuplicate: (admin: AdminSearchResponse) => void;
	onSetActive: (admin: AdminSearchResponse, active: boolean) => void;
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
