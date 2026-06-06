import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge, TableText } from "@/components";
import { ENROLLMENT_KEY_SEPARATOR } from "@/constants";
import { TABLE_IDENTIFIER_TEXT_WIDTH } from "@/features/project/enrollments/constants";
import type {
	AccountResponse,
	EnrollmentComplexSearchRequest,
	EnrollmentDirectoryItem,
	EnrollmentEditorFormValues,
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
import {
	compareNormalizedText,
	matchesAnyDateRange,
	normalizeTextForSearch,
	toSearchDateOffsetDateTime,
} from "@/utils";

export { createEnrollmentEditorFormSchema } from "@/schemas";

function getFormerStudentUser(
	formerStudent: FormerStudentResponse | undefined,
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
) {
	if (!formerStudent) {
		return null;
	}

	const account = accountById.get(formerStudent.accountId);
	return account ? (userById.get(account.userId) ?? null) : null;
}

function getProjectLabel(project: ProjectResponse | null | undefined) {
	return project?.name ?? "";
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

	const normalizedValue = (() => {
		try {
			return decodeURIComponent(value);
		} catch {
			return value;
		}
	})();

	const [projectId, formerStudentId] = normalizedValue.split(
		ENROLLMENT_KEY_SEPARATOR,
	);
	if (!projectId || !formerStudentId) {
		return null;
	}

	return { projectId, formerStudentId };
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
			return "info";
		case "CANCELED":
			return "warning";
		case "REJECTED":
		case "REMOVED":
			return "danger";
		case "COMPLETED":
			return "success";
		case "EXITED":
			return "danger";
		case "ON_HOLD":
			return "warning";
		case "PENDING":
			return "brand";
		default:
			return "info";
	}
}

export function getEnrollmentStatusOptions(t: TFunction): ComboboxOption[] {
	return [
		"PENDING",
		"APPROVED",
		"REJECTED",
		"CANCELED",
		"COMPLETED",
		"EXITED",
		"ON_HOLD",
		"REMOVED",
	].map(status => ({
		value: status,
		label: getEnrollmentStatusLabel(t, status as EnrollmentStatus),
	}));
}

export function getEditableEnrollmentStatusOptions(
	t: TFunction,
	currentStatus: EnrollmentStatus,
): ComboboxOption[] {
	const nextStatuses = (() => {
		switch (currentStatus) {
			case "PENDING":
				return ["PENDING", "APPROVED", "REJECTED", "CANCELED", "REMOVED"];
			case "APPROVED":
				return ["APPROVED", "COMPLETED", "CANCELED", "REMOVED"];
			default:
				return [currentStatus];
		}
	})();

	return nextStatuses.map(status => ({
		value: status,
		label: getEnrollmentStatusLabel(t, status as EnrollmentStatus),
	}));
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
				getFormerStudentUser(left, accountById, userById)?.name ??
					left.academicRegistration,
				getFormerStudentUser(right, accountById, userById)?.name ??
					right.academicRegistration,
			),
		)
		.map(formerStudent => {
			const account = accountById.get(formerStudent.accountId);
			const user = getFormerStudentUser(formerStudent, accountById, userById);

			return {
				value: formerStudent.accountId,
				label: user?.name ?? formerStudent.academicRegistration,
				description: account?.email ?? formerStudent.academicRegistration,
				keywords: [formerStudent.academicRegistration],
			};
		});
}

export function mapEnrollmentsToDirectoryItems(
	enrollments: EnrollmentResponse[],
	projectById: Map<string, ProjectResponse>,
	formerStudentById: Map<string, FormerStudentResponse>,
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
): EnrollmentDirectoryItem[] {
	return enrollments.flatMap(enrollment => {
		const project = projectById.get(enrollment.projectId);
		const formerStudent = formerStudentById.get(enrollment.formerStudentId);
		const account = formerStudent
			? accountById.get(formerStudent.accountId)
			: undefined;
		const user = formerStudent
			? getFormerStudentUser(formerStudent, accountById, userById)
			: undefined;

		if (!project || !formerStudent || !account || !user) {
			return [];
		}

		return [
			{
				project: {
					id: project.id,
					name: project.name,
				},
				student: {
					account: {
						id: account.id,
						name: user.name,
						email: account.email,
					},
					academicRegistration: formerStudent.academicRegistration,
					campus: formerStudent.campus,
				},
				status: enrollment.status,
				enrollmentInfo: enrollment.enrollmentInfo,
			},
		];
	});
}

