import type {
	AttendanceCreateRequest,
	AttendanceResponse,
	AttendanceValidateRequest,
} from "@/types/api";
import type { AttendanceEditorFormValues } from "@/types/client";

export function getEmptyAttendanceEditorFormValues(): AttendanceEditorFormValues {
	return {
		duration: "",
		projectId: "",
		formerStudentId: "",
		status: "WAITING",
	};
}

export function buildAttendanceUpdateFormValues(
	attendance: AttendanceResponse,
): AttendanceEditorFormValues {
	return {
		duration: String(attendance.qrValidationInfo.duration),
		projectId: attendance.projectId,
		formerStudentId: attendance.formerStudentId,
		status: attendance.status.status,
	};
}

export function toAttendanceCreateRequest(
	values: AttendanceEditorFormValues,
): AttendanceCreateRequest {
	return {
		duration: Number(values.duration),
		projectId: values.projectId,
		formerStudentId: values.formerStudentId,
	};
}

export function toAttendanceValidateRequest(
	attendance: AttendanceResponse,
	values: AttendanceEditorFormValues,
): AttendanceValidateRequest {
	return {
		qrValidationHash: attendance.qrValidationInfo.qrValidationHash,
		status: values.status,
	};
}
