import type { AttendanceValidationAction } from "@/types/client";

export function getAttendanceValidationVariant(
	action: AttendanceValidationAction,
) {
	return action === "markPresent" ? "success" : "warning";
}
