import type {
	AccountResponse,
	FormerStudentCreateRequest,
	FormerStudentResponse,
	FormerStudentUpdateRequest,
	UserResponse,
} from "@/types/api";
import type { FormerStudentEditorFormValues } from "@/types/client";
import { appendCopyToEmail } from "@/features/utils";

import { toFormerStudentCreateCpf } from "../filter/utils";

export function getEmptyFormerStudentEditorFormValues(): FormerStudentEditorFormValues {
	return {
		cpf: "",
		name: "",
		email: "",
		academicRegistration: "",
		campus: "JARAGUA_DO_SUL",
		courseId: "",
		requiredHours: "",
		startDate: "",
		dueDate: "",
	};
}

export function buildFormerStudentFormValues(
	formerStudent: FormerStudentResponse,
	account: AccountResponse | null,
	user: UserResponse | null,
): FormerStudentEditorFormValues {
	return {
		cpf: user?.cpfFormatted ?? user?.cpf ?? "",
		name: user?.name ?? "",
		email: account?.email ?? "",
		academicRegistration: formerStudent.academicRegistration,
		campus: formerStudent.campus.campus,
		courseId: formerStudent.courseId,
		requiredHours: String(formerStudent.counterpartHours.requiredHours),
		startDate: formerStudent.period.startDate,
		dueDate: formerStudent.period.dueDate,
	};
}

export function buildFormerStudentDuplicateFormValues(
	formerStudent: FormerStudentResponse,
	account: AccountResponse | null,
	user: UserResponse | null,
): FormerStudentEditorFormValues {
	return {
		cpf: user?.cpfFormatted ?? user?.cpf ?? "",
		name: user?.name ?? "",
		email: appendCopyToEmail(account?.email ?? ""),
		academicRegistration: "",
		campus: formerStudent.campus.campus,
		courseId: formerStudent.courseId,
		requiredHours: String(formerStudent.counterpartHours.requiredHours),
		startDate: formerStudent.period.startDate,
		dueDate: formerStudent.period.dueDate,
	};
}

export function toFormerStudentCreateRequest(
	values: FormerStudentEditorFormValues,
): FormerStudentCreateRequest {
	return {
		cpf: toFormerStudentCreateCpf(values.cpf),
		name: values.name.trim(),
		email: values.email.trim(),
		academicRegistration: values.academicRegistration.trim(),
		campus: values.campus,
		courseId: values.courseId,
		requiredHours: Number(values.requiredHours),
		startDate: values.startDate,
		dueDate: values.dueDate,
	};
}

export function toFormerStudentUpdateRequest(
	values: FormerStudentEditorFormValues,
): FormerStudentUpdateRequest {
	return {
		name: values.name.trim(),
		cpf: toFormerStudentCreateCpf(values.cpf),
		email: values.email.trim(),
		academicRegistration: values.academicRegistration.trim(),
		campus: values.campus,
		courseId: values.courseId,
		requiredHours: Number(values.requiredHours),
		startDate: values.startDate,
		dueDate: values.dueDate,
	};
}
