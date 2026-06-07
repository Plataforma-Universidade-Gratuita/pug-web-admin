"use client";

import { useTranslation } from "react-i18next";

/*
 * Exception: these overview pages import the module-page components directly to
 * keep the client/server boundary explicit during Next.js build collection.
 */
import { ModulePageComingSoon } from "@/components/composite/features/module-pages/ModulePageComingSoon";
import { ModulePageShell } from "@/components/composite/features/module-pages/ModulePageShell";

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
						href: "/project/projects",
						label: t("project.projectPage.title"),
						description: t("project.projectPage.description"),
					},
					{
						href: "/project/enrollments",
						label: t("project.enrollmentPage.title"),
						description: t("project.enrollmentPage.description"),
					},
					{
						href: "/project/attendances",
						label: t("project.attendancePage.title"),
						description: t("project.attendancePage.description"),
					},
				]}
			/>
		</ModulePageShell>
	);
}
