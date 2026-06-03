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
	createdByIds: string[];
	dateFrom: string;
	dateTo: string;
	entityIds: string[];
	statuses: ProjectStatus[];
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

export interface ProjectsEditorDrawerProps {
	mode: ProjectEditorMode;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	projectId: string | null;
}

export interface ProjectsEditorFormProps {
	canRenderForm: boolean;
	entitiesError: unknown;
	entityOptions: ComboboxOption[];
	form: UseFormReturn<ProjectEditorFormValues>;
	mode: ProjectEditorMode;
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
	entitiesError: boolean;
	entityIds: string[];
	entityOptions: ComboboxOption[];
	hasActiveFilters: boolean;
	onApply: () => void;
	onCreatedByIdsChange: (value: string[]) => void;
	onClear: () => void;
	onDateFromChange: (value: string) => void;
	onDateToChange: (value: string) => void;
	onEntityIdsChange: (value: string[]) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshCreators: () => void;
	onRefreshEntities: () => void;
	onStatusesChange: (value: ProjectStatus[]) => void;
	open: boolean;
	statuses: ProjectStatus[];
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
	createdByIds: string[];
	dateFrom: string;
	dateTo: string;
	entityById: Map<string, EntityResponse>;
	entityIds: string[];
	query: string;
	statuses: ProjectStatus[];
}
