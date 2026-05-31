import type {
	EnrollmentResponse,
	EnrollmentStatus,
	FormerStudentResponse,
	ProjectResponse,
} from "@/types";
import type { ComboboxOption } from "@/types";

export interface EnrollmentPageProps {
	enrollmentId: string;
}

export interface EnrollmentRoutePageProps {
	params: Promise<{
		enrollmentId: string;
	}>;
}

export type EnrollmentAuditDateField = "" | "createdAt" | "updatedAt";
export type EnrollmentStatusFilter = "" | EnrollmentStatus;
export type EnrollmentStatusAction =
	| "accept"
	| "cancel"
	| "complete"
	| "reject"
	| "remove";

export interface EnrollmentSecondaryFilters {
	dateField: EnrollmentAuditDateField;
	endDate: string;
	projectIdFilter: string;
	startDate: string;
	statusFilter: EnrollmentStatusFilter;
	formerStudentIdFilter: string;
}

export interface EnrollmentDeleteMutationVariables {
	projectId: string;
	formerStudentId: string;
}

export interface EnrollmentStatusMutationVariables {
	action: EnrollmentStatusAction;
	projectId: string;
	formerStudentId: string;
}

export interface EnrollmentsFiltersDrawerProps {
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
	onRefreshFormerStudents: () => void;
	onStartDateChange: (value: string) => void;
	onStatusFilterChange: (value: EnrollmentStatusFilter) => void;
	onFormerStudentIdFilterChange: (value: string) => void;
	open: boolean;
	projectIdFilter: string;
	projectOptions: ComboboxOption[];
	projectsError: boolean;
	startDate: string;
	statusFilter: EnrollmentStatusFilter;
	formerStudentIdFilter: string;
	formerStudentOptions: ComboboxOption[];
	formerStudentsError: boolean;
}

export interface EnrollmentsRowActionsProps {
	enrollment: EnrollmentResponse;
	href: string;
	onDelete: (enrollment: EnrollmentResponse) => void;
	onStatusAction: (
		enrollment: EnrollmentResponse,
		action: EnrollmentStatusAction,
	) => void;
}

export interface EnrollmentFilterArgs {
	dateField: EnrollmentAuditDateField;
	endDate: string;
	projectById: Map<string, ProjectResponse>;
	projectIdFilter: string;
	query: string;
	startDate: string;
	statusFilter: EnrollmentStatusFilter;
	formerStudentById: Map<string, FormerStudentResponse>;
	formerStudentIdFilter: string;
}
