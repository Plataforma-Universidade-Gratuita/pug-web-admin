import type { Campi } from "@/types/api";

export type AccountAuditDateField = "" | "createdAt" | "updatedAt";
export type AccountActiveFilter = "" | "true" | "false";
export type AccountTypeFilter = "" | "ADMIN" | "PARTNER" | "STUDENT";

export type AdminCampusFilter = "" | Campi;
export type AdminEditorMode = "create" | "duplicate" | "update";
export type AdminEditorFormValues = {
	cpf: string;
	name: string;
	email: string;
	password: string;
	campus: Campi;
	active: boolean;
};

export type AdminCreateMutationVariables = {
	active: boolean;
	body: import("@/types/api").AdminCreateRequest;
};

export type AdminUpdateMutationVariables = {
	body: import("@/types/api").AdminUpdateRequest;
	id: string;
};

export type AdminSetActiveMutationVariables = {
	active: boolean;
	id: string;
};

export type AdminUpdateDrawerProps = {
	adminId: string | null;
	mode: AdminEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export type UserAuditDateField = "" | "createdAt" | "updatedAt";
