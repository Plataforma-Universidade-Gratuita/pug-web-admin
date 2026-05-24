export type EntityAuditDateField = "" | "createdAt" | "updatedAt";
export type EntityEditorMode = "create" | "duplicate" | "update";

export type EntityEditorFormValues = {
	cnpj: string;
	name: string;
	cityId: string;
	address: string;
};

export type EntityCreateMutationVariables = {
	body: import("@/types/api").EntityCreateRequest;
};

export type EntityUpdateMutationVariables = {
	id: string;
	body: import("@/types/api").EntityUpdateRequest;
};

export type EntityEditorDrawerProps = {
	entityId: string | null;
	mode: EntityEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export type StaffActiveFilter = "" | "true" | "false";
export type StaffEditorMode = "create" | "duplicate" | "update";

export type StaffEditorFormValues = {
	cpf: string;
	name: string;
	email: string;
	password: string;
	entityId: string;
};

export type StaffCreateMutationVariables = {
	body: import("@/types/api").StaffCreateRequest;
};

export type StaffUpdateMutationVariables = {
	id: string;
	body: import("@/types/api").StaffUpdateRequest;
};

export type StaffSetActiveMutationVariables = {
	id: string;
	active: boolean;
};

export type StaffRemoveMutationVariables = {
	accountId: string;
	userId: string;
};

export type StaffEditorDrawerProps = {
	staffId: string | null;
	mode: StaffEditorMode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};
