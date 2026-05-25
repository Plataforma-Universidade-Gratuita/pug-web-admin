import type { UseFormReturn } from "react-hook-form";

import type {
	Campi,
	CourseResponse,
	StudentCreateRequest,
	StudentResponse,
	StudentUpdateRequest,
} from "@/types";
import type { ComboboxOption } from "@/types";

export type StudentAuditDateField = "" | "createdAt" | "updatedAt";
export type StudentEditorMode = "create" | "duplicate" | "update";

export interface StudentSecondaryFilters {
	activeFilter: string;
	campusFilter: string;
	courseIdFilter: string;
	dateField: StudentAuditDateField;
	startDate: string;
	endDate: string;
}

export interface StudentEditorFormValues {
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

export interface StudentCreateMutationVariables {
	body: StudentCreateRequest;
}

export interface StudentUpdateMutationVariables {
	id: string;
	body: StudentUpdateRequest;
}

export interface StudentSetActiveMutationVariables {
	id: string;
	active: boolean;
}

export interface RemoveStudentMutationVariables {
	accountId: string;
	userId: string;
}

export interface StudentEditorDrawerProps {
	mode: StudentEditorMode;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	studentId: string | null;
}

export interface StudentEditorFormProps {
	canRenderForm: boolean;
	courseOptions: ComboboxOption[];
	coursesError: unknown;
	form: UseFormReturn<StudentEditorFormValues>;
	mode: StudentEditorMode;
	onRefreshCourses: () => void;
	onRefreshStudent: () => void;
	student: StudentResponse | undefined;
	studentError: unknown;
}

export interface StudentFiltersDrawerProps {
	activeFilter: string;
	campusFilter: string;
	courseIdFilter: string;
	dateField: StudentAuditDateField;
	endDate: string;
	hasActiveFilters: boolean;
	isCoursesLoading: boolean;
	onActiveFilterChange: (value: string) => void;
	onApply: () => void;
	onCampusFilterChange: (value: string) => void;
	onClear: () => void;
	onCourseIdFilterChange: (value: string) => void;
	onDateFieldChange: (value: StudentAuditDateField) => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshCourses: () => void;
	onStartDateChange: (value: string) => void;
	open: boolean;
	courseOptions: ComboboxOption[];
	coursesError: boolean;
	startDate: string;
}

export interface StudentDetailDialogProps {
	courseName: string;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
	student: StudentResponse | undefined;
}

export interface StudentRowActionsProps {
	onDelete: (student: StudentResponse) => void;
	onOpenEditor: (id: string, mode: StudentEditorMode) => void;
	onSetActive: (student: StudentResponse, active: boolean) => void;
	onView: (id: string) => void;
	student: StudentResponse;
}

export interface StudentFilterArgs {
	activeFilter: string;
	campusFilter: string;
	courseById: Map<string, CourseResponse>;
	courseIdFilter: string;
	dateField: StudentAuditDateField;
	endDate: string;
	query: string;
	startDate: string;
}
