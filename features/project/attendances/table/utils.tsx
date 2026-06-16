import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge, TableText } from "@/components/primitives";
import { TABLE_IDENTIFIER_TEXT_WIDTH } from "@/features/project/attendances/constants";
import { createEnrollmentCompositeKey } from "@/features/project/enrollments/utils";
import type {
	AccountResponse,
	AttendanceResponse,
	EnrollmentResponse,
	AttendanceStatus,
	FormerStudentResponse,
	ProjectResponse,
	UserResponse,
} from "@/types/api";
import type { AttendanceDirectoryItem } from "@/types/client";
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

export function buildAttendanceEnrollmentOptions(
	enrollments: EnrollmentResponse[],
	projectById: Map<string, ProjectResponse>,
	formerStudentById: Map<string, FormerStudentResponse>,
	accountById: Map<string, AccountResponse>,
	userById: Map<string, UserResponse>,
): ComboboxOption[] {
	return [...enrollments]
		.sort((left, right) => {
			const leftStudent = formerStudentById.get(left.formerStudentId);
			const rightStudent = formerStudentById.get(right.formerStudentId);

			return compareNormalizedText(
				getFormerStudentUser(leftStudent, accountById, userById)?.name ??
					leftStudent?.academicRegistration ??
					left.formerStudentId,
				getFormerStudentUser(rightStudent, accountById, userById)?.name ??
					rightStudent?.academicRegistration ??
					right.formerStudentId,
			);
		})
		.flatMap(enrollment => {
			const project = projectById.get(enrollment.projectId);
			const formerStudent = formerStudentById.get(enrollment.formerStudentId);
			const user = getFormerStudentUser(formerStudent, accountById, userById);

			if (!project || !formerStudent) {
				return [];
			}

			return [
				{
					value: createEnrollmentCompositeKey(
						enrollment.projectId,
						enrollment.formerStudentId,
					),
					label: user?.name ?? formerStudent.academicRegistration,
					description: project.name,
					searchText: project.name,
					keywords: [
						formerStudent.academicRegistration,
						project.name,
						user?.name ?? "",
					],
				},
			];
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
			meta: {
				align: "center",
			},
			header: () => (
				<div className="table-badge-cell">{t("table.columns.status")}</div>
			),
			cell: ({ row }) => (
				<div className="table-badge-cell">
					<Badge
						tone={getAttendanceStatusTone(row.original.status.status)}
						variant="primary"
						className="min-h-5 px-2 py-0.5"
					>
						{row.original.status.statusFormatted}
					</Badge>
				</div>
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
			header: t("table.columns.project"),
		},
		{
			accessorFn: row => row.student.account.name,
			id: "student",
			header: t("table.columns.formerStudent"),
		},
		{
			accessorFn: row => row.student.account.email,
			id: "email",
			header: t("table.columns.email"),
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
					? row.original?.validator?.name
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
			header: t("table.columns.createdAt"),
		},
		{
			accessorFn: row => row.attendanceInfo.auditInfo.updatedAtFormatted,
			id: "updatedAt",
			header: t("table.columns.updatedAt"),
		},
	];
}
