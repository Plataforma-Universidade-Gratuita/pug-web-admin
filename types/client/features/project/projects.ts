import type { UseFormReturn } from "react-hook-form";

import type {
	EntityResponse,
	ProjectCreateRequest,
	ProjectResponse,
	ProjectStatus,
	ProjectUpdateRequest,
} from "@/types";
import type { ComboboxOption } from "@/types";

export interface ProjectPageProps {
	projectId: string;
}

export interface ProjectRoutePageProps {
	params: Promise<{
		projectId: string;
	}>;
}

export type ProjectAuditDateField = "" | "createdAt" | "updatedAt";
export type ProjectEditorMode = "create" | "duplicate" | "update";
export type ProjectStatusAction =
	| "cancel"
	| "complete"
	| "hold"
	| "retake"
	| "start";

export interface ProjectComplexSearchFilters {
	name: string;
	entityIds: string[];
	description: string;
	createdByIds: string[];
	statuses: ProjectStatus[];
	maxOfferedHours: string;
	minOfferedHours: string;
	dateFrom: string;
	dateTo: string;
}

export interface ProjectEditorFormValues {
	areaOfExpertiseIds: string[];
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

export interface ProjectsEditorDrawerProps {
	mode: ProjectEditorMode;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	projectId: string | null;
}

export interface ProjectsEditorFormProps {
	areaOfExpertiseOptions: ComboboxOption[];
	areasOfExpertiseError: unknown;
	canRenderForm: boolean;
	entitiesError: unknown;
	entityOptions: ComboboxOption[];
	form: UseFormReturn<ProjectEditorFormValues>;
	mode: ProjectEditorMode;
	onRefreshAreasOfExpertise: () => void;
	onRefreshEntities: () => void;
	onRefreshProject: () => void;
	project: ProjectResponse | undefined;
	projectError: unknown;
}

export interface ProjectsFiltersDrawerProps {
	creatorsError: boolean;
	createdByIds: string[];
	creatorOptions: ComboboxOption[];
	dateFrom: string;
	dateTo: string;
	description: string;
	entitiesError: boolean;
	entityIds: string[];
	entityOptions: ComboboxOption[];
	hasActiveFilters: boolean;
	onApply: () => void;
	onCreatedByIdsChange: (value: string[]) => void;
	onClear: () => void;
	onDateFromChange: (value: string) => void;
	onDateToChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
	onEntityIdsChange: (value: string[]) => void;
	onMaxOfferedHoursChange: (value: string) => void;
	onMinOfferedHoursChange: (value: string) => void;
	onNameChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshCreators: () => void;
	onRefreshEntities: () => void;
	onStatusesChange: (value: ProjectStatus[]) => void;
	open: boolean;
	statuses: ProjectStatus[];
	maxOfferedHours: string;
	minOfferedHours: string;
	name: string;
}

export interface ProjectsRowActionsProps {
	href: string;
	onDelete: (project: ProjectResponse) => void;
	onDuplicate: (project: ProjectResponse) => void;
	onOpenEditor: (id: string, mode: ProjectEditorMode) => void;
	onStatusAction: (
		project: ProjectResponse,
		action: ProjectStatusAction,
	) => void;
	project: ProjectResponse;
}

export interface ProjectFilterArgs {
	dateFrom: string;
	dateTo: string;
	description: string;
	entityById: Map<string, EntityResponse>;
	entityIds: string[];
	maxOfferedHours: string;
	minOfferedHours: string;
	name: string;
	query: string;
	statuses: ProjectStatus[];
}
