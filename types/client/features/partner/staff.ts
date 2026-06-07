import type { UseFormReturn } from "react-hook-form";

import type {
	AccountResponse,
	EntityResponse,
	StaffSearchResponse,
	StaffCreateRequest,
	StaffResponse,
	StaffUpdateRequest,
	UserResponse,
} from "@/types/api";
import type { ComboboxOption } from "@/types/client/components/forms";

export type StaffEditorMode = "create" | "duplicate" | "update";

export interface StaffPageProps {
	staffId: string;
}

export interface StaffRoutePageProps {
	params: Promise<{
		staffId: string;
	}>;
}

export interface StaffComplexSearchFilters {
	name: string;
	cpf: string;
	email: string;
	dateFrom: string;
	dateTo: string;
	activeOnly: boolean;
	entityIds: string[];
}

export interface StaffEditorFormValues {
	cpf: string;
	name: string;
	email: string;
	entityId: string;
}

export type StaffCreateExistingUser = Pick<
	UserResponse,
	"id" | "cpf" | "cpfFormatted" | "name"
>;

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
	existingUsers: StaffCreateExistingUser[];
	form: UseFormReturn<StaffEditorFormValues>;
	linkedAccount: AccountResponse | undefined;
	mode: StaffEditorMode;
	onRefreshEntities: () => void;
	onRefreshStaff: () => void;
	onRefreshUser: () => void;
	staff: StaffResponse | undefined;
	staffError: unknown;
	userError: unknown;
}

export interface StaffFiltersDrawerProps {
	filters: StaffComplexSearchFilters;
	entitiesError: boolean;
	entityOptions: ComboboxOption[];
	hasActiveFilters: boolean;
	isEntitiesLoading: boolean;
	onApply: () => void;
	onClear: () => void;
	onFilterChange: <TKey extends keyof StaffComplexSearchFilters>(
		key: TKey,
		value: StaffComplexSearchFilters[TKey],
	) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshEntities: () => void;
	open: boolean;
}

export interface StaffRowActionsProps {
	href: string;
	onDelete: (staff: StaffSearchResponse) => void;
	onDuplicate: (staff: StaffSearchResponse) => void;
	onOpenEditor: (id: string, mode: StaffEditorMode) => void;
	onSetActive: (staff: StaffSearchResponse, active: boolean) => void;
	staff: StaffSearchResponse;
}

export interface StaffPageFiltersProps {
	entityOptions: ComboboxOption[];
	entitiesError: boolean;
	filters: StaffComplexSearchFilters;
	filtersOpen: boolean;
	hasActiveFilters: boolean;
	isEntitiesLoading: boolean;
	onApply: () => void;
	onClear: () => void;
	onCreate: () => void;
	onFilterChange: <TKey extends keyof StaffComplexSearchFilters>(
		key: TKey,
		value: StaffComplexSearchFilters[TKey],
	) => void;
	onOpenChange: (open: boolean) => void;
	onQuerySearchChange: (value: string) => void;
	onRefreshEntities: () => void;
	querySearch: string;
}

export interface PendingStaffStatusRecord {
	active: boolean;
	record: StaffSearchResponse;
}

export interface StaffPageDialogsProps {
	onDeleteConfirm: () => void;
	onDeleteOpenChange: (open: boolean) => void;
	onStatusConfirm: () => void;
	onStatusOpenChange: (open: boolean) => void;
	pendingDeleteRecord: StaffSearchResponse | null;
	pendingStatusRecord: PendingStaffStatusRecord | null;
}

export interface StaffFilterArgs {
	dateFrom: string;
	dateTo: string;
	entityIds: string[];
	query: string;
}

export interface StaffFilterSummaryArgs {
	entityById: Map<string, EntityResponse>;
	entityIds: string[];
	activeOnly: boolean;
	dateFrom: string;
	dateTo: string;
	query: string;
}

export interface PatchStaffCachesArgs {
	accountId: string;
	accountActive: boolean;
}

export interface PatchStaffAccountCachesArgs {
	accountId: string;
	active?: boolean;
	email?: string;
}

export interface PatchStaffUserCachesArgs {
	name?: string;
	userId: string;
}
