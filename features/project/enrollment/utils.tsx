import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge } from "@/components";
import type {
	EnrollmentResponse,
	EnrollmentStatus,
	ProjectResponse,
	StudentResponse,
} from "@/types/api";
import type { BadgeTone, ComboboxOption } from "@/types/client";
import type {
	EnrollmentFilterArgs,
	EnrollmentStatusAction,
} from "@/types/client/project";
import { getApiErrorToastContent } from "@/utils/api-errors";
import { compareNormalizedText, normalizeTextForSearch } from "@/utils/lang";

const ENROLLMENT_KEY_SEPARATOR = "::";

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

export function createEnrollmentCompositeKey(
	projectId: string,
	studentId: string,
) {
	return `${projectId}${ENROLLMENT_KEY_SEPARATOR}${studentId}`;
}

export function parseEnrollmentCompositeKey(value: string | null) {
	if (!value) {
		return null;
	}

	const [projectId, studentId] = value.split(ENROLLMENT_KEY_SEPARATOR);
	if (!projectId || !studentId) {
		return null;
	}

	return { projectId, studentId };
}

export function resolveEnrollmentProjectLabel(
	projectById: Map<string, ProjectResponse>,
	projectId: string,
) {
	return projectById.get(projectId)?.name ?? projectId;
}

export function resolveEnrollmentStudentLabel(
	studentById: Map<string, StudentResponse>,
	studentId: string,
) {
	return studentById.get(studentId)?.userName ?? studentId;
}

export function getEnrollmentStatusLabel(
	t: TFunction,
	status: EnrollmentStatus,
) {
	return t(`project.enrollmentPage.status.options.${status}`);
}

export function getEnrollmentStatusTone(
	status: EnrollmentStatus,
): BadgeTone {
	switch (status) {
		case "APPROVED":
			return "success";
		case "CANCELED":
		case "REJECTED":
		case "REMOVED":
			return "danger";
		case "COMPLETED":
			return "brand";
		case "EXITED":
			return "warning";
		case "PENDING":
		default:
			return "info";
	}
}

export function buildEnrollmentProjectOptions(
	projects: ProjectResponse[],
): ComboboxOption[] {
	return [...projects]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(project => ({
			value: project.id,
			label: project.name,
			description: project.statusFormatted,
		}));
}

export function buildEnrollmentStudentOptions(
	students: StudentResponse[],
): ComboboxOption[] {
	return [...students]
		.sort((left, right) => compareNormalizedText(left.userName, right.userName))
		.map(student => ({
			value: student.accountId,
			label: student.userName,
			description: student.accountEmail,
			keywords: [student.academicRegistration],
		}));
}

export function createEnrollmentColumns(
	t: TFunction,
	projectById: Map<string, ProjectResponse>,
	studentById: Map<string, StudentResponse>,
): ColumnDef<EnrollmentResponse>[] {
	return [
		{
			accessorFn: row => resolveEnrollmentStudentLabel(studentById, row.studentId),
			id: "student",
			header: t("project.enrollmentPage.table.columns.student"),
		},
		{
			accessorFn: row => resolveEnrollmentProjectLabel(projectById, row.projectId),
			id: "project",
			header: t("project.enrollmentPage.table.columns.project"),
		},
		{
			accessorFn: row => row.status,
			id: "status",
			header: t("project.enrollmentPage.table.columns.status"),
			cell: ({ row }) => (
				<Badge
					tone={getEnrollmentStatusTone(row.original.status)}
					variant="primary"
					className="min-h-5 px-2 py-0.5"
				>
					{getEnrollmentStatusLabel(t, row.original.status)}
				</Badge>
			),
		},
		{
			accessorFn: row => row.acceptedAt ?? "",
			id: "acceptedAt",
			header: t("project.enrollmentPage.table.columns.acceptedAt"),
			cell: ({ row }) =>
				row.original.acceptedAt
					? row.original.acceptedAtFormatted
					: t("project.enrollmentPage.table.values.notAccepted"),
		},
		{
			accessorFn: row => row.closingStatusAt ?? "",
			id: "closingStatusAt",
			header: t("project.enrollmentPage.table.columns.closingStatusAt"),
			cell: ({ row }) =>
				row.original.closingStatusAt
					? row.original.closingStatusAtFormatted
					: t("project.enrollmentPage.table.values.open"),
		},
	];
}

