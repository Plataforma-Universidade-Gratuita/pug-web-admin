import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge, TableText } from "@/components";
import { TABLE_IDENTIFIER_TEXT_WIDTH } from "@/features/project/attendances/constants";
import type {
	AccountResponse,
	AttendanceComplexSearchRequest,
	AttendanceCreateRequest,
	AttendanceDirectoryItem,
	AttendanceEditorFormValues,
	AttendanceFilterArgs,
	AttendanceResponse,
	AttendanceStatus,
	AttendanceValidationAction,
	AttendanceValidateRequest,
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

export { createAttendanceEditorFormSchema } from "@/schemas";

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

export function getAttendanceStatusOptions(t: TFunction): ComboboxOption[] {
	return ["WAITING", "PRESENT", "ABSENT"].map(status => ({
		value: status,
		label: getAttendanceStatusLabel(t, status as AttendanceStatus),
	}));
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

export function buildAttendanceValidatorOptions(
	accounts: AccountResponse[],
	userById: Map<string, UserResponse>,
): ComboboxOption[] {
	return [...accounts]
		.filter(account => {
			const accountType = account.accountType.accountType;
			return accountType === "ADMIN" || accountType === "PARTNER";
		})
		.sort((left, right) =>
			compareNormalizedText(
				userById.get(left.userId)?.name ?? left.email,
				userById.get(right.userId)?.name ?? right.email,
			),
		)
		.map(account => ({
			value: account.id,
			label: userById.get(account.userId)?.name ?? account.email,
			description: account.email,
		}));
}

export function mapAttendancesToDirectoryItems(
	attendances: AttendanceResponse[],
	projectById: Map<string, ProjectResponse>,
	formerStudentById: Map<string, FormerStudentResponse>,
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
): AttendanceDirectoryItem[] {
	return attendances.flatMap(attendance => {
		const project = projectById.get(attendance.projectId);
		const formerStudent = formerStudentById.get(attendance.formerStudentId);
		const studentAccount = formerStudent
			? accountById.get(formerStudent.accountId)
			: undefined;
		const studentUser = formerStudent
			? getFormerStudentUser(formerStudent, accountById, userById)
			: undefined;
		const validator = attendance.attendanceInfo.validatedBy
			? (accountById.get(attendance.attendanceInfo.validatedBy) ?? null)
			: null;

		if (!project || !formerStudent || !studentAccount || !studentUser) {
			return [];
		}

		return [
			{
				id: attendance.id,
				project: {
					id: project.id,
					name: project.name,
				},
				student: {
					account: {
						id: studentAccount.id,
						name: studentUser.name,
						email: studentAccount.email,
					},
					academicRegistration: formerStudent.academicRegistration,
					campus: formerStudent.campus,
				},
				status: attendance.status,
				attendanceInfo: attendance.attendanceInfo,
				qrValidationInfo: attendance.qrValidationInfo,
				validator: validator
					? {
							id: validator.id,
							name: userById.get(validator.userId)?.name ?? validator.email,
							email: validator.email,
						}
					: {
							id: "",
							name: "",
							email: "",
						},
			},
		];
	});
}

export function createAttendanceColumns(
	t: TFunction,
): ColumnDef<AttendanceDirectoryItem>[] {
	return [
		{
			accessorFn: row => row.status.status,
			id: "status",
			header: t("common.fields.status"),
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
			accessorKey: "id",
			header: t("project.attendancePage.table.columns.id"),
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			cell: ({ row }) => (
				<TableText
					text={row.original.id}
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
			accessorFn: row => row.student.account.name,
			id: "student",
			header: t("project.attendancePage.table.columns.student"),
		},
		{
			accessorFn: row => row.student.account.email,
			id: "email",
			header: t("project.attendancePage.table.columns.email"),
		},
		{
			accessorFn: row => row.student.academicRegistration,
			id: "registration",
			header: t("project.attendancePage.table.columns.registration"),
		},
		{
			accessorFn: row => row.qrValidationInfo.duration,
			id: "duration",
			header: t("project.attendancePage.table.columns.duration"),
		},
		{
			accessorFn: row => row.validator?.name ?? "",
			id: "validatedBy",
			header: t("project.attendancePage.table.columns.validatedBy"),
			cell: ({ row }) =>
				row.original.attendanceInfo.validatedBy
					? row.original.validator.name
					: t("project.attendancePage.table.values.notValidated"),
		},
		{
			accessorFn: row => row.attendanceInfo.validatedAtFormatted,
			id: "validatedAt",
			header: t("project.attendancePage.table.columns.validatedAt"),
			cell: ({ row }) =>
				row.original.attendanceInfo.validatedAt
					? row.original.attendanceInfo.validatedAtFormatted
					: t("project.attendancePage.table.values.notValidated"),
		},
		{
			accessorFn: row => row.attendanceInfo.auditInfo.createdAtFormatted,
			id: "createdAt",
			header: t("common.fields.createdAt"),
		},
		{
			accessorFn: row => row.attendanceInfo.auditInfo.updatedAtFormatted,
			id: "updatedAt",
			header: t("common.fields.updatedAt"),
		},
	];
}

export function buildAttendanceComplexSearchRequest(filters: {
	projectIds: string[];
	formerStudentIds: string[];
	statuses: AttendanceStatus[];
	validatedByIds: string[];
	durationFrom: string;
	durationTo: string;
	dateFrom: string;
	dateTo: string;
}): AttendanceComplexSearchRequest {
	return {
		projectIds: filters.projectIds.length > 0 ? filters.projectIds : undefined,
		formerStudentIds:
			filters.formerStudentIds.length > 0
				? filters.formerStudentIds
				: undefined,
		statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
		validatedByIds:
			filters.validatedByIds.length > 0 ? filters.validatedByIds : undefined,
		durationFrom: filters.durationFrom.trim()
			? Number(filters.durationFrom)
			: undefined,
		durationTo: filters.durationTo.trim()
			? Number(filters.durationTo)
			: undefined,
		dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start"),
		dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end"),
	};
}

export function filterAttendancesByBackendFilters(
	items: AttendanceDirectoryItem[],
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: AttendanceStatus[];
		validatedByIds: string[];
		durationFrom: string;
		durationTo: string;
		dateFrom: string;
		dateTo: string;
	},
) {
	const hasProjects = filters.projectIds.length > 0;
	const hasStudents = filters.formerStudentIds.length > 0;
	const hasStatuses = filters.statuses.length > 0;
	const hasValidators = filters.validatedByIds.length > 0;
	const hasDurationFrom = filters.durationFrom.trim().length > 0;
	const hasDurationTo = filters.durationTo.trim().length > 0;
	const durationFrom = hasDurationFrom ? Number(filters.durationFrom) : null;
	const durationTo = hasDurationTo ? Number(filters.durationTo) : null;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);

	return items.filter(item => {
		if (hasProjects && !filters.projectIds.includes(item.project.id))
			return false;
		if (
			hasStudents &&
			!filters.formerStudentIds.includes(item.student.account.id)
		)
			return false;
		if (hasStatuses && !filters.statuses.includes(item.status.status))
			return false;
		if (
			hasValidators &&
			!filters.validatedByIds.includes(item.validator?.id ?? "")
		) {
			return false;
		}
		if (durationFrom !== null && item.qrValidationInfo.duration < durationFrom)
			return false;
		if (durationTo !== null && item.qrValidationInfo.duration > durationTo)
			return false;
		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					item.attendanceInfo.auditInfo.createdAt,
					item.attendanceInfo.auditInfo.updatedAt,
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

export function filterAttendanceListByBackendFilters(
	attendances: AttendanceResponse[],
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: AttendanceStatus[];
		validatedByIds: string[];
		durationFrom: string;
		durationTo: string;
		dateFrom: string;
		dateTo: string;
	},
) {
	const hasProjects = filters.projectIds.length > 0;
	const hasStudents = filters.formerStudentIds.length > 0;
	const hasStatuses = filters.statuses.length > 0;
	const hasValidators = filters.validatedByIds.length > 0;
	const hasDurationFrom = filters.durationFrom.trim().length > 0;
	const hasDurationTo = filters.durationTo.trim().length > 0;
	const durationFrom = hasDurationFrom ? Number(filters.durationFrom) : null;
	const durationTo = hasDurationTo ? Number(filters.durationTo) : null;
	const hasDateRange = Boolean(filters.dateFrom || filters.dateTo);

	return attendances.filter(attendance => {
		if (hasProjects && !filters.projectIds.includes(attendance.projectId))
			return false;
		if (
			hasStudents &&
			!filters.formerStudentIds.includes(attendance.formerStudentId)
		)
			return false;
		if (hasStatuses && !filters.statuses.includes(attendance.status.status))
			return false;
		if (
			hasValidators &&
			!filters.validatedByIds.includes(
				attendance.attendanceInfo.validatedBy ?? "",
			)
		) {
			return false;
		}
		if (
			durationFrom !== null &&
			attendance.qrValidationInfo.duration < durationFrom
		)
			return false;
		if (
			durationTo !== null &&
			attendance.qrValidationInfo.duration > durationTo
		)
			return false;
		if (
			hasDateRange &&
			!matchesAnyDateRange(
				[
					attendance.attendanceInfo.auditInfo.createdAt,
					attendance.attendanceInfo.auditInfo.updatedAt,
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

export function filterAttendancesByFrontendFilters(
	items: AttendanceDirectoryItem[],
	{ query, statuses }: AttendanceFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasStatuses = statuses.length > 0;
	if (!normalizedQuery && !hasStatuses) return items;

	return items.filter(item => {
		if (hasStatuses && !statuses.includes(item.status.status)) {
			return false;
		}

		const fields = [
			item.project.name,
			item.student.account.name,
			item.student.account.email,
			item.student.academicRegistration,
			item.validator?.name ?? "",
		].map(value => normalizeTextForSearch(String(value)));

		if (!normalizedQuery) {
			return true;
		}

		return fields.some(value => value.includes(normalizedQuery));
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

export function getAttendanceFilterSummary(
	t: TFunction,
	filters: {
		projectIds: string[];
		formerStudentIds: string[];
		statuses: AttendanceStatus[];
		validatedByIds: string[];
		durationFrom: string;
		durationTo: string;
		dateFrom: string;
		dateTo: string;
	},
	query: string,
) {
	const parts: string[] = [];
	if (query.trim()) parts.push(query.trim());
	if (filters.projectIds.length > 0)
		parts.push(t("project.attendancePage.filters.summary.projects"));
	if (filters.formerStudentIds.length > 0)
		parts.push(t("project.attendancePage.filters.summary.formerStudents"));
	if (filters.statuses.length > 0)
		parts.push(t("project.attendancePage.filters.summary.statuses"));
	if (filters.validatedByIds.length > 0)
		parts.push(t("project.attendancePage.filters.summary.validators"));
	if (filters.durationFrom || filters.durationTo)
		parts.push(t("project.attendancePage.filters.summary.duration"));
	if (filters.dateFrom || filters.dateTo)
		parts.push(t("project.attendancePage.filters.summary.auditDate"));
	return parts.join(" | ");
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
		fallbackTitle: t("common.loadErrors.projects.title"),
		fallbackDescription: t("common.loadErrors.projects.description"),
	});
}

export function getAttendanceStudentsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.formerStudents.title"),
		fallbackDescription: t("common.loadErrors.formerStudents.description"),
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
		fallbackTitle: t("project.attendancePage.feedback.createError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.createError.description",
		),
	});
}

export function getAttendanceUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.update.feedback.error.title"),
		fallbackDescription: t(
			"project.attendancePage.update.feedback.error.description",
		),
	});
}

export function getAttendanceDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.deleteError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.deleteError.description",
		),
	});
}

export function getAttendanceValidateErrorToastContent(
	t: TFunction,
	error: unknown,
	action?: AttendanceValidationAction,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: action
			? t(`project.attendancePage.${action}.feedback.error.title`)
			: t("project.attendancePage.feedback.updateError.title"),
		fallbackDescription: action
			? t(`project.attendancePage.${action}.feedback.error.description`)
			: t("project.attendancePage.feedback.updateError.description"),
	});
}

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
