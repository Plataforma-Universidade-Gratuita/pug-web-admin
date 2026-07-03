/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { parseEnrollmentCompositeKey } from "@/features/project/enrollments/utils";
import type {
	AttendanceCreateRequest,
	AttendanceResponse,
	AttendanceValidateRequest,
} from "@/types/api";
import type { AttendanceEditorFormValues } from "@/types/client";

export function getEmptyAttendanceEditorFormValues(): AttendanceEditorFormValues {
	return {
		duration: "",
		enrollmentId: "",
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
		enrollmentId: "",
		projectId: attendance.projectId,
		formerStudentId: attendance.formerStudentId,
		status: attendance.status.status,
	};
}

export function toAttendanceCreateRequest(
	values: AttendanceEditorFormValues,
): AttendanceCreateRequest {
	const identifier = parseEnrollmentCompositeKey(values.enrollmentId);

	return {
		duration: Number(values.duration),
		projectId: identifier?.projectId ?? "",
		formerStudentId: identifier?.formerStudentId ?? "",
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
