import type { SchoolResponse } from "@/types/api";

export type SchoolAuditDateField = "" | "createdAt" | "updatedAt";
export type SchoolEditorMode = "create" | "duplicate" | "update";

export type SchoolSecondaryFilters = {
	dateField: SchoolAuditDateField;
	startDate: string;
	endDate: string;
};

export type SchoolEditorFormValues = {
	name: string;
};

export type SchoolCreateMutationVariables = {
	body: import("@/types/api").SchoolCreateRequest;
};

export type SchoolUpdateMutationVariables = {
	id: string;
	body: import("@/types/api").SchoolUpdateRequest;
};

export type RemoveSchoolMutationVariables = {
	id: string;
};

export type SchoolEditorDrawerProps = {
	schoolId: string | null;
	mode: SchoolEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export interface SchoolEditorFormProps {
	canRenderForm: boolean;
	form: import("react-hook-form").UseFormReturn<SchoolEditorFormValues>;
	mode: SchoolEditorMode;
	onRefreshSchool: () => void;
	school: SchoolResponse | undefined;
	schoolError: unknown;
}

export type SchoolFiltersDrawerProps = {
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
};

export type SchoolDetailDialogProps = {
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
	school: SchoolResponse | undefined;
};

export interface SchoolRowActionsProps {
	onDelete: (school: SchoolResponse) => void;
	onOpenEditor: (id: string, mode: SchoolEditorMode) => void;
	onView: (id: string) => void;
	school: SchoolResponse;
}

export interface SchoolFilterArgs {
	dateField: SchoolAuditDateField;
	endDate: string;
	query: string;
	startDate: string;
}

export type CourseAuditDateField = "" | "createdAt" | "updatedAt";
export type CourseEditorMode = "create" | "duplicate" | "update";

export type CourseSecondaryFilters = {
	schoolIdFilter: string;
	dateField: CourseAuditDateField;
	startDate: string;
	endDate: string;
};

export type CourseEditorFormValues = {
	name: string;
	schoolId: string;
};

export type CourseCreateMutationVariables = {
	body: import("@/types/api").CourseCreateRequest;
};

export type CourseUpdateMutationVariables = {
	id: string;
	body: import("@/types/api").CourseUpdateRequest;
};

export type RemoveCourseMutationVariables = {
	id: string;
};

export type CourseEditorDrawerProps = {
	courseId: string | null;
	mode: CourseEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export interface CourseEditorFormProps {
	canRenderForm: boolean;
	course: import("@/types/api").CourseResponse | undefined;
	courseError: unknown;
	form: import("react-hook-form").UseFormReturn<CourseEditorFormValues>;
	mode: CourseEditorMode;
	onRefreshCourse: () => void;
	onRefreshSchools: () => void;
	schoolOptions: import("@/types/client").ComboboxOption[];
	schoolsError: unknown;
}

export type CourseFiltersDrawerProps = {
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
	schoolOptions: import("@/types/client").ComboboxOption[];
	schoolsError: boolean;
	startDate: string;
};

export type CourseDetailDialogProps = {
	course: import("@/types/api").CourseResponse | undefined;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
};

export interface CourseRowActionsProps {
	course: import("@/types/api").CourseResponse;
	onDelete: (course: import("@/types/api").CourseResponse) => void;
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

export type StudentAuditDateField = "" | "createdAt" | "updatedAt";
export type StudentEditorMode = "create" | "duplicate" | "update";

export type StudentSecondaryFilters = {
	activeFilter: string;
	campusFilter: string;
	courseIdFilter: string;
	dateField: StudentAuditDateField;
	startDate: string;
	endDate: string;
};

export type StudentEditorFormValues = {
	cpf: string;
	name: string;
	email: string;
	password: string;
	academicRegistration: string;
	campus: import("@/types/api").Campi;
	courseId: string;
	requiredHours: string;
	startDate: string;
	dueDate: string;
};

export type StudentCreateMutationVariables = {
	body: import("@/types/api").StudentCreateRequest;
};

export type StudentUpdateMutationVariables = {
	id: string;
	body: import("@/types/api").StudentUpdateRequest;
};

export type StudentSetActiveMutationVariables = {
	id: string;
	active: boolean;
};

export type RemoveStudentMutationVariables = {
	accountId: string;
	userId: string;
};

export type StudentEditorDrawerProps = {
	mode: StudentEditorMode;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	studentId: string | null;
};

export interface StudentEditorFormProps {
	canRenderForm: boolean;
	courseOptions: import("@/types/client").ComboboxOption[];
	coursesError: unknown;
	form: import("react-hook-form").UseFormReturn<StudentEditorFormValues>;
	mode: StudentEditorMode;
	onRefreshCourses: () => void;
	onRefreshStudent: () => void;
	student: import("@/types/api").StudentResponse | undefined;
	studentError: unknown;
}

export type StudentFiltersDrawerProps = {
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
	courseOptions: import("@/types/client").ComboboxOption[];
	coursesError: boolean;
	startDate: string;
};

export type StudentDetailDialogProps = {
	courseName: string;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
	student: import("@/types/api").StudentResponse | undefined;
};

export interface StudentRowActionsProps {
	onDelete: (student: import("@/types/api").StudentResponse) => void;
	onOpenEditor: (id: string, mode: StudentEditorMode) => void;
	onSetActive: (
		student: import("@/types/api").StudentResponse,
		active: boolean,
	) => void;
	onView: (id: string) => void;
	student: import("@/types/api").StudentResponse;
}

export interface StudentFilterArgs {
	activeFilter: string;
	campusFilter: string;
	courseById: Map<string, import("@/types/api").CourseResponse>;
	courseIdFilter: string;
	dateField: StudentAuditDateField;
	endDate: string;
	query: string;
	startDate: string;
}
