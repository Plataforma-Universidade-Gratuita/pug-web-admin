import type { UseFormReturn } from "react-hook-form";

import type {
	AccountResponse,
	CityResponse,
	EntityResponse,
	StaffCreateRequest,
	StaffResponse,
	StaffUpdateRequest,
	UserResponse,
} from "@/types";
import type { ComboboxOption } from "@/types";

export type StaffActiveFilter = "" | "true" | "false";
export type StaffEditorMode = "create" | "duplicate" | "update";

export interface StaffSecondaryFilters {
	entityIdFilter: string;
	cityIdFilter: string;
	activeFilter: StaffActiveFilter;
}

export interface StaffEditorFormValues {
	cpf: string;
	name: string;
	email: string;
	entityId: string;
}

export interface StaffCreateMutationVariables {
	body: StaffCreateRequest;
}

export interface StaffUpdateMutationVariables {
	id: string;
	body: StaffUpdateRequest;
}

export interface StaffSetActiveMutationVariables {
	id: string;
	active: boolean;
}

export interface StaffRemoveMutationVariables {
	accountId: string;
	userId: string;
}

export interface StaffEditorDrawerProps {
	staffId: string | null;
	mode: StaffEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export interface StaffEditorFormProps {
	canRenderForm: boolean;
	entityById: Map<string, EntityResponse>;
	entityOptions: ComboboxOption[];
	entitiesError: unknown;
	form: UseFormReturn<StaffEditorFormValues>;
	mode: StaffEditorMode;
	onRefreshEntities: () => void;
	onRefreshStaff: () => void;
	staff: StaffResponse | undefined;
	staffError: unknown;
}

export interface StaffFiltersDrawerProps {
	activeFilter: StaffActiveFilter;
	citiesError: boolean;
	cityIdFilter: string;
	cityOptions: ComboboxOption[];
	entitiesError: boolean;
	entityIdFilter: string;
	entityOptions: ComboboxOption[];
	hasActiveFilters: boolean;
	isCitiesLoading: boolean;
	isEntitiesLoading: boolean;
	onActiveFilterChange: (value: StaffActiveFilter) => void;
	onApply: () => void;
	onCityIdChange: (value: string) => void;
	onClear: () => void;
	onEntityIdChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshCities: () => void;
	onRefreshEntities: () => void;
	open: boolean;
}

export interface StaffDetailDialogProps {
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
	staff: StaffResponse | undefined;
}

export interface StaffActionDialogsProps {
	onConfirmDelete: () => void;
	onConfirmStatusChange: () => void;
	onDeleteOpenChange: (open: boolean) => void;
	onStatusOpenChange: (open: boolean) => void;
	pendingDeleteStaff: StaffResponse | null;
	pendingStatusStaff: {
		active: boolean;
		staff: StaffResponse;
	} | null;
}

export interface StaffRowActionsProps {
	onDelete: (staff: StaffResponse) => void;
	onOpenEditor: (id: string, mode: StaffEditorMode) => void;
	onSetActive: (staff: StaffResponse, active: boolean) => void;
	onView: (id: string) => void;
	staff: StaffResponse;
}

export interface StaffFilterArgs {
	activeFilter: StaffActiveFilter;
	cityIdFilter: string;
	entityIdFilter: string;
	query: string;
}

export interface StaffFilterSummaryArgs {
	activeFilter: StaffActiveFilter;
	cityById: Map<string, CityResponse>;
	cityIdFilter: string;
	entityById: Map<string, EntityResponse>;
	entityIdFilter: string;
	query: string;
}

export interface UseStaffPageActionsProps {
	currentEditorId: string | null;
	currentSelectedId: string | null;
	onClearEditor: () => void;
	onClearSelection: () => void;
}

export interface PatchStaffCachesArgs {
	accountId: string;
	accountActive: boolean;
}

export interface PatchStaffAccountCachesArgs {
	accountId: string;
	active?: boolean;
	email?: string;
	userName?: string;
}

export interface PatchStaffUserCachesArgs {
	name?: string;
	userId: string;
}
