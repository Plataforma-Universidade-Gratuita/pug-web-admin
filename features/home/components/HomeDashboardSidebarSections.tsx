"use client";

import {
	AlertTriangle,
	ArrowRight,
	BriefcaseBusiness,
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
} from "@/components";
import type { HomeUpcomingItem } from "@/types";

export function HomeDashboardSidebarSections({
	isOperationalLoading,
	hasOperationalError,
	waitingAttendancesCount,
	pendingEnrollmentsCount,
	dueSoonFormerStudentsCount,
	nearCompletionProjectsCount,
	upcomingItems,
	onNavigate,
}: {
	isOperationalLoading: boolean;
	hasOperationalError: boolean;
	waitingAttendancesCount: number;
	pendingEnrollmentsCount: number;
	dueSoonFormerStudentsCount: number;
	nearCompletionProjectsCount: number;
	upcomingItems: HomeUpcomingItem[];
	onNavigate: (href: string) => void;
}) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-5">
			<Card>
				<CardHeader
					icon={BriefcaseBusiness}
					className="mb-4 px-5 pt-5 pb-0"
				>
					<CardTitle>{t("home.dashboard.sections.shortcuts.title")}</CardTitle>
					<CardDescription>
						{t("home.dashboard.sections.shortcuts.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3 px-5 pt-0 pb-5">
					<Button
						variant="secondary"
						usage="secondary"
						onClick={() => onNavigate("/project/enrollments")}
					>
						{t("home.dashboard.sections.shortcuts.pendingEnrollments")}
					</Button>
					<Button
						variant="secondary"
						usage="secondary"
						onClick={() => onNavigate("/project/attendances")}
					>
						{t("home.dashboard.sections.shortcuts.waitingAttendances")}
					</Button>
					<Button
						variant="secondary"
						usage="secondary"
						onClick={() => onNavigate("/academic/former-students")}
					>
						{t("home.dashboard.sections.shortcuts.formerStudents")}
					</Button>
					<Button
						variant="secondary"
						usage="secondary"
						onClick={() => onNavigate("/project/projects")}
					>
						{t("home.dashboard.sections.shortcuts.activeProjects")}
					</Button>
				</CardContent>
			</Card>

			<Card isLoading={isOperationalLoading}>
				<CardHeader
					icon={AlertTriangle}
					className="mb-4 px-5 pt-5 pb-0"
				>
					<CardTitle>{t("home.dashboard.sections.exceptions.title")}</CardTitle>
					<CardDescription>
						{t("home.dashboard.sections.exceptions.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3 px-5 pt-0 pb-5">
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
								<Badge tone="warning">{waitingAttendancesCount}</Badge>
							</div>
							<div className="surface-2 flex items-center justify-between rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
								<p className="ty-helper">
									{t("home.dashboard.exceptions.pendingEnrollments")}
								</p>
								<Badge tone="warning">{pendingEnrollmentsCount}</Badge>
							</div>
							<div className="surface-2 flex items-center justify-between rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
								<p className="ty-helper">
									{t("home.dashboard.exceptions.dueSoonFormerStudents")}
								</p>
								<Badge tone="danger">{dueSoonFormerStudentsCount}</Badge>
							</div>
							<div className="surface-2 flex items-center justify-between rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
								<p className="ty-helper">
									{t("home.dashboard.exceptions.nearLimitProjects")}
								</p>
								<Badge tone="info">{nearCompletionProjectsCount}</Badge>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			<Card isLoading={isOperationalLoading}>
				<CardHeader
					icon={Users}
					className="mb-4 px-5 pt-5 pb-0"
				>
					<CardTitle>{t("home.dashboard.sections.upcoming.title")}</CardTitle>
					<CardDescription>
						{t("home.dashboard.sections.upcoming.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3 px-5 pt-0 pb-5">
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
								onClick={() => onNavigate(item.href)}
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
	);
}
