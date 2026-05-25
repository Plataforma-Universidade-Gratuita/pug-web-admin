import type { UseFormReturn } from "react-hook-form";

import type {
	CourseCreateRequest,
	CourseResponse,
	CourseUpdateRequest,
} from "@/types";
import type { ComboboxOption } from "@/types";

export type CourseAuditDateField = "" | "createdAt" | "updatedAt";
export type CourseEditorMode = "create" | "duplicate" | "update";

export interface CourseSecondaryFilters {
	schoolIdFilter: string;
	dateField: CourseAuditDateField;
	startDate: string;
	endDate: string;
}

export interface CourseEditorFormValues {
	name: string;
	schoolId: string;
}

export interface CourseCreateMutationVariables {
	body: CourseCreateRequest;
}

export interface CourseUpdateMutationVariables {
	id: string;
	body: CourseUpdateRequest;
}

export interface RemoveCourseMutationVariables {
	id: string;
}

export interface CourseEditorDrawerProps {
	courseId: string | null;
	mode: CourseEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export interface CourseEditorFormProps {
	canRenderForm: boolean;
	course: CourseResponse | undefined;
	courseError: unknown;
	form: UseFormReturn<CourseEditorFormValues>;
	mode: CourseEditorMode;
	onRefreshCourse: () => void;
	onRefreshSchools: () => void;
	schoolOptions: ComboboxOption[];
	schoolsError: unknown;
}

export interface CourseFiltersDrawerProps {
	dateField: CourseAuditDateField;
	endDate: string;
	hasActiveFilters: boolean;
	isSchoolsLoading: boolean;
	onApply: () => void;
	onClear: () => void;
	onDateFieldChange: (value: CourseAuditDateField) => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshSchools: () => void;
	onSchoolIdChange: (value: string) => void;
	onStartDateChange: (value: string) => void;
	open: boolean;
	schoolIdFilter: string;
	schoolOptions: ComboboxOption[];
	schoolsError: boolean;
	startDate: string;
}

export interface CourseDetailDialogProps {
	course: CourseResponse | undefined;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
}

export interface CourseRowActionsProps {
	course: CourseResponse;
	onDelete: (course: CourseResponse) => void;
	onOpenEditor: (id: string, mode: CourseEditorMode) => void;
	onView: (id: string) => void;
}

export interface CourseFilterArgs {
	dateField: CourseAuditDateField;
	endDate: string;
	query: string;
	schoolIdFilter: string;
	startDate: string;
}
