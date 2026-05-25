import type { UseFormReturn } from "react-hook-form";

import type {
	AccountResponse,
	AdminCreateRequest,
	AdminResponse,
	AdminUpdateRequest,
	Campi,
	UserResponse,
} from "@/types/api";

export type AdminCampusFilter = "" | Campi;
export type AdminEditorMode = "create" | "duplicate" | "update";

export interface AdminEditorFormValues {
	cpf: string;
	name: string;
	email: string;
	campus: Campi;
}

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

export interface AdminUpdateDrawerProps {
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

export interface AdminFiltersProps {
	campusFilter: AdminCampusFilter;
	onCampusFilterChange: (value: AdminCampusFilter) => void;
	onSearchChange: (value: string) => void;
	querySearch: string;
}

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

export interface AdminDetailDialogProps {
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
}

export interface AdminRowActionsProps {
	admin: AdminResponse;
	canDeactivate: boolean;
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
