import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge } from "@/components";
import type {
	AccountResponse,
	AttendanceCreateRequest,
	AttendanceCreateFormValues,
	AttendanceFilterArgs,
	AttendanceResponse,
	AttendanceStatus,
	AttendanceValidationAction,
	FormerStudentResponse,
	ProjectResponse,
	UserResponse,
} from "@/types";
import type { BadgeTone, ComboboxOption } from "@/types";
import { getApiErrorToastContent } from "@/utils";
import { compareNormalizedText, normalizeTextForSearch } from "@/utils";

export { createAttendanceFormSchema } from "@/schemas";

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

function getFormerStudentUser(
	formerStudent: FormerStudentResponse | undefined,
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
) {
	if (!formerStudent) {
		return null;
	}

	const account = accountById.get(formerStudent.accountId);
	if (!account) {
		return null;
	}

	return userById.get(account.userId) ?? null;
}

export function resolveAttendanceProjectLabel(
	projectById: Map<string, ProjectResponse>,
	projectId: string,
) {
	return projectById.get(projectId)?.name ?? projectId;
}

export function resolveAttendanceFormerStudentLabel(
	formerStudentById: Map<string, FormerStudentResponse>,
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
	formerStudentId: string,
) {
	const formerStudent = formerStudentById.get(formerStudentId);
	const user = getFormerStudentUser(formerStudent, accountById, userById);

	return user?.name ?? formerStudent?.academicRegistration ?? formerStudentId;
}

export function resolveAttendanceValidatorLabel(
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
	validatedById: string | null,
) {
	if (!validatedById) {
		return null;
	}

	const account = accountById.get(validatedById);
	if (!account) {
		return validatedById;
	}

	return userById.get(account.userId)?.name ?? account.email;
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
			description: project.status.statusFormatted,
		}));
}

export function buildAttendanceFormerStudentOptions(
	formerStudents: FormerStudentResponse[],
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
): ComboboxOption[] {
	return [...formerStudents]
		.sort((left, right) =>
			compareNormalizedText(
				resolveAttendanceFormerStudentLabel(
					new Map([[left.accountId, left]]),
					accountById,
					userById,
					left.accountId,
				),
				resolveAttendanceFormerStudentLabel(
					new Map([[right.accountId, right]]),
					accountById,
					userById,
					right.accountId,
				),
			),
		)
		.map(formerStudent => {
			const user = getFormerStudentUser(formerStudent, accountById, userById);
			const account = accountById.get(formerStudent.accountId);

			return {
				value: formerStudent.accountId,
				label: user?.name ?? formerStudent.academicRegistration,
				description: account?.email ?? formerStudent.academicRegistration,
				keywords: [
					formerStudent.academicRegistration,
					user?.cpfFormatted ?? "",
				],
			};
		});
}

export function createAttendanceColumns(
	t: TFunction,
	projectById: Map<string, ProjectResponse>,
	formerStudentById: Map<string, FormerStudentResponse>,
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
): ColumnDef<AttendanceResponse>[] {
	return [
		{
			accessorFn: row =>
				resolveAttendanceFormerStudentLabel(
					formerStudentById,
					accountById,
					userById,
					row.formerStudentId,
				),
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
			accessorFn: row => row.qrValidationInfo.duration,
			id: "duration",
			header: t("project.attendancePage.table.columns.duration"),
		},
		{
			accessorFn: row => row.status.status,
			id: "status",
			header: t("project.attendancePage.table.columns.status"),
			cell: ({ row }) => (
				<Badge
					tone={getAttendanceStatusTone(row.original.status.status)}
					variant="primary"
					className="min-h-5 px-2 py-0.5"
				>
					{row.original.status.statusFormatted}
				</Badge>
			),
		},
		{
			accessorFn: row =>
				resolveAttendanceValidatorLabel(
					accountById,
					userById,
					row.attendanceInfo.validatedBy,
				) ?? "",
			id: "validatedBy",
			header: t("project.attendancePage.table.columns.validatedBy"),
			cell: ({ row }) =>
				resolveAttendanceValidatorLabel(
					accountById,
					userById,
					row.original.attendanceInfo.validatedBy,
				) ?? t("project.attendancePage.table.values.notValidated"),
		},
		{
			accessorFn: row => row.attendanceInfo.validatedAt ?? "",
			id: "validatedAt",
			header: t("project.attendancePage.table.columns.validatedAt"),
			cell: ({ row }) =>
				row.original.attendanceInfo.validatedAt
					? row.original.attendanceInfo.validatedAtFormatted
					: t("project.attendancePage.table.values.notValidated"),
		},
	];
}

