import type { UseFormReturn } from "react-hook-form";

import type {
	AttendanceComplexSearchResponse,
	AttendanceCreateRequest,
	AttendanceResponse,
	AttendanceStatus,
	AttendanceValidateRequest,
	FormerStudentResponse,
	ProjectResponse,
} from "@/types";
import type { ComboboxOption } from "@/types";

export interface AttendancePageProps {
	attendanceId: string;
}

export interface AttendanceRoutePageProps {
	params: Promise<{
		attendanceId: string;
	}>;
}

export type AttendanceValidationAction = "markAbsent" | "markPresent";
export type AttendanceEditorMode = "create" | "update";
export type AttendanceDirectoryItem =
	AttendanceComplexSearchResponse["content"][number];

export interface AttendanceComplexSearchFilters {
	projectIds: string[];
	formerStudentIds: string[];
	statuses: AttendanceStatus[];
	validatedByIds: string[];
	durationFrom: string;
	durationTo: string;
	dateFrom: string;
	dateTo: string;
}

export interface AttendanceEditorFormValues {
	duration: string;
	projectId: string;
	formerStudentId: string;
	status: AttendanceStatus;
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

export interface AttendanceEditorDrawerProps {
	mode: AttendanceEditorMode;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	attendanceId: string | null;
}

export interface AttendanceEditorFormProps {
	attendance: AttendanceResponse | null;
	attendanceError: unknown;
	canRenderForm: boolean;
	formerStudent: FormerStudentResponse | null;
	formerStudentError: unknown;
	form: UseFormReturn<AttendanceEditorFormValues>;
	mode: AttendanceEditorMode;
	onRefreshAttendance: () => void;
	onRefreshFormerStudent: () => void;
	onRefreshProjects: () => void;
	formerStudentOptions: ComboboxOption[];
	project: ProjectResponse | null;
	projectError: unknown;
	projectOptions: ComboboxOption[];
	projectsError: unknown;
}

export interface AttendancesFiltersDrawerProps {
	filters: AttendanceComplexSearchFilters;
	formerStudentOptions: ComboboxOption[];
	formerStudentsError: boolean;
	hasActiveFilters: boolean;
	onApply: () => void;
	onClear: () => void;
	onFilterChange: <K extends keyof AttendanceComplexSearchFilters>(
		key: K,
		value: AttendanceComplexSearchFilters[K],
	) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshFormerStudents: () => void;
	onRefreshProjects: () => void;
	onRefreshValidators: () => void;
	open: boolean;
	projectOptions: ComboboxOption[];
	projectsError: boolean;
	validatorOptions: ComboboxOption[];
	validatorsError: boolean;
}

export interface AttendancesRowActionsProps {
	attendance: AttendanceDirectoryItem;
	href: string;
	onDelete: (attendance: AttendanceDirectoryItem) => void;
	onValidate: (
		attendance: AttendanceDirectoryItem,
		action: AttendanceValidationAction,
	) => void;
	onViewQrCode: (attendance: AttendanceDirectoryItem) => void;
}

export interface AttendanceFilterArgs {
	query: string;
	statuses: AttendanceStatus[];
}