export function filterEnrollments(
	enrollments: EnrollmentResponse[],
	{
		dateField,
		endDate,
		projectById,
		projectIdFilter,
		query,
		startDate,
		statusFilter,
		studentById,
		studentIdFilter,
	}: EnrollmentFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasProjectFilter = projectIdFilter.length > 0;
	const hasStudentFilter = studentIdFilter.length > 0;
	const hasStatusFilter = statusFilter.length > 0;
	const startTimestamp = startDate ? getStartOfDayTimestamp(startDate) : null;
	const endTimestamp = endDate ? getStartOfDayTimestamp(endDate) : null;

	if (
		!hasQuery &&
		!hasProjectFilter &&
		!hasStudentFilter &&
		!hasStatusFilter &&
		!dateField &&
		startTimestamp === null &&
		endTimestamp === null
	) {
		return enrollments;
	}

	return enrollments.filter(enrollment => {
		if (hasQuery) {
			const student = studentById.get(enrollment.studentId);
			const normalizedStudent = normalizeTextForSearch(
				resolveEnrollmentStudentLabel(studentById, enrollment.studentId),
			);
			const normalizedEmail = normalizeTextForSearch(
				student?.accountEmail ?? "",
			);
			const normalizedRegistration = normalizeTextForSearch(
				student?.academicRegistration ?? "",
			);
			const normalizedProject = normalizeTextForSearch(
				resolveEnrollmentProjectLabel(projectById, enrollment.projectId),
			);
			const normalizedStatus = normalizeTextForSearch(enrollment.statusFormatted);

			if (
				!normalizedStudent.includes(normalizedQuery) &&
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedRegistration.includes(normalizedQuery) &&
				!normalizedProject.includes(normalizedQuery) &&
				!normalizedStatus.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasProjectFilter && enrollment.projectId !== projectIdFilter) {
			return false;
		}

		if (hasStudentFilter && enrollment.studentId !== studentIdFilter) {
			return false;
		}

		if (hasStatusFilter && enrollment.status !== statusFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				enrollment.auditInfo[dateField],
			);

			if (startTimestamp !== null && auditTimestamp < startTimestamp) {
				return false;
			}

			if (endTimestamp !== null && auditTimestamp > endTimestamp) {
				return false;
			}
		}

		return true;
	});
}

export function getEnrollmentEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("project.enrollmentPage.empty.title"),
		description: query
			? t("project.enrollmentPage.empty.filteredDescription", {
					value: query,
				})
			: t("project.enrollmentPage.empty.defaultDescription"),
	};
}

export function getEnrollmentsListErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.listError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.listError.description",
		),
	});
}

export function getEnrollmentDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.detailError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.detailError.description",
		),
	});
}

export function getEnrollmentProjectsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.projectsError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.projectsError.description",
		),
	});
}

export function getEnrollmentStudentsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.studentsError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.studentsError.description",
		),
	});
}

export function getEnrollmentDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.delete.feedback.error.title"),
		fallbackDescription: t(
			"project.enrollmentPage.delete.feedback.error.description",
		),
	});
}

export function getEnrollmentStatusActionErrorToastContent(
	t: TFunction,
	error: unknown,
	action: EnrollmentStatusAction,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(`project.enrollmentPage.${action}.feedback.error.title`),
		fallbackDescription: t(
			`project.enrollmentPage.${action}.feedback.error.description`,
		),
	});
}

export function getEnrollmentFilterSummary(
	t: TFunction,
	{
		dateField,
		endDate,
		projectById,
		projectIdFilter,
		query,
		startDate,
		statusFilter,
		studentById,
		studentIdFilter,
	}: EnrollmentFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (projectIdFilter) {
		parts.push(resolveEnrollmentProjectLabel(projectById, projectIdFilter));
	}

	if (studentIdFilter) {
		parts.push(resolveEnrollmentStudentLabel(studentById, studentIdFilter));
	}

	if (statusFilter) {
		parts.push(getEnrollmentStatusLabel(t, statusFilter));
	}

	if (dateField) {
		parts.push(
			t(`project.enrollmentPage.filters.dateField.options.${dateField}`),
		);
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
	}

	return parts.join(" | ");
}

export function getEnrollmentStatusOptions(t: TFunction) {
	return [
		"PENDING",
		"APPROVED",
		"COMPLETED",
		"REJECTED",
		"CANCELED",
		"EXITED",
		"REMOVED",
	].map(status => ({
		value: status as EnrollmentStatus,
		label: getEnrollmentStatusLabel(t, status as EnrollmentStatus),
	}));
}
