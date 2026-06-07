"use client";

import { useMemo } from "react";

import { useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { PageShell, Section, SectionContent } from "@/components/primitives";
import { buildFormerStudentDirectoryItems } from "@/features/academic/former-students/utils";
import { HomeDashboardHero } from "@/features/home/components/HomeDashboardHero";
import { HomeDashboardPrimarySections } from "@/features/home/components/HomeDashboardPrimarySections";
import { HomeDashboardSidebarSections } from "@/features/home/components/HomeDashboardSidebarSections";
import { mapAttendancesToDirectoryItems } from "@/features/project/attendances/utils";
import { mapEnrollmentsToDirectoryItems } from "@/features/project/enrollments/utils";
import type {
	HomePriorityItem,
	HomePulseMetric,
	HomeRecentItem,
	HomeUpcomingItem,
} from "@/types/client";

import {
	formatPercent,
	getEnrollmentHref,
	getProjectCompletionPercent,
	getTimestamp,
	isActiveProject,
	isProjectNearCompletion,
} from "./utils";

const { courses: coursesApi, formerStudents: formerStudentsApi } = web.academic;
const { accounts: accountsApi, users: usersApi } = web.identity;
const {
	attendances: attendancesApi,
	enrollments: enrollmentsApi,
	projects: projectsApi,
} = web.project;
const { useCoursesQuery } = coursesApi;
const { useFormerStudentsQuery } = formerStudentsApi;
const { useAccountsQuery } = accountsApi;
const { useUsersQuery } = usersApi;
const { useAttendancesQuery } = attendancesApi;
const { useEnrollmentsQuery } = enrollmentsApi;
const { useProjectsQuery } = projectsApi;

export function HomeCommandCenterPage() {
	const { t } = useTranslation();
	const router = useRouter();

	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const coursesQuery = useCoursesQuery();
	const formerStudentsQuery = useFormerStudentsQuery();
	const projectsQuery = useProjectsQuery();
	const enrollmentsQuery = useEnrollmentsQuery();
	const attendancesQuery = useAttendancesQuery();

	const accounts = useMemo(
		() => accountsQuery.data ?? [],
		[accountsQuery.data],
	);
	const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
	const courses = useMemo(() => coursesQuery.data ?? [], [coursesQuery.data]);
	const formerStudents = useMemo(
		() => formerStudentsQuery.data ?? [],
		[formerStudentsQuery.data],
	);
	const projects = useMemo(
		() => projectsQuery.data ?? [],
		[projectsQuery.data],
	);
	const enrollments = useMemo(
		() => enrollmentsQuery.data ?? [],
		[enrollmentsQuery.data],
	);
	const attendances = useMemo(
		() => attendancesQuery.data ?? [],
		[attendancesQuery.data],
	);

	const isOperationalLoading =
		accountsQuery.isLoading ||
		usersQuery.isLoading ||
		coursesQuery.isLoading ||
		formerStudentsQuery.isLoading ||
		projectsQuery.isLoading ||
		enrollmentsQuery.isLoading ||
		attendancesQuery.isLoading;

	const hasOperationalError =
		accountsQuery.isError ||
		usersQuery.isError ||
		coursesQuery.isError ||
		formerStudentsQuery.isError ||
		projectsQuery.isError ||
		enrollmentsQuery.isError ||
		attendancesQuery.isError;

	const accountById = useMemo(
		() => new Map(accounts.map(account => [account.id, account])),
		[accounts],
	);
	const userById = useMemo(
		() => new Map(users.map(user => [user.id, user])),
		[users],
	);
	const projectById = useMemo(
		() => new Map(projects.map(project => [project.id, project])),
		[projects],
	);
	const formerStudentByAccountId = useMemo(
		() =>
			new Map(
				formerStudents.map(formerStudent => [
					formerStudent.accountId,
					formerStudent,
				]),
			),
		[formerStudents],
	);

	const formerStudentItems = useMemo(
		() =>
			buildFormerStudentDirectoryItems(
				formerStudents,
				accounts,
				users,
				courses,
			),
		[accounts, courses, formerStudents, users],
	);

	const attendanceItems = useMemo(
		() =>
			mapAttendancesToDirectoryItems(
				attendances,
				projectById,
				formerStudentByAccountId,
				accountById,
				userById,
			),
		[accountById, attendances, formerStudentByAccountId, projectById, userById],
	);

	const enrollmentItems = useMemo(
		() =>
			mapEnrollmentsToDirectoryItems(
				enrollments,
				projectById,
				formerStudentByAccountId,
				accountById,
				userById,
			),
		[accountById, enrollments, formerStudentByAccountId, projectById, userById],
	);

	const activeProjects = useMemo(
		() => projects.filter(isActiveProject),
		[projects],
	);

	const activeFormerStudentsCount = useMemo(
		() =>
			formerStudentItems.filter(item => item.account?.active ?? false).length,
		[formerStudentItems],
	);

	const pendingEnrollments = useMemo(
		() =>
			enrollmentItems
				.filter(item => item.status.status === "PENDING")
				.sort(
					(left, right) =>
						getTimestamp(right.enrollmentInfo.auditInfo.updatedAt) -
						getTimestamp(left.enrollmentInfo.auditInfo.updatedAt),
				),
		[enrollmentItems],
	);

	const waitingAttendances = useMemo(
		() =>
			attendanceItems
				.filter(item => item.status.status === "WAITING")
				.sort(
					(left, right) =>
						getTimestamp(right.attendanceInfo.auditInfo.updatedAt) -
						getTimestamp(left.attendanceInfo.auditInfo.updatedAt),
				),
		[attendanceItems],
	);

	const dueSoonFormerStudents = useMemo(
		() =>
			formerStudentItems
				.filter(
					item =>
						!item.counterpartHours.concluded && item.period.remainingDays <= 7,
				)
				.sort(
					(left, right) =>
						left.period.remainingDays - right.period.remainingDays,
				),
		[formerStudentItems],
	);

	const nearCompletionProjects = useMemo(
		() =>
			activeProjects
				.filter(isProjectNearCompletion)
				.sort(
					(left, right) =>
						getProjectCompletionPercent(right) -
						getProjectCompletionPercent(left),
				),
		[activeProjects],
	);

	const priorityItems = useMemo<HomePriorityItem[]>(() => {
		const enrollmentQueue = pendingEnrollments.slice(0, 3).map(item => ({
			id: `enrollment-${item.project.id}-${item.student.account.id}`,
			href: getEnrollmentHref(item),
			badge: t("home.dashboard.priority.badges.pendingEnrollment"),
			tone: "warning" as const,
			title: item.student.account.name,
			description: t("home.dashboard.priority.descriptions.enrollment", {
				project: item.project.name,
			}),
		}));

		const attendanceQueue = waitingAttendances.slice(0, 3).map(item => ({
			id: `attendance-${item.id}`,
			href: `/project/attendances/${item.id}`,
			badge: t("home.dashboard.priority.badges.waitingAttendance"),
			tone: "warning" as const,
			title: item.student.account.name,
			description: t("home.dashboard.priority.descriptions.attendance", {
				project: item.project.name,
			}),
		}));

		const formerStudentQueue = dueSoonFormerStudents.slice(0, 2).map(item => ({
			id: `former-student-${item.accountId}`,
			href: `/academic/former-students/${item.accountId}`,
			badge: t("home.dashboard.priority.badges.dueSoonFormerStudent"),
			tone:
				item.period.remainingDays <= 0
					? ("danger" as const)
					: ("warning" as const),
			title: item.user?.name ?? item.academicRegistration,
			description: t("home.dashboard.priority.descriptions.formerStudent", {
				course: item.course?.name ?? t("home.dashboard.values.unknownCourse"),
				days: item.period.remainingDaysFormatted,
			}),
		}));

		const projectQueue = nearCompletionProjects.slice(0, 2).map(project => ({
			id: `project-${project.id}`,
			href: `/project/projects/${project.id}`,
			badge: t("home.dashboard.priority.badges.nearLimitProject"),
			tone: "info" as const,
			title: project.name,
			description: t("home.dashboard.priority.descriptions.project", {
				entity: project.entity.name,
				progress: formatPercent(getProjectCompletionPercent(project)),
			}),
		}));

		return [
			...enrollmentQueue,
			...attendanceQueue,
			...formerStudentQueue,
			...projectQueue,
		].slice(0, 8);
	}, [
		dueSoonFormerStudents,
		nearCompletionProjects,
		pendingEnrollments,
		t,
		waitingAttendances,
	]);

	const priorityCount = useMemo(
		() =>
			pendingEnrollments.length +
			waitingAttendances.length +
			dueSoonFormerStudents.length +
			nearCompletionProjects.length,
		[
			dueSoonFormerStudents.length,
			nearCompletionProjects.length,
			pendingEnrollments.length,
			waitingAttendances.length,
		],
	);

	const pulseMetrics = useMemo<HomePulseMetric[]>(() => {
		const totalAttendances = attendanceItems.length;
		const validatedAttendances = attendanceItems.filter(
			item => item.status.status !== "WAITING",
		).length;
		const validationCoverage =
			totalAttendances > 0
				? (validatedAttendances / totalAttendances) * 100
				: 0;

		const completionCandidates = activeProjects.filter(
			project => (project.projectInfo.offeredHours ?? 0) > 0,
		);
		const totalProjectProgress = completionCandidates.reduce(
			(total, project) => total + getProjectCompletionPercent(project),
			0,
		);
		const projectProgress =
			completionCandidates.length > 0
				? totalProjectProgress / completionCandidates.length
				: 0;

		const concludedStudents = formerStudentItems.filter(
			item => item.counterpartHours.concluded,
		).length;
		const concludedRate =
			formerStudentItems.length > 0
				? (concludedStudents / formerStudentItems.length) * 100
				: 0;

		const processedEnrollments = enrollmentItems.filter(
			item => item.status.status !== "PENDING",
		).length;
		const processedRate =
			enrollmentItems.length > 0
				? (processedEnrollments / enrollmentItems.length) * 100
				: 0;

		return [
			{
				key: "validationCoverage",
				label: t("home.dashboard.pulse.validationCoverage"),
				value: formatPercent(validationCoverage),
				width: validationCoverage,
			},
			{
				key: "projectProgress",
				label: t("home.dashboard.pulse.projectProgress"),
				value: formatPercent(projectProgress),
				width: projectProgress,
			},
			{
				key: "concludedStudents",
				label: t("home.dashboard.pulse.concludedStudents"),
				value: formatPercent(concludedRate),
				width: concludedRate,
			},
			{
				key: "processedEnrollments",
				label: t("home.dashboard.pulse.processedEnrollments"),
				value: formatPercent(processedRate),
				width: processedRate,
			},
		];
	}, [activeProjects, attendanceItems, enrollmentItems, formerStudentItems, t]);

	const recentItems = useMemo<HomeRecentItem[]>(() => {
		const recentProjects = projects.map(project => ({
			id: `project-${project.id}`,
			module: t("Navbar.paths.project.project"),
			record: project.name,
			action: project.status.statusFormatted,
			when: project.projectInfo.auditInfo.updatedAtFormatted,
			whenTimestamp: getTimestamp(project.projectInfo.auditInfo.updatedAt),
		}));

		const recentEnrollments = enrollmentItems.map(item => ({
			id: `enrollment-${item.project.id}-${item.student.account.id}`,
			module: t("Navbar.paths.project.enrollment"),
			record: `${item.student.account.name} - ${item.project.name}`,
			action: item.status.statusFormatted,
			when: item.enrollmentInfo.auditInfo.updatedAtFormatted,
			whenTimestamp: getTimestamp(item.enrollmentInfo.auditInfo.updatedAt),
		}));

		const recentAttendances = attendanceItems.map(item => ({
			id: `attendance-${item.id}`,
			module: t("Navbar.paths.project.attendance"),
			record: `${item.student.account.name} - ${item.project.name}`,
			action: item.status.statusFormatted,
			when: item.attendanceInfo.auditInfo.updatedAtFormatted,
			whenTimestamp: getTimestamp(item.attendanceInfo.auditInfo.updatedAt),
		}));

		const recentFormerStudents = formerStudentItems.map(item => ({
			id: `former-student-${item.accountId}`,
			module: t("Navbar.paths.academic.student"),
			record: item.user?.name ?? item.academicRegistration,
			action: t("home.dashboard.recent.updated"),
			when: item.auditInfo.updatedAtFormatted,
			whenTimestamp: getTimestamp(item.auditInfo.updatedAt),
		}));

		return [
			...recentProjects,
			...recentEnrollments,
			...recentAttendances,
			...recentFormerStudents,
		]
			.sort((left, right) => right.whenTimestamp - left.whenTimestamp)
			.slice(0, 8);
	}, [attendanceItems, enrollmentItems, formerStudentItems, projects, t]);

	const upcomingItems = useMemo<HomeUpcomingItem[]>(() => {
		const formerStudentDeadlines = dueSoonFormerStudents
			.slice(0, 3)
			.map(item => ({
				id: `upcoming-student-${item.accountId}`,
				href: `/academic/former-students/${item.accountId}`,
				badge: t("Navbar.paths.academic.student"),
				tone:
					item.period.remainingDays <= 0
						? ("danger" as const)
						: ("warning" as const),
				title: item.user?.name ?? item.academicRegistration,
				description: t("home.dashboard.upcoming.formerStudentDescription", {
					course: item.course?.name ?? t("home.dashboard.values.unknownCourse"),
					days: item.period.remainingDaysFormatted,
				}),
			}));

		const projectDeadlines = nearCompletionProjects
			.slice(0, 2)
			.map(project => ({
				id: `upcoming-project-${project.id}`,
				href: `/project/projects/${project.id}`,
				badge: t("Navbar.paths.project.project"),
				tone: "info" as const,
				title: project.name,
				description: t("home.dashboard.upcoming.projectDescription", {
					progress: formatPercent(getProjectCompletionPercent(project)),
					entity: project.entity.name,
				}),
			}));

		return [...formerStudentDeadlines, ...projectDeadlines];
	}, [dueSoonFormerStudents, nearCompletionProjects, t]);

	return (
		<PageShell
			width="wide"
			className="space-y-5 p-5 lg:p-6"
		>
			<Section>
				<SectionContent className="grid gap-5">
					<HomeDashboardHero
						priorityCount={priorityCount}
						pendingEnrollmentsCount={pendingEnrollments.length}
						waitingAttendancesCount={waitingAttendances.length}
						activeProjectsCount={activeProjects.length}
						activeFormerStudentsCount={activeFormerStudentsCount}
						onNavigate={href => router.push(href)}
					/>

					<div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
						<HomeDashboardPrimarySections
							isOperationalLoading={isOperationalLoading}
							hasOperationalError={hasOperationalError}
							priorityItems={priorityItems}
							pulseMetrics={pulseMetrics}
							recentItems={recentItems}
							onNavigate={href => router.push(href)}
						/>

						<HomeDashboardSidebarSections
							isOperationalLoading={isOperationalLoading}
							hasOperationalError={hasOperationalError}
							waitingAttendancesCount={waitingAttendances.length}
							pendingEnrollmentsCount={pendingEnrollments.length}
							dueSoonFormerStudentsCount={dueSoonFormerStudents.length}
							nearCompletionProjectsCount={nearCompletionProjects.length}
							upcomingItems={upcomingItems}
							onNavigate={href => router.push(href)}
						/>
					</div>
				</SectionContent>
			</Section>
		</PageShell>
	);
}
