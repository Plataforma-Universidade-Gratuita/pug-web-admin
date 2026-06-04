"use client";

import { useMemo } from "react";

import { useRouter } from "next/navigation";

import {
	AlertTriangle,
	ArrowRight,
	BriefcaseBusiness,
	ClipboardCheck,
	ClipboardList,
	FolderKanban,
	Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	PageShell,
	Section,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";
import { useCoursesQuery } from "@/features/academic/courses/queries";
import { useFormerStudentsQuery } from "@/features/academic/former-students/queries";
import { buildFormerStudentDirectoryItems } from "@/features/academic/former-students/utils";
import { useAccountsQuery } from "@/features/identity/accounts/queries";
import { useUsersQuery } from "@/features/identity/users/queries";
import { useAttendancesQuery } from "@/features/project/attendances/queries";
import { mapAttendancesToDirectoryItems } from "@/features/project/attendances/utils";
import { useEnrollmentsQuery } from "@/features/project/enrollments/queries";
import { mapEnrollmentsToDirectoryItems } from "@/features/project/enrollments/utils";
import { useProjectsQuery } from "@/features/project/projects/queries";
import type {
	BadgeTone,
	EnrollmentDirectoryItem,
	ProjectResponse,
} from "@/types";

interface HomePriorityItem {
	badge: string;
	description: string;
	href: string;
	id: string;
	title: string;
	tone: BadgeTone;
}

interface HomePulseMetric {
	key: string;
	label: string;
	value: string;
	width: number;
}

interface HomeRecentItem {
	action: string;
	id: string;
	module: string;
	record: string;
	when: string;
	whenTimestamp: number;
}

interface HomeUpcomingItem {
	badge: string;
	description: string;
	href: string;
	id: string;
	title: string;
	tone: BadgeTone;
}

function getTimestamp(value: string | null | undefined) {
	if (!value) {
		return 0;
	}

	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

function formatPercent(value: number) {
	return `${value.toFixed(0)}%`;
}

function getProjectCompletionPercent(project: ProjectResponse) {
	const offeredHours = project.projectInfo.offeredHours ?? 0;
	if (offeredHours <= 0) {
		return 0;
	}

	return ((project.projectInfo.completedHours ?? 0) / offeredHours) * 100;
}

function isActiveProject(project: ProjectResponse) {
	return ["PLANNED", "IN_PROGRESS", "ON_HOLD"].includes(project.status.status);
}

function isProjectNearCompletion(project: ProjectResponse) {
	return (
		project.status.status === "IN_PROGRESS" &&
		getProjectCompletionPercent(project) >= 85
	);
}

function getEnrollmentHref(item: EnrollmentDirectoryItem) {
	return `/project/enrollments/${encodeURIComponent(`${item.project.id}::${item.student.account.id}`)}`;
}

function getProgressWidth(value: number) {
	return `${Math.max(0, Math.min(value, 100))}%`;
}

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
				<SectionHeader className="gap-3 xl:flex-row xl:items-end xl:justify-between">
					<div className="space-y-3">
						<Badge tone="warning">{t("home.dashboard.hero.badge")}</Badge>
						<div className="space-y-2">
							<SectionTitle>{t("home.dashboard.title")}</SectionTitle>
							<SectionDescription>
								{t("home.dashboard.description")}
							</SectionDescription>
						</div>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							variant="secondary"
							usage="secondary"
							onClick={() => router.push("/project/attendances")}
						>
							{t("home.dashboard.hero.actions.attendances")}
						</Button>
						<Button
							variant="secondary"
							usage="secondary"
							onClick={() => router.push("/project/enrollments")}
						>
							{t("home.dashboard.hero.actions.enrollments")}
						</Button>
					</div>
				</SectionHeader>

				<SectionContent className="grid gap-5">
					<div className="surface-2 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4 lg:p-5">
						<div className="flex flex-col gap-2">
							<p className="ty-sm-bold">
								{t("home.dashboard.hero.title", { count: priorityCount })}
							</p>
							<p className="ty-helper">
								{t("home.dashboard.hero.description")}
							</p>
						</div>

						<div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
							<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4">
								<p className="field-label">
									{t("home.dashboard.metrics.pendingEnrollments")}
								</p>
								<p className="mt-3 text-3xl font-semibold">
									{pendingEnrollments.length}
								</p>
							</div>
							<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4">
								<p className="field-label">
									{t("home.dashboard.metrics.waitingAttendances")}
								</p>
								<p className="mt-3 text-3xl font-semibold">
									{waitingAttendances.length}
								</p>
							</div>
							<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4">
								<p className="field-label">
									{t("home.dashboard.metrics.activeProjects")}
								</p>
								<p className="mt-3 text-3xl font-semibold">
									{activeProjects.length}
								</p>
							</div>
							<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4">
								<p className="field-label">
									{t("home.dashboard.metrics.activeFormerStudents")}
								</p>
								<p className="mt-3 text-3xl font-semibold">
									{activeFormerStudentsCount}
								</p>
							</div>
						</div>
					</div>

					<div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
						<div className="grid gap-5">
							<Card isLoading={isOperationalLoading}>
								<CardHeader
									icon={ClipboardList}
									className="mb-4 px-5 pb-0 pt-5"
								>
									<CardTitle>
										{t("home.dashboard.sections.priority.title")}
									</CardTitle>
									<CardDescription>
										{t("home.dashboard.sections.priority.description")}
									</CardDescription>
								</CardHeader>
								<CardContent className="grid gap-3 px-5 pb-5 pt-0">
									{hasOperationalError ? (
										<p className="ty-helper">
											{t("home.dashboard.sections.sharedError")}
										</p>
									) : priorityItems.length > 0 ? (
										priorityItems.map(item => (
											<button
												key={item.id}
												type="button"
												className="surface-2 flex w-full items-start justify-between gap-4 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4 text-left transition-colors hover:bg-[color:var(--twc-surface-1)]"
												onClick={() => router.push(item.href)}
											>
												<div className="space-y-2">
													<Badge tone={item.tone}>{item.badge}</Badge>
													<div className="space-y-1">
														<p className="ty-sm-bold">{item.title}</p>
														<p className="ty-helper">{item.description}</p>
													</div>
												</div>
												<ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[color:var(--twc-text-3)]" />
											</button>
										))
									) : (
										<p className="ty-helper">
											{t("home.dashboard.sections.priority.empty")}
										</p>
									)}
								</CardContent>
							</Card>

							<Card isLoading={isOperationalLoading}>
								<CardHeader
									icon={ClipboardCheck}
									className="mb-4 px-5 pb-0 pt-5"
								>
									<CardTitle>
										{t("home.dashboard.sections.pulse.title")}
									</CardTitle>
									<CardDescription>
										{t("home.dashboard.sections.pulse.description")}
									</CardDescription>
								</CardHeader>
								<CardContent className="grid gap-4 px-5 pb-5 pt-0 md:grid-cols-2">
									{hasOperationalError ? (
										<p className="ty-helper">
											{t("home.dashboard.sections.sharedError")}
										</p>
									) : (
										pulseMetrics.map(metric => (
											<div
												key={metric.key}
												className="surface-2 grid gap-3 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4"
											>
												<div className="flex items-center justify-between gap-3">
													<p className="ty-helper">{metric.label}</p>
													<p className="ty-sm-bold">{metric.value}</p>
												</div>
												<div className="h-2 overflow-hidden rounded-full bg-[color:var(--twc-surface-1)]">
													<div
														className="h-full rounded-full bg-[color:var(--color-brand)]"
														style={{ width: getProgressWidth(metric.width) }}
													/>
												</div>
											</div>
										))
									)}
								</CardContent>
							</Card>

							<Card isLoading={isOperationalLoading}>
								<CardHeader
									icon={FolderKanban}
									className="mb-4 px-5 pb-0 pt-5"
								>
									<CardTitle>
										{t("home.dashboard.sections.recent.title")}
									</CardTitle>
									<CardDescription>
										{t("home.dashboard.sections.recent.description")}
									</CardDescription>
								</CardHeader>
								<CardContent className="px-5 pb-5 pt-0">
									{hasOperationalError ? (
										<p className="ty-helper">
											{t("home.dashboard.sections.sharedError")}
										</p>
									) : recentItems.length > 0 ? (
										<div className="overflow-hidden rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)]">
											<table className="w-full border-collapse text-sm">
												<thead className="surface-2">
													<tr>
														<th className="px-4 py-3 text-left font-medium text-[color:var(--twc-text-3)]">
															{t("home.dashboard.sections.recent.columns.when")}
														</th>
														<th className="px-4 py-3 text-left font-medium text-[color:var(--twc-text-3)]">
															{t(
																"home.dashboard.sections.recent.columns.module",
															)}
														</th>
														<th className="px-4 py-3 text-left font-medium text-[color:var(--twc-text-3)]">
															{t(
																"home.dashboard.sections.recent.columns.record",
															)}
														</th>
														<th className="px-4 py-3 text-left font-medium text-[color:var(--twc-text-3)]">
															{t(
																"home.dashboard.sections.recent.columns.action",
															)}
														</th>
													</tr>
												</thead>
												<tbody>
													{recentItems.map(item => (
														<tr
															key={item.id}
															className="border-t border-[color:var(--twc-border-2)]"
														>
															<td className="px-4 py-3 text-[color:var(--twc-text-3)]">
																{item.when}
															</td>
															<td className="px-4 py-3">{item.module}</td>
															<td className="px-4 py-3">{item.record}</td>
															<td className="px-4 py-3 text-[color:var(--twc-text-3)]">
																{item.action}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									) : (
										<p className="ty-helper">
											{t("home.dashboard.sections.recent.empty")}
										</p>
									)}
								</CardContent>
							</Card>
						</div>

						<div className="grid gap-5">
							<Card>
								<CardHeader
									icon={BriefcaseBusiness}
									className="mb-4 px-5 pb-0 pt-5"
								>
									<CardTitle>
										{t("home.dashboard.sections.shortcuts.title")}
									</CardTitle>
									<CardDescription>
										{t("home.dashboard.sections.shortcuts.description")}
									</CardDescription>
								</CardHeader>
								<CardContent className="grid gap-3 px-5 pb-5 pt-0">
									<Button
										variant="secondary"
										usage="secondary"
										onClick={() => router.push("/project/enrollments")}
									>
										{t("home.dashboard.sections.shortcuts.pendingEnrollments")}
									</Button>
									<Button
										variant="secondary"
										usage="secondary"
										onClick={() => router.push("/project/attendances")}
									>
										{t("home.dashboard.sections.shortcuts.waitingAttendances")}
									</Button>
									<Button
										variant="secondary"
										usage="secondary"
										onClick={() => router.push("/academic/former-students")}
									>
										{t("home.dashboard.sections.shortcuts.formerStudents")}
									</Button>
									<Button
										variant="secondary"
										usage="secondary"
										onClick={() => router.push("/project/projects")}
									>
										{t("home.dashboard.sections.shortcuts.activeProjects")}
									</Button>
								</CardContent>
							</Card>

							<Card isLoading={isOperationalLoading}>
								<CardHeader
									icon={AlertTriangle}
									className="mb-4 px-5 pb-0 pt-5"
								>
									<CardTitle>
										{t("home.dashboard.sections.exceptions.title")}
									</CardTitle>
									<CardDescription>
										{t("home.dashboard.sections.exceptions.description")}
									</CardDescription>
								</CardHeader>
								<CardContent className="grid gap-3 px-5 pb-5 pt-0">
									{hasOperationalError ? (
										<p className="ty-helper">
											{t("home.dashboard.sections.sharedError")}
										</p>
									) : (
										<>
											<div className="surface-2 flex items-center justify-between rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
												<p className="ty-helper">
													{t("home.dashboard.exceptions.waitingAttendances")}
												</p>
												<Badge tone="warning">
													{waitingAttendances.length}
												</Badge>
											</div>
											<div className="surface-2 flex items-center justify-between rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
												<p className="ty-helper">
													{t("home.dashboard.exceptions.pendingEnrollments")}
												</p>
												<Badge tone="warning">
													{pendingEnrollments.length}
												</Badge>
											</div>
											<div className="surface-2 flex items-center justify-between rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
												<p className="ty-helper">
													{t("home.dashboard.exceptions.dueSoonFormerStudents")}
												</p>
												<Badge tone="danger">
													{dueSoonFormerStudents.length}
												</Badge>
											</div>
											<div className="surface-2 flex items-center justify-between rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
												<p className="ty-helper">
													{t("home.dashboard.exceptions.nearLimitProjects")}
												</p>
												<Badge tone="info">
													{nearCompletionProjects.length}
												</Badge>
											</div>
										</>
									)}
								</CardContent>
							</Card>

							<Card isLoading={isOperationalLoading}>
								<CardHeader
									icon={Users}
									className="mb-4 px-5 pb-0 pt-5"
								>
									<CardTitle>
										{t("home.dashboard.sections.upcoming.title")}
									</CardTitle>
									<CardDescription>
										{t("home.dashboard.sections.upcoming.description")}
									</CardDescription>
								</CardHeader>
								<CardContent className="grid gap-3 px-5 pb-5 pt-0">
									{hasOperationalError ? (
										<p className="ty-helper">
											{t("home.dashboard.sections.sharedError")}
										</p>
									) : upcomingItems.length > 0 ? (
										upcomingItems.map(item => (
											<button
												key={item.id}
												type="button"
												className="surface-2 flex w-full items-start justify-between gap-4 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4 text-left transition-colors hover:bg-[color:var(--twc-surface-1)]"
												onClick={() => router.push(item.href)}
											>
												<div className="space-y-2">
													<Badge tone={item.tone}>{item.badge}</Badge>
													<div className="space-y-1">
														<p className="ty-sm-bold">{item.title}</p>
														<p className="ty-helper">{item.description}</p>
													</div>
												</div>
												<ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[color:var(--twc-text-3)]" />
											</button>
										))
									) : (
										<p className="ty-helper">
											{t("home.dashboard.sections.upcoming.empty")}
										</p>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</SectionContent>
			</Section>
		</PageShell>
	);
}
