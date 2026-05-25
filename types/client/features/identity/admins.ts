import type { UseFormReturn } from "react-hook-form";

import type {
	AdminCreateRequest,
	AdminResponse,
	AdminUpdateRequest,
	Campi,
} from "@/types";

export type AdminCampusFilter = "" | Campi;
export type AdminEditorMode = "create" | "duplicate" | "update";

export interface AdminPageProps {
	adminId: string;
}

export interface AdminRoutePageProps {
	params: Promise<{
		adminId: string;
	}>;
}

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
	campusFilter: AdminCampusFilter;
	onCampusFilterChange: (value: AdminCampusFilter) => void;
	onSearchChange: (value: string) => void;
	querySearch: string;
}

export interface AdminFilterArgs {
	campusFilter: AdminCampusFilter;
	query: string;
}

export interface AdminsActionDialogsProps {
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

export interface AdminsRowActionsProps {
	admin: AdminResponse;
	canDeactivate: boolean;
	href: string;
	onDelete: (admin: AdminResponse) => void;
	onSetActive: (admin: AdminResponse, active: boolean) => void;
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
