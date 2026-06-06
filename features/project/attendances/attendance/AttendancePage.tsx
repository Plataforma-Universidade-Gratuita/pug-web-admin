"use client";

import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { WebApiError } from "@/api/web";
import { NotFoundState, SomeErrorState } from "@/components";
import { EntityPageShell } from "@/components";
import { FormerStudentOwnDetailsContent } from "@/features/academic/former-students/former-student/FormerStudentOwnDetailsContent";
import { AccountDetailsContent } from "@/features/identity/accounts/account/AccountDetailsContent";
import { AttendanceOwnDetailsContent } from "@/features/project/attendances/attendance/AttendanceOwnDetailsContent";
import {
	getAttendanceDetailErrorToastContent,
	getAttendanceProjectsErrorToastContent,
	getAttendanceStudentsErrorToastContent,
} from "@/features/project/attendances/utils";
import { ProjectOwnDetailsContent } from "@/features/project/projects/project/ProjectOwnDetailsContent";
import { useQueryErrorToasts } from "@/hooks";
import type { AttendancePageProps } from "@/types";

const { formerStudents: formerStudentsApi } = web.academic;
const { attendances: attendancesApi, projects: projectsApi } = web.project;
const { useFormerStudentDetailQuery } = formerStudentsApi;
const { useAttendanceDetailQuery } = attendancesApi;
const { useProjectDetailQuery } = projectsApi;

export function AttendancePage({ attendanceId }: AttendancePageProps) {
	const { t } = useTranslation();
	const attendanceDetailQuery = useAttendanceDetailQuery(attendanceId);
	const formerStudentDetailQuery = useFormerStudentDetailQuery(
		attendanceDetailQuery.data?.formerStudentId ?? null,
	);
	const projectDetailQuery = useProjectDetailQuery(
		attendanceDetailQuery.data?.projectId ?? null,
	);

	useQueryErrorToasts([
		{
			key: `attendance-detail-${attendanceId}`,
			error: attendanceDetailQuery.error,
			errorUpdatedAt: attendanceDetailQuery.errorUpdatedAt,
			getContent: error => getAttendanceDetailErrorToastContent(t, error),
			isError: attendanceDetailQuery.isError,
		},
		{
			key: `attendance-project-${attendanceId}`,
			error: projectDetailQuery.error,
			errorUpdatedAt: projectDetailQuery.errorUpdatedAt,
			getContent: error => getAttendanceProjectsErrorToastContent(t, error),
			isError: projectDetailQuery.isError,
		},
		{
			key: `attendance-student-${attendanceId}`,
			error: formerStudentDetailQuery.error,
			errorUpdatedAt: formerStudentDetailQuery.errorUpdatedAt,
			getContent: error => getAttendanceStudentsErrorToastContent(t, error),
			isError: formerStudentDetailQuery.isError,
		},
	]);

	const attendance = attendanceDetailQuery.data;
	const formerStudent = formerStudentDetailQuery.data ?? null;
	const project = projectDetailQuery.data ?? null;
	const title =
		project?.name ??
		formerStudent?.academicRegistration ??
		attendance?.id ??
		t("project.attendancePage.dialog.titleFallback");

	return (
		<EntityPageShell
			title={title}
			description={t("project.attendancePage.description")}
		>
			{attendanceDetailQuery.isError ? (
				attendanceDetailQuery.error instanceof WebApiError &&
				attendanceDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("project.attendancePage.dialog.notFound.title")}
						description={t(
							"project.attendancePage.dialog.notFound.description",
						)}
					/>
				) : (
					<SomeErrorState
						title={t("project.attendancePage.dialog.error.title")}
						description={t("project.attendancePage.dialog.error.description")}
						onRefresh={() => {
							void attendanceDetailQuery.refetch();
						}}
					/>
				)
			) : attendance ? (
				<div className="grid gap-6">
					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("project.attendancePage.dialog.overhead")}
						</p>
						<AttendanceOwnDetailsContent
							attendance={attendance}
							columns={3}
						/>
					</div>

					{formerStudent ? (
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("project.attendancePage.dialog.linkedStudent.overhead")}
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

					{project ? (
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("project.attendancePage.dialog.linkedProject.overhead")}
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
					title={t("project.attendancePage.dialog.notFound.title")}
				/>
			)}
		</EntityPageShell>
	);
}
