"use client";

import { useTranslation } from "react-i18next";

import {
	Badge,
	Button,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";

export function HomeDashboardHero({
	priorityCount,
	pendingEnrollmentsCount,
	waitingAttendancesCount,
	activeProjectsCount,
	activeFormerStudentsCount,
	onNavigate,
}: {
	priorityCount: number;
	pendingEnrollmentsCount: number;
	waitingAttendancesCount: number;
	activeProjectsCount: number;
	activeFormerStudentsCount: number;
	onNavigate: (href: string) => void;
}) {
	const { t } = useTranslation();

	return (
		<>
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
						onClick={() => onNavigate("/project/attendances")}
					>
						{t("home.dashboard.hero.actions.attendances")}
					</Button>
					<Button
						variant="secondary"
						usage="secondary"
						onClick={() => onNavigate("/project/enrollments")}
					>
						{t("home.dashboard.hero.actions.enrollments")}
					</Button>
				</div>
			</SectionHeader>

			<div className="surface-2 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4 lg:p-5">
				<div className="flex flex-col gap-2">
					<p className="ty-sm-bold">
						{t("home.dashboard.hero.title", { count: priorityCount })}
					</p>
					<p className="ty-helper">{t("home.dashboard.hero.description")}</p>
				</div>

				<div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4">
						<p className="field-label">
							{t("home.dashboard.metrics.pendingEnrollments")}
						</p>
						<p className="mt-3 text-3xl font-semibold">
							{pendingEnrollmentsCount}
						</p>
					</div>
					<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4">
						<p className="field-label">
							{t("home.dashboard.metrics.waitingAttendances")}
						</p>
						<p className="mt-3 text-3xl font-semibold">
							{waitingAttendancesCount}
						</p>
					</div>
					<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4">
						<p className="field-label">
							{t("home.dashboard.metrics.activeProjects")}
						</p>
						<p className="mt-3 text-3xl font-semibold">{activeProjectsCount}</p>
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
		</>
	);
}
