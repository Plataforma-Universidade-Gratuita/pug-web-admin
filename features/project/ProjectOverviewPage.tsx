"use client";

import { useTranslation } from "react-i18next";

import {
	ModulePageComingSoon,
	ModulePageShell,
} from "@/features/shared/module-pages";

export function ProjectOverviewPage() {
	const { t } = useTranslation();

	return (
		<ModulePageShell
			title={t("project.modulePage.title")}
			description={t("project.modulePage.description")}
		>
			<ModulePageComingSoon
				paths={[
					{
						href: "/project/project",
						label: t("project.projectPage.title"),
						description: t("project.projectPage.description"),
					},
					{
						href: "/project/enrollment",
						label: t("project.enrollmentPage.title"),
						description: t("project.enrollmentPage.description"),
					},
					{
						href: "/project/attendance",
						label: t("project.attendancePage.title"),
						description: t("project.attendancePage.description"),
					},
				]}
			/>
		</ModulePageShell>
	);
}
