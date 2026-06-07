"use client";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { WebApiError } from "@/api/web";
import {
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/components/composite";
import {
	AreaOfExpertiseDetailsContent,
	CourseOwnDetailsContent,
} from "@/components/composite";
import { NotFoundState, SomeErrorState } from "@/components/primitives";
import { getCourseDetailErrorToastContent } from "@/features/academic/courses/utils";
import { useQueryErrorToasts } from "@/hooks";
import type { CoursePageProps } from "@/types/client";

const { courses: coursesApi } = web.academic;
const { useCourseDetailQuery } = coursesApi;

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
				<div className="grid gap-6">
					<CourseOwnDetailsContent course={course} />
					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("academic.coursePage.dialog.linkedAreaOfExpertise.overhead")}
						</p>
						<AreaOfExpertiseDetailsContent
							areaOfExpertise={course.areaOfExpertise}
						/>
					</div>
				</div>
			) : courseDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState title={t("academic.coursePage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
