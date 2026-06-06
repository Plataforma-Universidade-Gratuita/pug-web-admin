"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { WebApiError } from "@/api/web";
import { NotFoundState, SomeErrorState } from "@/components";
import { FormerStudentOwnDetailsContent } from "@/features/academic/former-students/former-student/FormerStudentOwnDetailsContent";
import { AccountDetailsContent } from "@/features/identity/accounts/account/AccountDetailsContent";
import { UserDetailsContent } from "@/features/identity/users/user/UserDetailsContent";
import { EnrollmentOwnDetailsContent } from "@/features/project/enrollments/enrollment/EnrollmentOwnDetailsContent";
import {
	getEnrollmentDetailErrorToastContent,
	getEnrollmentProjectsErrorToastContent,
	getEnrollmentStudentsErrorToastContent,
	parseEnrollmentCompositeKey,
} from "@/features/project/enrollments/utils";
import { ProjectOwnDetailsContent } from "@/features/project/projects/project/ProjectOwnDetailsContent";
import { EntityPageShell } from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { EnrollmentPageProps } from "@/types";

const { formerStudents: formerStudentsApi } = web.academic;
const { accounts: accountsApi, users: usersApi } = web.identity;
const { enrollments: enrollmentsApi, projects: projectsApi } = web.project;
const { useFormerStudentDetailQuery } = formerStudentsApi;
const { useAccountDetailQuery } = accountsApi;
const { useUserDetailQuery } = usersApi;
const { useEnrollmentDetailQuery } = enrollmentsApi;
const { useProjectDetailQuery } = projectsApi;

export function EnrollmentPage({ enrollmentId }: EnrollmentPageProps) {
	const { t } = useTranslation();
	const enrollmentIdentifier = useMemo(
		() => parseEnrollmentCompositeKey(enrollmentId),
		[enrollmentId],
	);
	const enrollmentDetailQuery = useEnrollmentDetailQuery(
		enrollmentIdentifier?.projectId ?? null,
		enrollmentIdentifier?.formerStudentId ?? null,
	);
	const formerStudentDetailQuery = useFormerStudentDetailQuery(
		enrollmentDetailQuery.data?.formerStudentId ?? null,
	);
	const accountDetailQuery = useAccountDetailQuery(
		formerStudentDetailQuery.data?.accountId ?? null,
	);
	const userDetailQuery = useUserDetailQuery(
		accountDetailQuery.data?.userId ?? null,
	);
	const projectDetailQuery = useProjectDetailQuery(
		enrollmentDetailQuery.data?.projectId ?? null,
	);

	useQueryErrorToasts([
		{
			key: `enrollment-detail-${enrollmentId}`,
			error: enrollmentDetailQuery.error,
			errorUpdatedAt: enrollmentDetailQuery.errorUpdatedAt,
			getContent: error => getEnrollmentDetailErrorToastContent(t, error),
			isError: enrollmentDetailQuery.isError,
		},
		{
			key: `enrollment-project-${enrollmentId}`,
			error: projectDetailQuery.error,
			errorUpdatedAt: projectDetailQuery.errorUpdatedAt,
			getContent: error => getEnrollmentProjectsErrorToastContent(t, error),
			isError: projectDetailQuery.isError,
		},
		{
			key: `enrollment-student-${enrollmentId}`,
			error: formerStudentDetailQuery.error,
			errorUpdatedAt: formerStudentDetailQuery.errorUpdatedAt,
			getContent: error => getEnrollmentStudentsErrorToastContent(t, error),
			isError: formerStudentDetailQuery.isError,
		},
	]);

	if (!enrollmentIdentifier) {
		return (
			<EntityPageShell
				title={t("project.enrollmentPage.dialog.titleFallback")}
				description={t("project.enrollmentPage.description")}
			>
				<NotFoundState
					title={t("project.enrollmentPage.dialog.notFound.title")}
				/>
			</EntityPageShell>
		);
	}

	const enrollment = enrollmentDetailQuery.data;
	const formerStudent = formerStudentDetailQuery.data ?? null;
	const project = projectDetailQuery.data ?? null;
	const title =
		userDetailQuery.data?.name ??
		accountDetailQuery.data?.email ??
		formerStudent?.academicRegistration ??
		project?.name ??
		t("project.enrollmentPage.dialog.titleFallback");

	return (
		<EntityPageShell
			title={title}
			description={t("project.enrollmentPage.description")}
		>
			{enrollmentDetailQuery.isError ? (
				enrollmentDetailQuery.error instanceof WebApiError &&
				enrollmentDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("project.enrollmentPage.dialog.notFound.title")}
						description={t(
							"project.enrollmentPage.dialog.notFound.description",
						)}
					/>
				) : (
					<SomeErrorState
						title={t("project.enrollmentPage.dialog.error.title")}
						description={t("project.enrollmentPage.dialog.error.description")}
						onRefresh={() => {
							void enrollmentDetailQuery.refetch();
						}}
					/>
				)
			) : enrollment ? (
				<div className="grid gap-6">
					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("project.enrollmentPage.dialog.overhead")}
						</p>
						<EnrollmentOwnDetailsContent
							enrollment={enrollment}
							columns={3}
						/>
					</div>

					{formerStudent ? (
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("project.enrollmentPage.dialog.linkedStudent.overhead")}
							</p>
							<FormerStudentOwnDetailsContent
								formerStudent={formerStudent}
								columns={3}
							/>
						</div>
					) : null}

					{formerStudent ? (
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("partner.staffPage.dialog.linkedAccount.overhead")}
							</p>
							<AccountDetailsContent
								accountId={formerStudent.accountId}
								includeLinkedUser={false}
							/>
						</div>
					) : null}

					{accountDetailQuery.data ? (
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("partner.staffPage.dialog.linkedUser.overhead")}
							</p>
							<UserDetailsContent
								userId={accountDetailQuery.data.userId}
								columns={3}
							/>
						</div>
					) : null}

					{project ? (
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("project.enrollmentPage.dialog.linkedProject.overhead")}
							</p>
							<ProjectOwnDetailsContent
								project={project}
								createdByLabel={project.projectInfo.createdBy.name}
							/>
						</div>
					) : null}
				</div>
			) : (
				<NotFoundState
					title={t("project.enrollmentPage.dialog.notFound.title")}
				/>
			)}
		</EntityPageShell>
	);
}
