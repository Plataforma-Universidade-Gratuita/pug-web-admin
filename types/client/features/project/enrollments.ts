import type { UseFormReturn } from "react-hook-form";

import type {
	EnrollmentComplexSearchResponse,
	EnrollmentResponse,
	EnrollmentStatus,
	FormerStudentResponse,
	ProjectResponse,
} from "@/types/api";
import type { ComboboxOption } from "@/types/client/components/primitives/forms/combobox";

export interface EnrollmentPageProps {
	enrollmentId: string;
}

export interface EnrollmentRoutePageProps {
	params: Promise<{
		enrollmentId: string;
	}>;
}

export type EnrollmentStatusAction =
	| "accept"
	| "cancel"
	| "complete"
	| "reject"
	| "remove";
export type EnrollmentEditorMode = "create" | "update";
export type EnrollmentDirectoryItem =
	EnrollmentComplexSearchResponse["content"][number];

export interface EnrollmentComplexSearchFilters {
	projectIds: string[];
	formerStudentIds: string[];
	statuses: EnrollmentStatus[];
	dateFrom: string;
	dateTo: string;
	periodFrom: string;
	periodTo: string;
}

export interface EnrollmentEditorFormValues {
	projectId: string;
	formerStudentId: string;
	status: EnrollmentStatus;
}

export interface EnrollmentDeleteMutationVariables {
	projectId: string;
	formerStudentId: string;
}

export interface EnrollmentCreateMutationVariables {
	projectId: string;
	formerStudentId: string;
}

export interface EnrollmentStatusMutationVariables {
	action: EnrollmentStatusAction;
	projectId: string;
	formerStudentId: string;
}

export interface EnrollmentEditorDrawerProps {
	mode: EnrollmentEditorMode;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	enrollmentId: string | null;
}

export interface EnrollmentEditorFormProps {
	canRenderForm: boolean;
	form: UseFormReturn<EnrollmentEditorFormValues>;
	mode: EnrollmentEditorMode;
	enrollment: EnrollmentResponse | null;
	enrollmentError: unknown;
	project: ProjectResponse | null;
	projectError: unknown;
	projectOptions: ComboboxOption[];
	projectsError: unknown;
	formerStudent: FormerStudentResponse | null;
	formerStudentError: unknown;
	formerStudentOptions: ComboboxOption[];
	onRefreshEnrollment: () => void;
	onRefreshProject: () => void;
	onRefreshProjects: () => void;
	onRefreshFormerStudent: () => void;
}

export interface EnrollmentsFiltersDrawerProps {
	filters: EnrollmentComplexSearchFilters;
	formerStudentOptions: ComboboxOption[];
	formerStudentsError: boolean;
	hasActiveFilters: boolean;
	onApply: () => void;
	onClear: () => void;
	onFilterChange: <K extends keyof EnrollmentComplexSearchFilters>(
		key: K,
		value: EnrollmentComplexSearchFilters[K],
	) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshFormerStudents: () => void;
	onRefreshProjects: () => void;
	open: boolean;
	projectOptions: ComboboxOption[];
	projectsError: boolean;
}

export interface EnrollmentsRowActionsProps {
	enrollment: EnrollmentDirectoryItem;
	href: string;
	onDelete: (enrollment: EnrollmentDirectoryItem) => void;
	onStatusAction: (
		enrollment: EnrollmentDirectoryItem,
		action: EnrollmentStatusAction,
	) => void;
}

export interface EnrollmentFilterArgs {
	query: string;
	statuses: EnrollmentStatus[];
}
