import type { EnrollmentEditorFormValues, EnrollmentResponse } from "@/types";

export function getEmptyEnrollmentEditorFormValues(): EnrollmentEditorFormValues {
	return {
		projectId: "",
		formerStudentId: "",
		status: "PENDING",
	};
}

export function buildEnrollmentUpdateFormValues(
	enrollment: EnrollmentResponse,
): EnrollmentEditorFormValues {
	return {
		projectId: enrollment.projectId,
		formerStudentId: enrollment.formerStudentId,
		status: enrollment.status.status,
	};
}
