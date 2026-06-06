"use client";

import {
	ArrowRight,
	ClipboardCheck,
	ClipboardList,
	FolderKanban,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components";
import { getProgressWidth } from "@/features/home/utils";
import type {
	HomePriorityItem,
	HomePulseMetric,
	HomeRecentItem,
} from "@/types";

export function HomeDashboardPrimarySections({
	isOperationalLoading,
	hasOperationalError,
	priorityItems,
	pulseMetrics,
	recentItems,
	onNavigate,
}: {
	isOperationalLoading: boolean;
	hasOperationalError: boolean;
	priorityItems: HomePriorityItem[];
	pulseMetrics: HomePulseMetric[];
	recentItems: HomeRecentItem[];
	onNavigate: (href: string) => void;
}) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-5">
			<Card isLoading={isOperationalLoading}>
				<CardHeader
					icon={ClipboardList}
					className="mb-4 px-5 pt-5 pb-0"
				>
					<CardTitle>{t("home.dashboard.sections.priority.title")}</CardTitle>
					<CardDescription>
						{t("home.dashboard.sections.priority.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3 px-5 pt-0 pb-5">
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
							{t("home.dashboard.sections.priority.empty")}
						</p>
					)}
				</CardContent>
			</Card>

			<Card isLoading={isOperationalLoading}>
				<CardHeader
					icon={ClipboardCheck}
					className="mb-4 px-5 pt-5 pb-0"
				>
					<CardTitle>{t("home.dashboard.sections.pulse.title")}</CardTitle>
					<CardDescription>
						{t("home.dashboard.sections.pulse.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 px-5 pt-0 pb-5 md:grid-cols-2">
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
					className="mb-4 px-5 pt-5 pb-0"
				>
					<CardTitle>{t("home.dashboard.sections.recent.title")}</CardTitle>
					<CardDescription>
						{t("home.dashboard.sections.recent.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="px-5 pt-0 pb-5">
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
											{t("home.dashboard.sections.recent.columns.module")}
										</th>
										<th className="px-4 py-3 text-left font-medium text-[color:var(--twc-text-3)]">
											{t("home.dashboard.sections.recent.columns.record")}
										</th>
										<th className="px-4 py-3 text-left font-medium text-[color:var(--twc-text-3)]">
											{t("home.dashboard.sections.recent.columns.action")}
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
	);
}
