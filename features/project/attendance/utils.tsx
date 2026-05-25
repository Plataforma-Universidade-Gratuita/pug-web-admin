import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge } from "@/components";
import type {
	AdminResponse,
	AttendanceCreateRequest,
	AttendanceResponse,
	AttendanceStatus,
	ProjectResponse,
	StudentResponse,
} from "@/types";
import type { BadgeTone, ComboboxOption } from "@/types";
import type {
	AttendanceCreateFormValues,
	AttendanceFilterArgs,
	AttendanceValidationAction,
} from "@/types";
import { getApiErrorToastContent } from "@/utils";
import { compareNormalizedText, normalizeTextForSearch } from "@/utils";

export { createAttendanceFormSchema } from "@/schemas";

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

function parseDuration(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const parsed = Number(trimmed);
	if (Number.isNaN(parsed) || parsed <= 0) {
		return null;
	}

	return parsed;
}

export function resolveAttendanceProjectLabel(
	projectById: Map<string, ProjectResponse>,
	projectId: string,
) {
	return projectById.get(projectId)?.name ?? projectId;
}

export function resolveAttendanceStudentLabel(
	studentById: Map<string, StudentResponse>,
	studentId: string,
) {
	return studentById.get(studentId)?.userName ?? studentId;
}

export function resolveAttendanceValidatorLabel(
	adminById: Map<string, AdminResponse>,
	validatedById: string | null,
) {
	if (!validatedById) {
		return null;
	}

	return adminById.get(validatedById)?.userName ?? validatedById;
}

export function getAttendanceStatusLabel(
	t: TFunction,
	status: AttendanceStatus,
) {
	return t(`project.attendancePage.status.options.${status}`);
}

export function getAttendanceStatusTone(status: AttendanceStatus): BadgeTone {
	switch (status) {
		case "PRESENT":
			return "success";
		case "ABSENT":
			return "danger";
		case "WAITING":
		default:
			return "warning";
	}
}

export function buildAttendanceProjectOptions(
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

export function buildAttendanceStudentOptions(
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

export function createAttendanceColumns(
	t: TFunction,
	projectById: Map<string, ProjectResponse>,
	studentById: Map<string, StudentResponse>,
	adminById: Map<string, AdminResponse>,
): ColumnDef<AttendanceResponse>[] {
	return [
		{
			accessorFn: row =>
				resolveAttendanceStudentLabel(studentById, row.studentId),
			id: "student",
			header: t("project.attendancePage.table.columns.student"),
		},
		{
			accessorFn: row =>
				resolveAttendanceProjectLabel(projectById, row.projectId),
			id: "project",
			header: t("project.attendancePage.table.columns.project"),
		},
		{
			accessorKey: "duration",
			header: t("project.attendancePage.table.columns.duration"),
		},
		{
			accessorFn: row => row.status,
			id: "status",
			header: t("project.attendancePage.table.columns.status"),
			cell: ({ row }) => (
				<Badge
					tone={getAttendanceStatusTone(row.original.status)}
					variant="primary"
					className="min-h-5 px-2 py-0.5"
				>
					{getAttendanceStatusLabel(t, row.original.status)}
				</Badge>
			),
		},
		{
			accessorFn: row =>
				resolveAttendanceValidatorLabel(adminById, row.validatedById) ?? "",
			id: "validatedBy",
			header: t("project.attendancePage.table.columns.validatedBy"),
			cell: ({ row }) =>
				resolveAttendanceValidatorLabel(
					adminById,
					row.original.validatedById,
				) ?? t("project.attendancePage.table.values.notValidated"),
		},
		{
			accessorFn: row => row.validatedAt ?? "",
			id: "validatedAt",
			header: t("project.attendancePage.table.columns.validatedAt"),
			cell: ({ row }) =>
				row.original.validatedAt
					? row.original.validatedAtFormatted
					: t("project.attendancePage.table.values.notValidated"),
		},
	];
}

export function filterAttendances(
	attendances: AttendanceResponse[],
	{
		adminById,
		dateField,
		endDate,
		projectById,
		projectIdFilter,
		query,
		startDate,
		statusFilter,
		studentById,
		studentIdFilter,
	}: AttendanceFilterArgs,
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
		return attendances;
	}

	return attendances.filter(attendance => {
		if (hasQuery) {
			const student = studentById.get(attendance.studentId);
			const normalizedStudent = normalizeTextForSearch(
				resolveAttendanceStudentLabel(studentById, attendance.studentId),
			);
			const normalizedEmail = normalizeTextForSearch(
				student?.accountEmail ?? "",
			);
			const normalizedRegistration = normalizeTextForSearch(
				student?.academicRegistration ?? "",
			);
			const normalizedProject = normalizeTextForSearch(
				resolveAttendanceProjectLabel(projectById, attendance.projectId),
			);
			const normalizedStatus = normalizeTextForSearch(
				attendance.statusFormatted,
			);
			const normalizedValidator = normalizeTextForSearch(
				resolveAttendanceValidatorLabel(adminById, attendance.validatedById) ??
					"",
			);
			const normalizedHash = normalizeTextForSearch(
				attendance.qrValidationHash,
			);

			if (
				!normalizedStudent.includes(normalizedQuery) &&
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedRegistration.includes(normalizedQuery) &&
				!normalizedProject.includes(normalizedQuery) &&
				!normalizedStatus.includes(normalizedQuery) &&
				!normalizedValidator.includes(normalizedQuery) &&
				!normalizedHash.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasProjectFilter && attendance.projectId !== projectIdFilter) {
			return false;
		}

		if (hasStudentFilter && attendance.studentId !== studentIdFilter) {
			return false;
		}

		if (hasStatusFilter && attendance.status !== statusFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				attendance.auditInfo[dateField],
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

export function getAttendanceEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("project.attendancePage.empty.title"),
		description: query
			? t("project.attendancePage.empty.filteredDescription", { value: query })
			: t("project.attendancePage.empty.defaultDescription"),
	};
}

export function getAttendancesListErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.listError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.listError.description",
		),
	});
}

