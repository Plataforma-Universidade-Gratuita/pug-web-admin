import type { UseFormReturn } from "react-hook-form";

import type {
	SchoolCreateRequest,
	SchoolResponse,
	SchoolUpdateRequest,
} from "@/types";

export type SchoolAuditDateField = "" | "createdAt" | "updatedAt";
export type SchoolEditorMode = "create" | "duplicate" | "update";

export interface SchoolPageProps {
	schoolId: string;
}

export interface SchoolRoutePageProps {
	params: Promise<{
		schoolId: string;
	}>;
}

export interface SchoolSecondaryFilters {
	dateField: SchoolAuditDateField;
	startDate: string;
	endDate: string;
}

export interface SchoolEditorFormValues {
	name: string;
}

export interface SchoolCreateMutationVariables {
	body: SchoolCreateRequest;
}

export interface SchoolUpdateMutationVariables {
	id: string;
	body: SchoolUpdateRequest;
}

export interface RemoveSchoolMutationVariables {
	id: string;
}

export interface SchoolEditorDrawerProps {
	schoolId: string | null;
	mode: SchoolEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export interface SchoolEditorFormProps {
	canRenderForm: boolean;
	form: UseFormReturn<SchoolEditorFormValues>;
	mode: SchoolEditorMode;
	onRefreshSchool: () => void;
	school: SchoolResponse | undefined;
	schoolError: unknown;
}

export interface SchoolsFiltersDrawerProps {
	dateField: SchoolAuditDateField;
	endDate: string;
	hasActiveFilters: boolean;
	onApply: () => void;
	onClear: () => void;
	onDateFieldChange: (value: SchoolAuditDateField) => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onStartDateChange: (value: string) => void;
	open: boolean;
	startDate: string;
}

export interface SchoolsRowActionsProps {
	href: string;
	onDelete: (school: SchoolResponse) => void;
	onOpenEditor: (id: string, mode: SchoolEditorMode) => void;
	school: SchoolResponse;
}

export interface SchoolFilterArgs {
	dateField: SchoolAuditDateField;
	endDate: string;
	query: string;
	startDate: string;
}
