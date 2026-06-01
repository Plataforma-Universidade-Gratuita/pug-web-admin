import type { UseFormReturn } from "react-hook-form";

import type {
	AreaOfExpertiseCreateRequest,
	AreaOfExpertiseResponse,
	AreaOfExpertiseUpdateRequest,
} from "@/types";

export type AreaOfExpertiseEditorMode = "create" | "duplicate" | "update";

export interface AreaOfExpertisePageProps {
	areaOfExpertiseId: string;
}

export interface AreaOfExpertiseRoutePageProps {
	params: Promise<{
		areaOfExpertiseId: string;
	}>;
}

export interface AreaOfExpertiseSecondaryFilters {
	startDate: string;
	endDate: string;
}

export interface AreaOfExpertiseEditorFormValues {
	name: string;
}

export interface AreaOfExpertiseCreateMutationVariables {
	body: AreaOfExpertiseCreateRequest;
}

export interface AreaOfExpertiseUpdateMutationVariables {
	id: string;
	body: AreaOfExpertiseUpdateRequest;
}

export interface RemoveAreaOfExpertiseMutationVariables {
	id: string;
}

export interface AreaOfExpertiseEditorDrawerProps {
	areaOfExpertiseId: string | null;
	mode: AreaOfExpertiseEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export interface AreaOfExpertiseEditorFormProps {
	canRenderForm: boolean;
	form: UseFormReturn<AreaOfExpertiseEditorFormValues>;
	mode: AreaOfExpertiseEditorMode;
	onRefreshAreaOfExpertise: () => void;
	areaOfExpertise: AreaOfExpertiseResponse | undefined;
	areaOfExpertiseError: unknown;
}

export interface AreasOfExpertiseFiltersDrawerProps {
	endDate: string;
	hasActiveFilters: boolean;
	onApply: () => void;
	onClear: () => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onStartDateChange: (value: string) => void;
	open: boolean;
	startDate: string;
}

export interface AreasOfExpertiseRowActionsProps {
	href: string;
	onDelete: (areaOfExpertise: AreaOfExpertiseResponse) => void;
	onDuplicate: (areaOfExpertise: AreaOfExpertiseResponse) => void;
	onOpenEditor: (id: string, mode: AreaOfExpertiseEditorMode) => void;
	areaOfExpertise: AreaOfExpertiseResponse;
}

export interface AreaOfExpertiseFilterArgs {
	endDate: string;
	query: string;
	startDate: string;
}
