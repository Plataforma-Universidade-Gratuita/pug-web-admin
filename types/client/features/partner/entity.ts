import type { UseFormReturn } from "react-hook-form";

import type {
	CityResponse,
	EntityCreateRequest,
	EntityResponse,
	EntityUpdateRequest,
} from "@/types/api";
import type { ComboboxOption } from "@/types/client/components/forms";

export type EntityAuditDateField = "" | "createdAt" | "updatedAt";
export type EntityEditorMode = "create" | "duplicate" | "update";

export interface EntitySecondaryFilters {
	cityIdFilter: string;
	dateField: EntityAuditDateField;
	startDate: string;
	endDate: string;
}

export interface EntityEditorFormValues {
	cnpj: string;
	name: string;
	cityId: string;
	address: string;
}

export interface EntityCreateMutationVariables {
	body: EntityCreateRequest;
}

export interface EntityUpdateMutationVariables {
	id: string;
	body: EntityUpdateRequest;
}

export interface EntityEditorDrawerProps {
	entityId: string | null;
	mode: EntityEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export interface EntityEditorFormProps {
	canRenderForm: boolean;
	citiesError: unknown;
	cityOptions: ComboboxOption[];
	entity: EntityResponse | undefined;
	entityError: unknown;
	form: UseFormReturn<EntityEditorFormValues>;
	mode: EntityEditorMode;
	onRefreshCities: () => void;
	onRefreshEntity: () => void;
}

export interface EntityFiltersDrawerProps {
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
}

export interface EntityDetailDialogProps {
	cityById: Map<string, CityResponse>;
	entity: EntityResponse | undefined;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
}

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