export function filterAttendances(
	attendances: AttendanceResponse[],
	{
		accountById,
		dateField,
		endDate,
		projectById,
		projectIdFilter,
		query,
		startDate,
		statusFilter,
		formerStudentById,
		formerStudentIdFilter,
		userById,
	}: AttendanceFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasProjectFilter = projectIdFilter.length > 0;
	const hasFormerStudentFilter = formerStudentIdFilter.length > 0;
	const hasStatusFilter = statusFilter.length > 0;
	const startTimestamp = startDate ? getStartOfDayTimestamp(startDate) : null;
	const endTimestamp = endDate ? getStartOfDayTimestamp(endDate) : null;

	if (
		!hasQuery &&
		!hasProjectFilter &&
		!hasFormerStudentFilter &&
		!hasStatusFilter &&
		!dateField &&
		startTimestamp === null &&
		endTimestamp === null
	) {
		return attendances;
	}

	return attendances.filter(attendance => {
		if (hasQuery) {
			const formerStudent = formerStudentById.get(attendance.formerStudentId);
			const user = getFormerStudentUser(formerStudent, accountById, userById);
			const account = formerStudent
				? accountById.get(formerStudent.accountId)
				: null;
			const normalizedStudent = normalizeTextForSearch(
				resolveAttendanceFormerStudentLabel(
					formerStudentById,
					accountById,
					userById,
					attendance.formerStudentId,
				),
			);
			const normalizedEmail = normalizeTextForSearch(account?.email ?? "");
			const normalizedRegistration = normalizeTextForSearch(
				formerStudent?.academicRegistration ?? "",
			);
			const normalizedCpf = normalizeTextForSearch(
				user?.cpfFormatted ?? user?.cpf ?? "",
			);
			const normalizedProject = normalizeTextForSearch(
				resolveAttendanceProjectLabel(projectById, attendance.projectId),
			);
			const normalizedStatus = normalizeTextForSearch(
				attendance.status.statusFormatted,
			);
			const normalizedValidator = normalizeTextForSearch(
				resolveAttendanceValidatorLabel(
					accountById,
					userById,
					attendance.attendanceInfo.validatedBy,
				) ?? "",
			);
			const normalizedHash = normalizeTextForSearch(
				attendance.qrValidationInfo.qrValidationHash,
			);

			if (
				!normalizedStudent.includes(normalizedQuery) &&
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedRegistration.includes(normalizedQuery) &&
				!normalizedCpf.includes(normalizedQuery) &&
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

		if (
			hasFormerStudentFilter &&
			attendance.formerStudentId !== formerStudentIdFilter
		) {
			return false;
		}

		if (hasStatusFilter && attendance.status.status !== statusFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				attendance.attendanceInfo.auditInfo[dateField],
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
		formerStudentId: "",
	};
}

export function toAttendanceCreateRequest(
	values: AttendanceCreateFormValues,
): AttendanceCreateRequest {
	return {
		duration: Number(values.duration),
		projectId: values.projectId,
		formerStudentId: values.formerStudentId,
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
		formerStudentById,
		formerStudentIdFilter,
		accountById,
		userById,
	}: AttendanceFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (projectIdFilter) {
		parts.push(resolveAttendanceProjectLabel(projectById, projectIdFilter));
	}

	if (formerStudentIdFilter) {
		parts.push(
			resolveAttendanceFormerStudentLabel(
				formerStudentById,
				accountById,
				userById,
				formerStudentIdFilter,
			),
		);
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
