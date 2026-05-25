"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge, NotFoundState, SomeErrorState } from "@/components";
import { useCoursesQuery } from "@/features/academic/courses/queries";
import { useStudentDetailQuery } from "@/features/academic/students/queries";
import {
	getStudentCoursesErrorToastContent,
	getStudentDetailErrorToastContent,
	resolveStudentCourseLabel,
} from "@/features/academic/students/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { CourseResponse, StudentPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function StudentPage({ studentId }: StudentPageProps) {
	const { t } = useTranslation();
	const studentDetailQuery = useStudentDetailQuery(studentId);
	const coursesQuery = useCoursesQuery();

	useQueryErrorToasts([
		{
			key: `student-detail-${studentId}`,
			error: studentDetailQuery.error,
			errorUpdatedAt: studentDetailQuery.errorUpdatedAt,
			getContent: error => getStudentDetailErrorToastContent(t, error),
			isError: studentDetailQuery.isError,
		},
		{
			key: `student-courses-${studentId}`,
			error: coursesQuery.error,
			errorUpdatedAt: coursesQuery.errorUpdatedAt,
			getContent: error => getStudentCoursesErrorToastContent(t, error),
			isError: coursesQuery.isError,
		},
	]);

	const courseById = useMemo(
		() => new Map((coursesQuery.data ?? []).map(course => [course.id, course])),
		[coursesQuery.data],
	);
	const student = studentDetailQuery.data;
	const fields = useMemo(
		() =>
			student
				? [
						{
							id: "userId",
							label: t("academic.studentPage.dialog.fields.userId"),
							value: student.userId,
						},
						{
							id: "accountId",
							label: t("academic.studentPage.dialog.fields.accountId"),
							value: student.accountId,
						},
						{
							id: "name",
							label: t("academic.studentPage.dialog.fields.name"),
							value: student.userName,
						},
						{
							id: "email",
							label: t("academic.studentPage.dialog.fields.email"),
							value: student.accountEmail,
						},
						{
							id: "active",
							label: t("academic.studentPage.dialog.fields.active"),
							value: (
								<Badge
									className="min-h-5 px-2 py-0.5"
									tone={student.accountActive ? "success" : "danger"}
									variant="primary"
								>
									{student.accountActive
										? t("academic.studentPage.dialog.active.yes")
										: t("academic.studentPage.dialog.active.no")}
								</Badge>
							),
						},
						{
							id: "academicRegistration",
							label: t(
								"academic.studentPage.dialog.fields.academicRegistration",
							),
							value: student.academicRegistration,
						},
						{
							id: "campus",
							label: t("academic.studentPage.dialog.fields.campus"),
							value: student.campus.campusFormatted,
						},
						{
							id: "course",
							label: t("academic.studentPage.dialog.fields.course"),
							value: resolveStudentCourseLabel(
								courseById as Map<string, CourseResponse>,
								student.courseId,
							),
						},
						{
							id: "requiredHours",
							label: t("academic.studentPage.dialog.fields.requiredHours"),
							value: student.requiredHours,
						},
						{
							id: "completedHours",
							label: t("academic.studentPage.dialog.fields.completedHours"),
							value: student.completedHours,
						},
						{
							id: "missingHours",
							label: t("academic.studentPage.dialog.fields.missingHours"),
							value: student.missingHours,
						},
						{
							id: "startDate",
							label: t("academic.studentPage.dialog.fields.startDate"),
							value: student.startDateFormatted,
						},
						{
							id: "dueDate",
							label: t("academic.studentPage.dialog.fields.dueDate"),
							value: student.dueDateFormatted,
						},
						{
							id: "remainingDays",
							label: t("academic.studentPage.dialog.fields.remainingDays"),
							value: student.remainingDaysFormatted,
						},
						{
							id: "createdAt",
							label: t("academic.studentPage.dialog.fields.createdAt"),
							value: student.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("academic.studentPage.dialog.fields.updatedAt"),
							value: student.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[courseById, student, t],
	);

	return (
		<EntityPageShell
			title={
				student?.userName ?? t("academic.studentPage.dialog.titleFallback")
			}
			description={t("academic.studentPage.description")}
		>
			{studentDetailQuery.isError ? (
				studentDetailQuery.error instanceof WebApiError &&
				studentDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("academic.studentPage.dialog.notFound.title")}
						description={t("academic.studentPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("academic.studentPage.dialog.error.title")}
						description={t("academic.studentPage.dialog.error.description")}
						onRefresh={() => {
							void studentDetailQuery.refetch();
						}}
					/>
				)
			) : student ? (
				<EntityPageFieldsGrid fields={fields} />
			) : studentDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState
					title={t("academic.studentPage.dialog.notFound.title")}
				/>
			)}
		</EntityPageShell>
	);
}
