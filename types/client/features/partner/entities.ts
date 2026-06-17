import type { UseFormReturn } from "react-hook-form";

import type {
	EntityCreateRequest,
	EntityResponse,
	EntityUpdateRequest,
} from "@/types/api";
import type { ComboboxOption } from "@/types/client/components/primitives/forms/combobox";

export type EntityEditorMode = "create" | "duplicate" | "update";

export interface EntityPageProps {
	entityId: string;
}

export interface EntityRoutePageProps {
	params: Promise<{
		entityId: string;
	}>;
}

export interface EntitySecondaryFilters {
	cityIdsFilter: string[];
	dateFrom: string;
	dateTo: string;
}

export interface EntityComplexSearchFilters {
	cityIdsFilter: string[];
	dateFrom: string;
	dateTo: string;
}

export interface EntityTableRow {
	id: string;
	cnpj: string;
	cnpjFormatted: string;
	name: string;
	address: string;
	cityId: string;
	cityLabel: string;
	auditInfo: EntityResponse["auditInfo"];
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

export interface EntityDetailsContentProps {
	entityId: string;
	columns?: 2 | 3;
}

export interface EntitiesFiltersDrawerProps {
	citiesError: boolean;
	cityIdsFilter: string[];
	cityOptions: ComboboxOption[];
	endDate: string;
	hasActiveFilters: boolean;
	isCitiesLoading: boolean;
	onApply: () => void;
	onCityIdsChange: (value: string[]) => void;
	onClear: () => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshCities: () => void;
	onStartDateChange: (value: string) => void;
	open: boolean;
	startDate: string;
}

export interface EntitiesRowActionsProps {
	entity: Pick<EntityTableRow, "id" | "name">;
	href: string;
	onDelete: (entity: Pick<EntityTableRow, "id" | "name">) => void;
	onOpenEditor: (id: string, mode: EntityEditorMode) => void;
}

export interface EntityFilterArgs {
	cnpjQuery: string;
	query: string;
	dateFrom: string;
	dateTo: string;
}

export interface RemoveEntityMutationVariables {
	id: string;
}

export interface UseEntitiesSearchQueryFilters {
	cityIdsFilter: string[];
	dateFrom: string;
	dateTo: string;
}

export interface EntitySearchQueryArgs {
	page: number;
	size: number;
	filters: UseEntitiesSearchQueryFilters;
	enabled?: boolean;
}
