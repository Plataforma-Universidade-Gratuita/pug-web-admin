import type { UseFormReturn } from "react-hook-form";

import type {
	AdminResponse,
	AttendanceCreateRequest,
	AttendanceResponse,
	AttendanceStatus,
	ProjectResponse,
	StudentResponse,
} from "@/types/api";
import type { AttendanceValidateRequest } from "@/types/api";
import type { ComboboxOption } from "@/types/client/components/forms";

export type AttendanceAuditDateField = "" | "createdAt" | "updatedAt";
export type AttendanceStatusFilter = "" | AttendanceStatus;
export type AttendanceValidationAction = "markAbsent" | "markPresent";

export interface AttendanceSecondaryFilters {
	dateField: AttendanceAuditDateField;
	endDate: string;
	projectIdFilter: string;
	startDate: string;
	statusFilter: AttendanceStatusFilter;
	studentIdFilter: string;
}

export interface AttendanceCreateFormValues {
	duration: string;
	projectId: string;
	studentId: string;
}

export interface AttendanceCreateMutationVariables {
	body: AttendanceCreateRequest;
}

export interface AttendanceRemoveMutationVariables {
	id: string;
}

export interface AttendanceValidateMutationVariables {
	body: AttendanceValidateRequest;
	id: string;
}

export interface AttendanceCreateDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export interface AttendanceCreateFormProps {
	canRenderForm: boolean;
	form: UseFormReturn<AttendanceCreateFormValues>;
	onRefreshProjects: () => void;
	onRefreshStudents: () => void;
	projectOptions: ComboboxOption[];
	projectsError: unknown;
	studentOptions: ComboboxOption[];
	studentsError: unknown;
}

export interface AttendanceFiltersDrawerProps {
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
}

export interface AttendanceDetailDialogProps {
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
}

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
