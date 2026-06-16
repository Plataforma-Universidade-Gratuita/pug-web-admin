import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import {
	createActiveBadgeColumn,
	createDateTimeColumn,
	createTableTextColumn,
} from "@/components/composite";
import { Badge } from "@/components/primitives";
import { ADMIN_CAMPI_VALUES } from "@/features/academic/former-students/constants";
import type {
	AccountResponse,
	CourseResponse,
	FormerStudentResponse,
	UserResponse,
} from "@/types/api";
import type { FormerStudentDirectoryItem } from "@/types/client";
import type { ComboboxOption } from "@/types/client";
import { compareNormalizedText } from "@/utils";

export function buildFormerStudentDirectoryItems(
	formerStudents: FormerStudentResponse[],
	accounts: AccountResponse[],
	users: UserResponse[],
	courses: CourseResponse[],
): FormerStudentDirectoryItem[] {
	const accountById = new Map(accounts.map(account => [account.id, account]));
	const userById = new Map(users.map(user => [user.id, user]));
	const courseById = new Map(courses.map(course => [course.id, course]));

	return formerStudents.map(formerStudent => {
		const account = accountById.get(formerStudent.accountId) ?? null;
		const user = account ? (userById.get(account.userId) ?? null) : null;
		const course = courseById.get(formerStudent.courseId) ?? null;

		return {
			...formerStudent,
			account,
			course,
			user,
		};
	});
}

export function resolveFormerStudentCourseLabel(
	courseById: Map<string, CourseResponse>,
	courseId: string,
) {
	return courseById.get(courseId)?.name ?? courseId;
}

export function buildFormerStudentCourseOptions(
	courses: CourseResponse[],
): ComboboxOption[] {
	return [...courses]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(course => ({
			value: course.id,
			label: course.name,
			description: course.areaOfExpertise.name,
		}));
}

export function buildFormerStudentAreaOfExpertiseOptions(
	courses: CourseResponse[],
): ComboboxOption[] {
	const uniqueAreas = new Map<string, ComboboxOption>();

	for (const course of courses) {
		uniqueAreas.set(course.areaOfExpertise.id, {
			value: course.areaOfExpertise.id,
			label: course.areaOfExpertise.name,
		});
	}

	return [...uniqueAreas.values()].sort((left, right) =>
		compareNormalizedText(String(left.label), String(right.label)),
	);
}

export function getFormerStudentCampusOptions(t: TFunction) {
	return ADMIN_CAMPI_VALUES.map(value => ({
		value,
		label: t(`identity.adminPage.filters.campus.options.${value}`),
	}));
}

export function createFormerStudentColumns(
	t: TFunction,
): ColumnDef<FormerStudentDirectoryItem>[] {
	return [
		createActiveBadgeColumn<FormerStudentDirectoryItem>({
			id: "active",
			header: t("academic.formerStudentPage.table.columns.active"),
			value: row => row.account?.active ?? false,
			activeLabel: t("academic.formerStudentPage.table.active.yes"),
			inactiveLabel: t("academic.formerStudentPage.table.active.no"),
			size: 96,
		}),
		createTableTextColumn<FormerStudentDirectoryItem>({
			id: "accountId",
			accessorFn: row => row.account?.id ?? row.accountId,
			header: t("academic.formerStudentPage.dialog.fields.accountId"),
			text: row => row.account?.id ?? row.accountId,
			maxWidth: 50,
		}),
		{
			accessorFn: row => row.user?.name ?? row.accountId,
			id: "name",
			header: t("table.columns.name"),
		},
		{
			accessorFn: row => row.account?.email ?? "",
			id: "email",
			header: t("table.columns.email"),
		},
		{
			accessorKey: "academicRegistration",
			header: t(
				"academic.formerStudentPage.table.columns.academicRegistration",
			),
		},
		{
			accessorFn: row => row.campus.campus,
			id: "campus",
			header: t("academic.formerStudentPage.table.columns.campus"),
			cell: ({ row }) => row.original.campus.campusFormatted,
		},
		{
			accessorFn: row => row.counterpartHours.requiredHours,
			id: "requiredHours",
			header: t("academic.formerStudentPage.dialog.fields.requiredHours"),
		},
		{
			accessorFn: row => row.counterpartHours.completedHours,
			id: "completedHours",
			header: t("academic.formerStudentPage.dialog.fields.completedHours"),
		},
		{
			accessorFn: row => row.counterpartHours.missingHours,
			id: "missingHours",
			header: t("academic.formerStudentPage.dialog.fields.missingHours"),
		},
		{
			accessorFn: row => row.counterpartHours.progress,
			id: "progress",
			header: t("academic.formerStudentPage.table.columns.progress"),
			cell: ({ row }) =>
				`${row.original.counterpartHours.progress.toFixed(2)}%`,
		},
		{
			accessorFn: row => row.counterpartHours.concluded,
			id: "concluded",
			meta: {
				align: "center",
			},
			header: () => (
				<div className="table-badge-cell">
					{t("academic.formerStudentPage.table.columns.concluded")}
				</div>
			),
			cell: ({ row }) => (
				<div className="table-badge-cell">
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={
							row.original.counterpartHours.concluded ? "success" : "warning"
						}
						variant="primary"
					>
						{row.original.counterpartHours.concluded
							? t("academic.formerStudentPage.table.concluded.yes")
							: t("academic.formerStudentPage.table.concluded.no")}
					</Badge>
				</div>
			),
		},
		{
			accessorFn: row => row.period.startDate,
			id: "startDate",
			header: t("academic.formerStudentPage.dialog.fields.startDate"),
			cell: ({ row }) => row.original.period.startDateFormatted,
		},
		{
			accessorFn: row => row.period.dueDate,
			id: "dueDate",
			header: t("academic.formerStudentPage.dialog.fields.dueDate"),
			cell: ({ row }) => row.original.period.dueDateFormatted,
		},
		{
			accessorFn: row => row.period.remainingDays,
			id: "remainingDays",
			header: t("academic.formerStudentPage.dialog.fields.remainingDays"),
			cell: ({ row }) => row.original.period.remainingDaysFormatted,
		},
		{
			accessorFn: row => row.course?.name ?? row.courseId,
			id: "course",
			header: t("academic.formerStudentPage.table.columns.course"),
		},
		{
			accessorFn: row => row.course?.areaOfExpertise.name ?? "",
			id: "areaOfExpertise",
			header: t("academic.formerStudentPage.table.columns.areaOfExpertise"),
		},
		createDateTimeColumn<FormerStudentDirectoryItem>({
			id: "createdAt",
			header: t("academic.formerStudentPage.dialog.fields.createdAt"),
			value: row => row.auditInfo.createdAt,
			formattedValue: row => row.auditInfo.createdAtFormatted,
		}),
		createDateTimeColumn<FormerStudentDirectoryItem>({
			id: "updatedAt",
			header: t("academic.formerStudentPage.dialog.fields.updatedAt"),
			value: row => row.auditInfo.updatedAt,
			formattedValue: row => row.auditInfo.updatedAtFormatted,
		}),
	];
}
