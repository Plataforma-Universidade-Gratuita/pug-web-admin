import type { UseFormReturn } from "react-hook-form";

import type {
	Campi,
	CourseResponse,
	FormerStudentCreateRequest,
	FormerStudentResponse,
	FormerStudentUpdateRequest,
} from "@/types";
import type { ComboboxOption } from "@/types";

export type FormerStudentAuditDateField = "" | "createdAt" | "updatedAt";
export type FormerStudentEditorMode = "create" | "duplicate" | "update";

export interface FormerStudentPageProps {
	formerStudentId: string;
}

export interface FormerStudentRoutePageProps {
	params: Promise<{
		formerStudentId: string;
	}>;
}

export interface FormerStudentSecondaryFilters {
	activeFilter: string;
	campusFilter: string;
	courseIdFilter: string;
	dateField: FormerStudentAuditDateField;
	startDate: string;
	endDate: string;
}

export interface FormerStudentEditorFormValues {
	cpf: string;
	name: string;
	email: string;
	academicRegistration: string;
	campus: Campi;
	courseId: string;
	requiredHours: string;
	startDate: string;
	dueDate: string;
}

export interface FormerStudentCreateMutationVariables {
	body: FormerStudentCreateRequest;
}

export interface FormerStudentUpdateMutationVariables {
	id: string;
	body: FormerStudentUpdateRequest;
}

export interface FormerStudentSetActiveMutationVariables {
	id: string;
	active: boolean;
}

export interface RemoveFormerStudentMutationVariables {
	accountId: string;
	userId: string;
}

export interface FormerStudentEditorDrawerProps {
	mode: FormerStudentEditorMode;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	formerStudentId: string | null;
}

export interface FormerStudentEditorFormProps {
	canRenderForm: boolean;
	courseOptions: ComboboxOption[];
	coursesError: unknown;
	form: UseFormReturn<FormerStudentEditorFormValues>;
	mode: FormerStudentEditorMode;
	onRefreshCourses: () => void;
	onRefreshFormerStudent: () => void;
	formerStudent: FormerStudentResponse | undefined;
	formerStudentError: unknown;
}

export interface FormerStudentsFiltersDrawerProps {
	activeFilter: string;
	campusFilter: string;
	courseIdFilter: string;
	dateField: FormerStudentAuditDateField;
	endDate: string;
	hasActiveFilters: boolean;
	isCoursesLoading: boolean;
	onActiveFilterChange: (value: string) => void;
	onApply: () => void;
	onCampusFilterChange: (value: string) => void;
	onClear: () => void;
	onCourseIdFilterChange: (value: string) => void;
	onDateFieldChange: (value: FormerStudentAuditDateField) => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshCourses: () => void;
	onStartDateChange: (value: string) => void;
	open: boolean;
	courseOptions: ComboboxOption[];
	coursesError: boolean;
	startDate: string;
}

export interface FormerStudentsRowActionsProps {
	href: string;
	onDelete: (formerStudent: FormerStudentResponse) => void;
	onOpenEditor: (id: string, mode: FormerStudentEditorMode) => void;
	onSetActive: (formerStudent: FormerStudentResponse, active: boolean) => void;
	formerStudent: FormerStudentResponse;
}

export interface FormerStudentFilterArgs {
	activeFilter: string;
	campusFilter: string;
	courseById: Map<string, CourseResponse>;
	courseIdFilter: string;
	dateField: FormerStudentAuditDateField;
	endDate: string;
	query: string;
	startDate: string;
}
