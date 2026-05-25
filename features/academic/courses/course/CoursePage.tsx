"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState } from "@/components";
import { useCourseDetailQuery } from "@/features/academic/courses/queries";
import { getCourseDetailErrorToastContent } from "@/features/academic/courses/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { CoursePageProps } from "@/types";
import { WebApiError } from "@/utils";

export function CoursePage({ courseId }: CoursePageProps) {
	const { t } = useTranslation();
	const courseDetailQuery = useCourseDetailQuery(courseId);

	useQueryErrorToasts([
		{
			key: `course-detail-${courseId}`,
			error: courseDetailQuery.error,
			errorUpdatedAt: courseDetailQuery.errorUpdatedAt,
			getContent: error => getCourseDetailErrorToastContent(t, error),
			isError: courseDetailQuery.isError,
		},
	]);

	const course = courseDetailQuery.data;
	const fields = useMemo(
		() =>
			course
				? [
						{
							id: "name",
							label: t("academic.coursePage.dialog.fields.name"),
							value: course.name,
						},
						{
							id: "school",
							label: t("academic.coursePage.dialog.fields.school"),
							value: course.school.name,
						},
						{
							id: "id",
							label: t("academic.coursePage.dialog.fields.id"),
							value: course.id,
						},
						{
							id: "createdAt",
							label: t("academic.coursePage.dialog.fields.createdAt"),
							value: course.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("academic.coursePage.dialog.fields.updatedAt"),
							value: course.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[course, t],
	);

	return (
		<EntityPageShell
			title={course?.name ?? t("academic.coursePage.dialog.titleFallback")}
			description={t("academic.coursePage.description")}
		>
			{courseDetailQuery.isError ? (
				courseDetailQuery.error instanceof WebApiError &&
				courseDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("academic.coursePage.dialog.notFound.title")}
						description={t("academic.coursePage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("academic.coursePage.dialog.error.title")}
						description={t("academic.coursePage.dialog.error.description")}
						onRefresh={() => {
							void courseDetailQuery.refetch();
						}}
					/>
				)
			) : course ? (
				<EntityPageFieldsGrid fields={fields} />
			) : courseDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState title={t("academic.coursePage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