export function getAttendanceDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.detailError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.detailError.description",
		),
	});
}

export function getAttendanceProjectsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.projectsError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.projectsError.description",
		),
	});
}

export function getAttendanceStudentsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.studentsError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.studentsError.description",
		),
	});
}

export function getAttendanceAdminsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.adminsError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.adminsError.description",
		),
	});
}

export function getAttendanceCreateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.create.feedback.error.title"),
		fallbackDescription: t(
			"project.attendancePage.create.feedback.error.description",
		),
	});
}

export function getAttendanceDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.delete.feedback.error.title"),
		fallbackDescription: t(
			"project.attendancePage.delete.feedback.error.description",
		),
	});
}

export function getAttendanceValidateErrorToastContent(
	t: TFunction,
	error: unknown,
	action: AttendanceValidationAction,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(`project.attendancePage.${action}.feedback.error.title`),
		fallbackDescription: t(
			`project.attendancePage.${action}.feedback.error.description`,
		),
	});
}

export function getEmptyAttendanceCreateFormValues(): AttendanceCreateFormValues {
	return {
		duration: "",
		projectId: "",
		studentId: "",
	};
}

export function toAttendanceCreateRequest(
	values: AttendanceCreateFormValues,
): AttendanceCreateRequest {
	return {
		duration: Number(values.duration),
		projectId: values.projectId,
		studentId: values.studentId,
	};
}

export function getAttendanceFilterSummary(
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
	}: AttendanceFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (projectIdFilter) {
		parts.push(resolveAttendanceProjectLabel(projectById, projectIdFilter));
	}

	if (studentIdFilter) {
		parts.push(resolveAttendanceStudentLabel(studentById, studentIdFilter));
	}

	if (statusFilter) {
		parts.push(getAttendanceStatusLabel(t, statusFilter));
	}

	if (dateField) {
		parts.push(
			t(`project.attendancePage.filters.dateField.options.${dateField}`),
		);
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
	}

	return parts.join(" | ");
}

export function getAttendanceStatusOptions(t: TFunction) {
	return ["WAITING", "PRESENT", "ABSENT"].map(status => ({
		value: status as AttendanceStatus,
		label: getAttendanceStatusLabel(t, status as AttendanceStatus),
	}));
}
