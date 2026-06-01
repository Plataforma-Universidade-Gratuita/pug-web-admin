import type { UseFormReturn } from "react-hook-form";

import type {
	AccountResponse,
	AttendanceCreateRequest,
	AttendanceResponse,
	AttendanceStatus,
	FormerStudentResponse,
	ProjectResponse,
	UserResponse,
} from "@/types";
import type { AttendanceValidateRequest } from "@/types";
import type { ComboboxOption } from "@/types";

export interface AttendancePageProps {
	attendanceId: string;
}

export interface AttendanceRoutePageProps {
	params: Promise<{
		attendanceId: string;
	}>;
}

export type AttendanceAuditDateField = "" | "createdAt" | "updatedAt";
export type AttendanceStatusFilter = "" | AttendanceStatus;
export type AttendanceValidationAction = "markAbsent" | "markPresent";

export interface AttendanceSecondaryFilters {
	dateField: AttendanceAuditDateField;
	endDate: string;
	projectIdFilter: string;
	startDate: string;
	statusFilter: AttendanceStatusFilter;
	formerStudentIdFilter: string;
}

export interface AttendanceCreateFormValues {
	duration: string;
	projectId: string;
	formerStudentId: string;
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

export interface AttendancesCreateDrawerProps {
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export interface AttendancesCreateFormProps {
	canRenderForm: boolean;
	form: UseFormReturn<AttendanceCreateFormValues>;
	onRefreshProjects: () => void;
	onRefreshFormerStudents: () => void;
	projectOptions: ComboboxOption[];
	projectsError: unknown;
	formerStudentOptions: ComboboxOption[];
	formerStudentsError: unknown;
}

export interface AttendancesFiltersDrawerProps {
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
	onRefreshFormerStudents: () => void;
	onStartDateChange: (value: string) => void;
	onStatusFilterChange: (value: AttendanceStatusFilter) => void;
	onFormerStudentIdFilterChange: (value: string) => void;
	open: boolean;
	projectIdFilter: string;
	projectOptions: ComboboxOption[];
	projectsError: boolean;
	startDate: string;
	statusFilter: AttendanceStatusFilter;
	formerStudentIdFilter: string;
	formerStudentOptions: ComboboxOption[];
	formerStudentsError: boolean;
}

export interface AttendancesRowActionsProps {
	attendance: AttendanceResponse;
	href: string;
	onDelete: (attendance: AttendanceResponse) => void;
	onValidate: (
		attendance: AttendanceResponse,
		action: AttendanceValidationAction,
	) => void;
}

export interface AttendanceFilterArgs {
	accountById: Map<string, AccountResponse>;
	dateField: AttendanceAuditDateField;
	endDate: string;
	projectById: Map<string, ProjectResponse>;
	projectIdFilter: string;
	query: string;
	startDate: string;
	statusFilter: AttendanceStatusFilter;
	formerStudentById: Map<string, FormerStudentResponse>;
	formerStudentIdFilter: string;
	userById: Map<string, UserResponse>;
}