export function createEnrollmentColumns(
	t: TFunction,
): ColumnDef<EnrollmentDirectoryItem>[] {
	return [
		{
			accessorFn: row => row.status.status,
			id: "status",
			header: t("common.fields.status"),
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
			accessorFn: row => row.project.id,
			id: "projectId",
			header: t("common.fields.projectId"),
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			cell: ({ row }) => (
				<TableText
					text={row.original.project.id}
					maxWidth={TABLE_IDENTIFIER_TEXT_WIDTH}
					tooltiped
				/>
			),
		},
		{
			accessorFn: row => row.project.name,
			id: "project",
			header: t("common.fields.project"),
		},
		{
			accessorFn: row => row.student.account.id,
			id: "formerStudentId",
			header: t("project.enrollmentPage.table.columns.studentId"),
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			cell: ({ row }) => (
				<TableText
					text={row.original.student.account.id}
					maxWidth={TABLE_IDENTIFIER_TEXT_WIDTH}
					tooltiped
				/>
			),
		},
		{
			accessorFn: row => row.student.account.name,
			id: "formerStudent",
			header: t("project.enrollmentPage.table.columns.student"),
		},
		{
			accessorFn: row => row.student.account.email,
			id: "email",
			header: t("project.enrollmentPage.table.columns.email"),
		},
		{
			accessorFn: row => row.student.academicRegistration,
			id: "academicRegistration",
			header: t("project.enrollmentPage.table.columns.registration"),
		},
		{
			accessorFn: row => row.student.campus.campusFormatted,
			id: "campus",
			header: t("common.fields.campus"),
		},
		{
			accessorFn: row => row.enrollmentInfo.acceptedAtFormatted,
			id: "acceptedAt",
			header: t("project.enrollmentPage.table.columns.acceptedAt"),
			cell: ({ row }) =>
				row.original.enrollmentInfo.acceptedAt
					? row.original.enrollmentInfo.acceptedAtFormatted
					: t("project.enrollmentPage.table.values.notAccepted"),
		},
		{
			accessorFn: row => row.enrollmentInfo.closingStatusAtFormatted,
			id: "closingStatusAt",
			header: t("project.enrollmentPage.table.columns.closingStatusAt"),
			cell: ({ row }) =>
				row.original.enrollmentInfo.closingStatusAt
					? row.original.enrollmentInfo.closingStatusAtFormatted
					: t("project.enrollmentPage.table.values.open"),
		},
		{
			accessorFn: row => row.enrollmentInfo.auditInfo.createdAtFormatted,
			id: "createdAt",
			header: t("common.fields.createdAt"),
		},
		{
			accessorFn: row => row.enrollmentInfo.auditInfo.updatedAtFormatted,
			id: "updatedAt",
			header: t("common.fields.updatedAt"),
		},
	];
}

export function buildEnrollmentComplexSearchRequest(filters: {
	projectIds: string[];
	formerStudentIds: string[];
	statuses: EnrollmentStatus[];
	dateFrom: string;
	dateTo: string;
	periodFrom: string;
	periodTo: string;
}): EnrollmentComplexSearchRequest {
	return {
		projectIds: filters.projectIds.length > 0 ? filters.projectIds : undefined,
		formerStudentIds:
			filters.formerStudentIds.length > 0
				? filters.formerStudentIds
				: undefined,
		statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
		dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start"),
		dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end"),
		periodFrom: filters.periodFrom || undefined,
		periodTo: filters.periodTo || undefined,
	};
}

export function filterEnrollmentsByBackendFilters(
	items: EnrollmentDirectoryItem[],
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: EnrollmentStatus[];
		dateFrom: string;
		dateTo: string;
	},
) {
	const hasProjects = filters.projectIds.length > 0;
	const hasStudents = filters.formerStudentIds.length > 0;
	const hasStatuses = filters.statuses.length > 0;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);

	return items.filter(item => {
		if (hasProjects && !filters.projectIds.includes(item.project.id)) {
			return false;
		}

		if (
			hasStudents &&
			!filters.formerStudentIds.includes(item.student.account.id)
		) {
			return false;
		}

		if (hasStatuses && !filters.statuses.includes(item.status.status)) {
			return false;
		}

		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					item.enrollmentInfo.auditInfo.createdAt,
					item.enrollmentInfo.auditInfo.updatedAt,
				],
				{
					...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
					...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
				},
			)
		) {
			return false;
		}

		return true;
	});
}

