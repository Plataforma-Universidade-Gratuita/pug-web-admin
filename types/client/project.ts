import type {
	AdminResponse,
	AttendanceResponse,
	AttendanceStatus,
	EnrollmentResponse,
	EnrollmentStatus,
	EntityResponse,
	ProjectResponse,
	ProjectStatus,
	SchoolResponse,
	StudentResponse,
} from "@/types/api";
import type { ComboboxOption } from "@/types/client/components/forms";

export type ProjectAuditDateField = "" | "createdAt" | "updatedAt";
export type ProjectEditorMode = "create" | "duplicate" | "update";
export type ProjectStatusFilter = "" | ProjectStatus;
export type ProjectStatusAction =
	| "cancel"
	| "complete"
	| "hold"
	| "retake"
	| "start";

export type ProjectSecondaryFilters = {
	createdByFilter: string;
	dateField: ProjectAuditDateField;
	endDate: string;
	entityIdFilter: string;
	startDate: string;
	statusFilter: ProjectStatusFilter;
};

export type ProjectEditorFormValues = {
	description: string;
	entityId: string;
	maxParticipants: string;
	name: string;
	offeredHours: string;
};

export type ProjectCreateMutationVariables = {
	body: import("@/types/api").ProjectCreateRequest;
};

export type ProjectUpdateMutationVariables = {
	body: import("@/types/api").ProjectUpdateRequest;
	id: string;
};

export type ProjectRemoveMutationVariables = {
	id: string;
};

export type ProjectStatusMutationVariables = {
	action: ProjectStatusAction;
	id: string;
};

export type ProjectEditorDrawerProps = {
	mode: ProjectEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: string | null;
};

export interface ProjectEditorFormProps {
	canRenderForm: boolean;
	entitiesError: unknown;
	entityById: Map<string, EntityResponse>;
	entityOptions: ComboboxOption[];
	form: import("react-hook-form").UseFormReturn<ProjectEditorFormValues>;
	mode: ProjectEditorMode;
	onRefreshEntities: () => void;
	onRefreshProject: () => void;
	project: ProjectResponse | undefined;
	projectError: unknown;
}

export type ProjectFiltersDrawerProps = {
	adminsError: boolean;
	createdByFilter: string;
	creatorOptions: ComboboxOption[];
	dateField: ProjectAuditDateField;
	endDate: string;
	entitiesError: boolean;
	entityIdFilter: string;
	entityOptions: ComboboxOption[];
	hasActiveFilters: boolean;
	onApply: () => void;
	onCreatedByFilterChange: (value: string) => void;
	onClear: () => void;
	onDateFieldChange: (value: ProjectAuditDateField) => void;
	onEndDateChange: (value: string) => void;
	onEntityIdFilterChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshAdmins: () => void;
	onRefreshEntities: () => void;
	onStartDateChange: (value: string) => void;
	onStatusFilterChange: (value: ProjectStatusFilter) => void;
	open: boolean;
	startDate: string;
	statusFilter: ProjectStatusFilter;
};

export type ProjectDetailDialogProps = {
	adminById: Map<string, AdminResponse>;
	entityById: Map<string, EntityResponse>;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	onRefreshSchools: () => void;
	open: boolean;
	project: ProjectResponse | undefined;
	schools: SchoolResponse[] | undefined;
	schoolsIsError: boolean;
	schoolsIsLoading: boolean;
};

export interface ProjectRowActionsProps {
	onDelete: (project: ProjectResponse) => void;
	onOpenEditor: (id: string, mode: ProjectEditorMode) => void;
	onStatusAction: (
		project: ProjectResponse,
		action: ProjectStatusAction,
	) => void;
	onView: (id: string) => void;
	project: ProjectResponse;
}

export interface ProjectFilterArgs {
	createdByFilter: string;
	dateField: ProjectAuditDateField;
	endDate: string;
	entityById: Map<string, EntityResponse>;
	entityIdFilter: string;
	query: string;
	startDate: string;
	statusFilter: ProjectStatusFilter;
	adminById: Map<string, AdminResponse>;
}

export type EnrollmentAuditDateField = "" | "createdAt" | "updatedAt";
export type EnrollmentStatusFilter = "" | EnrollmentStatus;
export type EnrollmentStatusAction =
	| "accept"
	| "cancel"
	| "complete"
	| "reject"
	| "remove";

export type EnrollmentSecondaryFilters = {
	dateField: EnrollmentAuditDateField;
	endDate: string;
	projectIdFilter: string;
	startDate: string;
	statusFilter: EnrollmentStatusFilter;
	studentIdFilter: string;
};

export type EnrollmentDeleteMutationVariables = {
	projectId: string;
	studentId: string;
};

export type EnrollmentStatusMutationVariables = {
	action: EnrollmentStatusAction;
	projectId: string;
	studentId: string;
};

