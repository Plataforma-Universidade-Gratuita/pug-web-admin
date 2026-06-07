import type { ProjectResponse } from "@/types/api";
import type { EnrollmentDirectoryItem } from "@/types/client";

export function getTimestamp(value: string | null | undefined) {
	if (!value) {
		return 0;
	}

	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

export function formatPercent(value: number) {
	return `${value.toFixed(0)}%`;
}

export function getProjectCompletionPercent(project: ProjectResponse) {
	const offeredHours = project.projectInfo.offeredHours ?? 0;
	if (offeredHours <= 0) {
		return 0;
	}

	return ((project.projectInfo.completedHours ?? 0) / offeredHours) * 100;
}

export function isActiveProject(project: ProjectResponse) {
	return ["PLANNED", "IN_PROGRESS", "ON_HOLD"].includes(project.status.status);
}

export function isProjectNearCompletion(project: ProjectResponse) {
	return (
		project.status.status === "IN_PROGRESS" &&
		getProjectCompletionPercent(project) >= 85
	);
}

export function getEnrollmentHref(item: EnrollmentDirectoryItem) {
	return `/project/enrollments/${encodeURIComponent(`${item.project.id}::${item.student.account.id}`)}`;
}

export function getProgressWidth(value: number) {
	return `${Math.max(0, Math.min(value, 100))}%`;
}
