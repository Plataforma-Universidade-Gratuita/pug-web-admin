import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge } from "@/components";
import { ENROLLMENT_KEY_SEPARATOR } from "@/constants";
import type {
	AccountResponse,
	EnrollmentFilterArgs,
	EnrollmentResponse,
	EnrollmentStatus,
	EnrollmentStatusAction,
	FormerStudentResponse,
	ProjectResponse,
	UserResponse,
} from "@/types";
import type { BadgeTone, ComboboxOption } from "@/types";
import { getApiErrorToastContent } from "@/utils";
import { compareNormalizedText, normalizeTextForSearch } from "@/utils";

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

export function createEnrollmentCompositeKey(
	projectId: string,
	formerStudentId: string,
) {
	return `${projectId}${ENROLLMENT_KEY_SEPARATOR}${formerStudentId}`;
}

export function parseEnrollmentCompositeKey(value: string | null) {
	if (!value) {
		return null;
	}

	const [projectId, formerStudentId] = value.split(ENROLLMENT_KEY_SEPARATOR);
	if (!projectId || !formerStudentId) {
		return null;
	}

	return { projectId, formerStudentId };
}

export function resolveEnrollmentProjectLabel(
	projectById: Map<string, ProjectResponse>,
	projectId: string,
) {
	return projectById.get(projectId)?.name ?? projectId;
}

export function resolveEnrollmentFormerStudentLabel(
	formerStudentById: Map<string, FormerStudentResponse>,
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
	formerStudentId: string,
) {
	const formerStudent = formerStudentById.get(formerStudentId);
	const user = getFormerStudentUser(formerStudent, accountById, userById);

	return user?.name ?? formerStudent?.academicRegistration ?? formerStudentId;
}

export function getEnrollmentStatusLabel(
	t: TFunction,
	status: EnrollmentStatus,
) {
	return t(`project.enrollmentPage.status.options.${status}`);
}

export function getEnrollmentStatusTone(status: EnrollmentStatus): BadgeTone {
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
			description: project.status.statusFormatted,
		}));
}

export function buildEnrollmentFormerStudentOptions(
	formerStudents: FormerStudentResponse[],
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
): ComboboxOption[] {
	return [...formerStudents]
		.sort((left, right) =>
			compareNormalizedText(
				resolveEnrollmentFormerStudentLabel(
					new Map([[left.accountId, left]]),
					accountById,
					userById,
					left.accountId,
				),
				resolveEnrollmentFormerStudentLabel(
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

export function createEnrollmentColumns(
	t: TFunction,
	projectById: Map<string, ProjectResponse>,
	formerStudentById: Map<string, FormerStudentResponse>,
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
): ColumnDef<EnrollmentResponse>[] {
	return [
		{
			accessorFn: row =>
				resolveEnrollmentFormerStudentLabel(
					formerStudentById,
					accountById,
					userById,
					row.formerStudentId,
				),
			id: "student",
			header: t("project.enrollmentPage.table.columns.student"),
		},
		{
			accessorFn: row =>
				resolveEnrollmentProjectLabel(projectById, row.projectId),
			id: "project",
			header: t("project.enrollmentPage.table.columns.project"),
		},
		{
			accessorFn: row => row.status.status,
			id: "status",
			header: t("project.enrollmentPage.table.columns.status"),
			cell: ({ row }) => (
				<Badge
					tone={getEnrollmentStatusTone(row.original.status.status)}
					variant="primary"
					className="min-h-5 px-2 py-0.5"
				>
					{row.original.status.statusFormatted}
				</Badge>
			),
		},
		{
			accessorFn: row => row.enrollmentInfo.acceptedAt ?? "",
			id: "acceptedAt",
			header: t("project.enrollmentPage.table.columns.acceptedAt"),
			cell: ({ row }) =>
				row.original.enrollmentInfo.acceptedAt
					? row.original.enrollmentInfo.acceptedAtFormatted
					: t("project.enrollmentPage.table.values.notAccepted"),
		},
		{
			accessorFn: row => row.enrollmentInfo.closingStatusAt ?? "",
			id: "closingStatusAt",
			header: t("project.enrollmentPage.table.columns.closingStatusAt"),
			cell: ({ row }) =>
				row.original.enrollmentInfo.closingStatusAt
					? row.original.enrollmentInfo.closingStatusAtFormatted
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
		formerStudentById,
		formerStudentIdFilter,
		accountById,
		userById,
	}: EnrollmentFilterArgs,
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
		return enrollments;
	}

	return enrollments.filter(enrollment => {
		if (hasQuery) {
			const formerStudent = formerStudentById.get(enrollment.formerStudentId);
			const user = getFormerStudentUser(formerStudent, accountById, userById);
			const account = formerStudent
				? accountById.get(formerStudent.accountId)
				: null;
			const normalizedStudent = normalizeTextForSearch(
				resolveEnrollmentFormerStudentLabel(
					formerStudentById,
					accountById,
					userById,
					enrollment.formerStudentId,
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
				resolveEnrollmentProjectLabel(projectById, enrollment.projectId),
			);
			const normalizedStatus = normalizeTextForSearch(
				enrollment.status.statusFormatted,
			);

			if (
				!normalizedStudent.includes(normalizedQuery) &&
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedRegistration.includes(normalizedQuery) &&
				!normalizedCpf.includes(normalizedQuery) &&
				!normalizedProject.includes(normalizedQuery) &&
				!normalizedStatus.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasProjectFilter && enrollment.projectId !== projectIdFilter) {
			return false;
		}

		if (
			hasFormerStudentFilter &&
			enrollment.formerStudentId !== formerStudentIdFilter
		) {
			return false;
		}

		if (hasStatusFilter && enrollment.status.status !== statusFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				enrollment.enrollmentInfo.auditInfo[dateField],
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
		formerStudentById,
		formerStudentIdFilter,
		accountById,
		userById,
	}: EnrollmentFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (projectIdFilter) {
		parts.push(resolveEnrollmentProjectLabel(projectById, projectIdFilter));
	}

	if (formerStudentIdFilter) {
		parts.push(
			resolveEnrollmentFormerStudentLabel(
				formerStudentById,
				accountById,
				userById,
				formerStudentIdFilter,
			),
		);
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
