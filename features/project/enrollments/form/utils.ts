import type { EnrollmentResponse } from "@/types/api";
import type { EnrollmentEditorFormValues } from "@/types/client";

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