export function filterEnrollmentListByBackendFilters(
	enrollments: EnrollmentResponse[],
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: EnrollmentStatus[];
		dateFrom: string;
		dateTo: string;
		periodFrom: string;
		periodTo: string;
	},
	formerStudentById: Map<string, FormerStudentResponse>,
) {
	const hasProjects = filters.projectIds.length > 0;
	const hasStudents = filters.formerStudentIds.length > 0;
	const hasStatuses = filters.statuses.length > 0;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);
	const hasPeriodRange = Boolean(filters.periodFrom || filters.periodTo);

	return enrollments.filter(enrollment => {
		if (hasProjects && !filters.projectIds.includes(enrollment.projectId)) {
			return false;
		}

		if (
			hasStudents &&
			!filters.formerStudentIds.includes(enrollment.formerStudentId)
		) {
			return false;
		}

		if (hasStatuses && !filters.statuses.includes(enrollment.status.status)) {
			return false;
		}

		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					enrollment.enrollmentInfo.auditInfo.createdAt,
					enrollment.enrollmentInfo.auditInfo.updatedAt,
				],
				{
					...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
					...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
				},
			)
		) {
			return false;
		}

		if (hasPeriodRange) {
			const formerStudent = formerStudentById.get(enrollment.formerStudentId);
			if (
				!formerStudent ||
				!matchesAnyDateRange(
					[formerStudent.period.startDate, formerStudent.period.dueDate],
					{
						...(filters.periodFrom ? { dateFrom: filters.periodFrom } : {}),
						...(filters.periodTo ? { dateTo: filters.periodTo } : {}),
					},
				)
			) {
				return false;
			}
		}

		return true;
	});
}

export function filterEnrollmentsByFrontendFilters(
	items: EnrollmentDirectoryItem[],
	{ query, statuses }: EnrollmentFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasStatuses = statuses.length > 0;

	if (!normalizedQuery && !hasStatuses) {
		return items;
	}

	return items.filter(item => {
		if (hasStatuses && !statuses.includes(item.status.status)) {
			return false;
		}

		const fields = [
			item.project.name,
			item.student.account.name,
			item.student.account.email,
			item.student.academicRegistration,
			item.student.campus.campusFormatted,
			item.status.statusFormatted,
		].map(value => normalizeTextForSearch(value));

		if (!normalizedQuery) {
			return true;
		}

		return fields.some(value => value.includes(normalizedQuery));
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

export function getEnrollmentFilterSummary(
	t: TFunction,
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: EnrollmentStatus[];
		dateFrom: string;
		dateTo: string;
		periodFrom: string;
		periodTo: string;
	},
	query: string,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}
	if (filters.projectIds.length > 0) {
		parts.push(t("project.enrollmentPage.filters.summary.projects"));
	}
	if (filters.formerStudentIds.length > 0) {
		parts.push(t("project.enrollmentPage.filters.summary.formerStudents"));
	}
	if (filters.statuses.length > 0) {
		parts.push(t("project.enrollmentPage.filters.summary.statuses"));
	}
	if (filters.dateFrom || filters.dateTo) {
		parts.push(t("project.enrollmentPage.filters.summary.auditDate"));
	}
	if (filters.periodFrom || filters.periodTo) {
		parts.push(t("project.enrollmentPage.filters.summary.period"));
	}

	return parts.join(" | ");
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
		fallbackTitle: t("common.loadErrors.projects.title"),
		fallbackDescription: t("common.loadErrors.projects.description"),
	});
}

export function getEnrollmentStudentsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.formerStudents.title"),
		fallbackDescription: t("common.loadErrors.formerStudents.description"),
	});
}

export function getEnrollmentDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.deleteError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.deleteError.description",
		),
	});
}

export function getEnrollmentCreateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.createError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.createError.description",
		),
	});
}

export function getEnrollmentUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
	action?: EnrollmentStatusAction,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: action
			? t(`project.enrollmentPage.${action}.feedback.error.title`)
			: t("project.enrollmentPage.feedback.updateError.title"),
		fallbackDescription: action
			? t(`project.enrollmentPage.${action}.feedback.error.description`)
			: t("project.enrollmentPage.feedback.updateError.description"),
	});
}

export function getEnrollmentStatusActionErrorToastContent(
	t: TFunction,
	error: unknown,
	action: EnrollmentStatusAction,
) {
	return getEnrollmentUpdateErrorToastContent(t, error, action);
}

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

export function getEnrollmentDialogTitle(
	project: ProjectResponse | null,
	formerStudent: FormerStudentResponse | null,
	accountById: Map<string, AccountResponse>,
) {
	const studentLabel = formerStudent
		? accountById.get(formerStudent.accountId)?.email
		: "";

	return [studentLabel, getProjectLabel(project)].filter(Boolean).join(" | ");
}
