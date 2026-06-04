"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState } from "@/components";
import { AreaOfExpertiseDetailsContent } from "@/features/academic/areas-of-expertise/area-of-expertise/AreaOfExpertiseDetailsContent";
import { CourseOwnDetailsContent } from "@/features/academic/courses/course/CourseOwnDetailsContent";
import { useCoursesQuery } from "@/features/academic/courses/queries";
import { FormerStudentOwnDetailsContent } from "@/features/academic/former-students/former-student/FormerStudentOwnDetailsContent";
import { useFormerStudentDetailQuery } from "@/features/academic/former-students/queries";
import {
	getStudentCoursesErrorToastContent,
	getStudentDetailErrorToastContent,
} from "@/features/academic/former-students/utils";
import { AccountDetailsContent } from "@/features/identity/accounts/account/AccountDetailsContent";
import { useAccountDetailQuery } from "@/features/identity/accounts/queries";
import { useUserDetailQuery } from "@/features/identity/users/queries";
import { UserDetailsContent } from "@/features/identity/users/user/UserDetailsContent";
import { EntityPageShell } from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { FormerStudentPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function FormerStudentPage({ formerStudentId }: FormerStudentPageProps) {
	const { t } = useTranslation();
	const formerStudentDetailQuery = useFormerStudentDetailQuery(formerStudentId);
	const accountDetailQuery = useAccountDetailQuery(
		formerStudentDetailQuery.data?.accountId ?? null,
	);
	const userDetailQuery = useUserDetailQuery(
		accountDetailQuery.data?.userId ?? null,
	);
	const coursesQuery = useCoursesQuery();

	useQueryErrorToasts([
		{
			key: `former-student-detail-${formerStudentId}`,
			error: formerStudentDetailQuery.error,
			errorUpdatedAt: formerStudentDetailQuery.errorUpdatedAt,
			getContent: error => getStudentDetailErrorToastContent(t, error),
			isError: formerStudentDetailQuery.isError,
		},
		{
			key: `former-student-courses-${formerStudentId}`,
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
	const formerStudent = formerStudentDetailQuery.data;
	const course = useMemo(
		() =>
			formerStudent ? (courseById.get(formerStudent.courseId) ?? null) : null,
		[courseById, formerStudent],
	);

	return (
		<EntityPageShell
			title={
				userDetailQuery.data?.name ??
				t("academic.formerStudentPage.dialog.titleFallback")
			}
			description={t("academic.formerStudentPage.description")}
		>
			{formerStudentDetailQuery.isError ? (
				formerStudentDetailQuery.error instanceof WebApiError &&
				formerStudentDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("academic.formerStudentPage.dialog.notFound.title")}
						description={t(
							"academic.formerStudentPage.dialog.notFound.description",
						)}
					/>
				) : (
					<SomeErrorState
						title={t("academic.formerStudentPage.dialog.error.title")}
						description={t(
							"academic.formerStudentPage.dialog.error.description",
						)}
						onRefresh={() => {
							void formerStudentDetailQuery.refetch();
						}}
					/>
				)
			) : formerStudent ? (
				<div className="grid gap-6">
					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("academic.formerStudentPage.dialog.overhead")}
						</p>
						<FormerStudentOwnDetailsContent
							formerStudent={formerStudent}
							columns={3}
						/>
					</div>

					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("partner.staffPage.dialog.linkedAccount.overhead")}
						</p>
						<AccountDetailsContent
							accountId={formerStudent.accountId}
							includeLinkedUser={false}
						/>
					</div>

					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("partner.staffPage.dialog.linkedUser.overhead")}
						</p>
						{accountDetailQuery.data ? (
							<UserDetailsContent userId={accountDetailQuery.data.userId} />
						) : null}
					</div>

					{course ? (
						<>
							<div className="grid gap-3">
								<p className="ty-overhead">
									{t("academic.formerStudentPage.editor.sections.linkedCourse")}
								</p>
								<CourseOwnDetailsContent
									course={course}
									columns={3}
									includeName
								/>
							</div>

							<div className="grid gap-3">
								<p className="ty-overhead">
									{t(
										"academic.coursePage.dialog.linkedAreaOfExpertise.overhead",
									)}
								</p>
								<AreaOfExpertiseDetailsContent
									areaOfExpertise={course.areaOfExpertise}
									columns={3}
								/>
							</div>
						</>
					) : null}
				</div>
			) : (
				<NotFoundState
					title={t("academic.formerStudentPage.dialog.notFound.title")}
				/>
			)}
		</EntityPageShell>
	);
}
