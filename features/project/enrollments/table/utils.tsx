import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge, TableText } from "@/components/primitives";
import { ENROLLMENT_KEY_SEPARATOR } from "@/features/project/enrollments/constants";
import { TABLE_IDENTIFIER_TEXT_WIDTH } from "@/features/project/enrollments/constants";
import type {
	AccountResponse,
	EnrollmentResponse,
	EnrollmentStatus,
	FormerStudentResponse,
	ProjectResponse,
	UserResponse,
} from "@/types/api";
import type { EnrollmentDirectoryItem } from "@/types/client";
import type { BadgeTone, ComboboxOption } from "@/types/client";
import { compareNormalizedText } from "@/utils";

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
