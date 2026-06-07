import type { EnrollmentResponse } from "@/types/api";
import type {
	EnrollmentEditorFormValues,
	EnrollmentStatusAction,
} from "@/types/client";

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

export function resolveEnrollmentStatusAction(
	status: string,
): EnrollmentStatusAction | null {
	switch (status) {
		case "APPROVED":
			return "accept";
		case "CANCELED":
			return "cancel";
		case "COMPLETED":
			return "complete";
		case "REJECTED":
			return "reject";
		case "REMOVED":
			return "remove";
		default:
			return null;
	}
}
