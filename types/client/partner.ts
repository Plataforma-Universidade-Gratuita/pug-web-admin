import type {
	AccountResponse,
	CityResponse,
	EntityResponse,
	StaffResponse,
	UserResponse,
} from "@/types/api";
import type { ComboboxOption } from "@/types/client/components/forms";

export type EntityAuditDateField = "" | "createdAt" | "updatedAt";
export type EntityEditorMode = "create" | "duplicate" | "update";
export type EntitySecondaryFilters = {
	cityIdFilter: string;
	dateField: EntityAuditDateField;
	startDate: string;
	endDate: string;
};

export type EntityEditorFormValues = {
	cnpj: string;
	name: string;
	cityId: string;
	address: string;
};

export type EntityCreateMutationVariables = {
	body: import("@/types/api").EntityCreateRequest;
};

export type EntityUpdateMutationVariables = {
	id: string;
	body: import("@/types/api").EntityUpdateRequest;
};

export type EntityEditorDrawerProps = {
	entityId: string | null;
	mode: EntityEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export interface EntityEditorFormProps {
	canRenderForm: boolean;
	citiesError: unknown;
	cityOptions: ComboboxOption[];
	entity: EntityResponse | undefined;
	entityError: unknown;
	form: import("react-hook-form").UseFormReturn<EntityEditorFormValues>;
	mode: EntityEditorMode;
	onRefreshCities: () => void;
	onRefreshEntity: () => void;
}

export type EntityFiltersDrawerProps = {
	citiesError: boolean;
	cityIdFilter: string;
	cityOptions: ComboboxOption[];
	dateField: EntityAuditDateField;
	endDate: string;
	hasActiveFilters: boolean;
	isCitiesLoading: boolean;
	onApply: () => void;
	onCityIdChange: (value: string) => void;
	onClear: () => void;
	onDateFieldChange: (value: EntityAuditDateField) => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshCities: () => void;
	onStartDateChange: (value: string) => void;
	open: boolean;
	startDate: string;
};

export type EntityDetailDialogProps = {
	cityById: Map<string, CityResponse>;
	entity: EntityResponse | undefined;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
};

export interface EntityRowActionsProps {
	entity: EntityResponse;
	onDelete: (entity: EntityResponse) => void;
	onOpenEditor: (id: string, mode: EntityEditorMode) => void;
	onView: (id: string) => void;
}

export interface EntityFilterArgs {
	query: string;
	cityIdFilter: string;
	dateField: EntityAuditDateField;
	startDate: string;
	endDate: string;
	cityById: Map<string, CityResponse>;
}

export interface RemoveEntityMutationVariables {
	id: string;
}

export type StaffActiveFilter = "" | "true" | "false";
export type StaffEditorMode = "create" | "duplicate" | "update";
export type StaffSecondaryFilters = {
	entityIdFilter: string;
	cityIdFilter: string;
	activeFilter: StaffActiveFilter;
};

export type StaffEditorFormValues = {
	cpf: string;
	name: string;
	email: string;
	password: string;
	entityId: string;
};

export type StaffCreateMutationVariables = {
	body: import("@/types/api").StaffCreateRequest;
};

export type StaffUpdateMutationVariables = {
	id: string;
	body: import("@/types/api").StaffUpdateRequest;
};

export type StaffSetActiveMutationVariables = {
	id: string;
	active: boolean;
};

export type StaffRemoveMutationVariables = {
	accountId: string;
	userId: string;
};

export type StaffEditorDrawerProps = {
	staffId: string | null;
	mode: StaffEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export interface StaffEditorFormProps {
	canRenderForm: boolean;
	entityById: Map<string, EntityResponse>;
	entityOptions: ComboboxOption[];
	entitiesError: unknown;
	form: import("react-hook-form").UseFormReturn<StaffEditorFormValues>;
	mode: StaffEditorMode;
	onRefreshEntities: () => void;
	onRefreshStaff: () => void;
	staff: StaffResponse | undefined;
	staffError: unknown;
}

export type StaffFiltersDrawerProps = {
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
};

export type StaffDetailDialogProps = {
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
};

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
