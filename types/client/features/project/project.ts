import type { UseFormReturn } from "react-hook-form";

import type {
	AdminResponse,
	EntityResponse,
	ProjectCreateRequest,
	ProjectResponse,
	ProjectStatus,
	ProjectUpdateRequest,
	SchoolResponse,
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

export interface ProjectSecondaryFilters {
	createdByFilter: string;
	dateField: ProjectAuditDateField;
	endDate: string;
	entityIdFilter: string;
	startDate: string;
	statusFilter: ProjectStatusFilter;
}

export interface ProjectEditorFormValues {
	description: string;
	entityId: string;
	maxParticipants: string;
	name: string;
	offeredHours: string;
}

export interface ProjectCreateMutationVariables {
	body: ProjectCreateRequest;
}

export interface ProjectUpdateMutationVariables {
	body: ProjectUpdateRequest;
	id: string;
}

export interface ProjectRemoveMutationVariables {
	id: string;
}

export interface ProjectStatusMutationVariables {
	action: ProjectStatusAction;
	id: string;
}

export interface ProjectEditorDrawerProps {
	mode: ProjectEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: string | null;
}

export interface ProjectEditorFormProps {
	canRenderForm: boolean;
	entitiesError: unknown;
	entityById: Map<string, EntityResponse>;
	entityOptions: ComboboxOption[];
	form: UseFormReturn<ProjectEditorFormValues>;
	mode: ProjectEditorMode;
	onRefreshEntities: () => void;
	onRefreshProject: () => void;
	project: ProjectResponse | undefined;
	projectError: unknown;
}

export interface ProjectFiltersDrawerProps {
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
}

export interface ProjectDetailDialogProps {
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
}

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