export type EnrollmentFiltersDrawerProps = {
	dateField: EnrollmentAuditDateField;
	endDate: string;
	hasActiveFilters: boolean;
	onApply: () => void;
	onClear: () => void;
	onDateFieldChange: (value: EnrollmentAuditDateField) => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onProjectIdFilterChange: (value: string) => void;
	onRefreshProjects: () => void;
	onRefreshStudents: () => void;
	onStartDateChange: (value: string) => void;
	onStatusFilterChange: (value: EnrollmentStatusFilter) => void;
	onStudentIdFilterChange: (value: string) => void;
	open: boolean;
	projectIdFilter: string;
	projectOptions: ComboboxOption[];
	projectsError: boolean;
	startDate: string;
	statusFilter: EnrollmentStatusFilter;
	studentIdFilter: string;
	studentOptions: ComboboxOption[];
	studentsError: boolean;
};

export type EnrollmentDetailDialogProps = {
	enrollment: EnrollmentResponse | undefined;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
	projectById: Map<string, ProjectResponse>;
	studentById: Map<string, StudentResponse>;
};

export interface EnrollmentRowActionsProps {
	enrollment: EnrollmentResponse;
	onDelete: (enrollment: EnrollmentResponse) => void;
	onStatusAction: (
		enrollment: EnrollmentResponse,
		action: EnrollmentStatusAction,
	) => void;
	onView: (compositeKey: string) => void;
}

export interface EnrollmentFilterArgs {
	dateField: EnrollmentAuditDateField;
	endDate: string;
	projectById: Map<string, ProjectResponse>;
	projectIdFilter: string;
	query: string;
	startDate: string;
	statusFilter: EnrollmentStatusFilter;
	studentById: Map<string, StudentResponse>;
	studentIdFilter: string;
}

export type AttendanceAuditDateField = "" | "createdAt" | "updatedAt";
export type AttendanceStatusFilter = "" | AttendanceStatus;
export type AttendanceValidationAction = "markAbsent" | "markPresent";

export type AttendanceSecondaryFilters = {
	dateField: AttendanceAuditDateField;
	endDate: string;
	projectIdFilter: string;
	startDate: string;
	statusFilter: AttendanceStatusFilter;
	studentIdFilter: string;
};

export type AttendanceCreateFormValues = {
	duration: string;
	projectId: string;
	studentId: string;
};

export type AttendanceCreateMutationVariables = {
	body: import("@/types/api").AttendanceCreateRequest;
};

export type AttendanceRemoveMutationVariables = {
	id: string;
};

export type AttendanceValidateMutationVariables = {
	body: import("@/types/api").AttendanceValidateRequest;
	id: string;
};

export type AttendanceCreateDrawerProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export interface AttendanceCreateFormProps {
	canRenderForm: boolean;
	form: import("react-hook-form").UseFormReturn<AttendanceCreateFormValues>;
	onRefreshProjects: () => void;
	onRefreshStudents: () => void;
	projectOptions: ComboboxOption[];
	projectsError: unknown;
	studentOptions: ComboboxOption[];
	studentsError: unknown;
}

export type AttendanceFiltersDrawerProps = {
	dateField: AttendanceAuditDateField;
	endDate: string;
	hasActiveFilters: boolean;
	onApply: () => void;
	onClear: () => void;
	onDateFieldChange: (value: AttendanceAuditDateField) => void;
	onEndDateChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onProjectIdFilterChange: (value: string) => void;
	onRefreshProjects: () => void;
	onRefreshStudents: () => void;
	onStartDateChange: (value: string) => void;
	onStatusFilterChange: (value: AttendanceStatusFilter) => void;
	onStudentIdFilterChange: (value: string) => void;
	open: boolean;
	projectIdFilter: string;
	projectOptions: ComboboxOption[];
	projectsError: boolean;
	startDate: string;
	statusFilter: AttendanceStatusFilter;
	studentIdFilter: string;
	studentOptions: ComboboxOption[];
	studentsError: boolean;
};

export type AttendanceDetailDialogProps = {
	adminById: Map<string, AdminResponse>;
	attendance: AttendanceResponse | undefined;
	error: unknown;
	isError: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onRefresh: () => void;
	open: boolean;
	projectById: Map<string, ProjectResponse>;
	studentById: Map<string, StudentResponse>;
};

export interface AttendanceRowActionsProps {
	attendance: AttendanceResponse;
	onDelete: (attendance: AttendanceResponse) => void;
	onValidate: (
		attendance: AttendanceResponse,
		action: AttendanceValidationAction,
	) => void;
	onView: (id: string) => void;
}

export interface AttendanceFilterArgs {
	adminById: Map<string, AdminResponse>;
	dateField: AttendanceAuditDateField;
	endDate: string;
	projectById: Map<string, ProjectResponse>;
	projectIdFilter: string;
	query: string;
	startDate: string;
	statusFilter: AttendanceStatusFilter;
	studentById: Map<string, StudentResponse>;
	studentIdFilter: string;
}
