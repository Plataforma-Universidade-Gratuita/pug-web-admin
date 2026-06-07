"use client";

import { useTranslation } from "react-i18next";

/*
 * Exception: these overview pages import the module-page components directly to
 * keep the client/server boundary explicit during Next.js build collection.
 */
import { ModulePageComingSoon } from "@/components/composite/features/module-pages/ModulePageComingSoon";
import { ModulePageShell } from "@/components/composite/features/module-pages/ModulePageShell";

export function AcademicOverviewPage() {
	const { t } = useTranslation();
	const moduleName = t("academic.modulePage.title").toLocaleLowerCase();

	return (
		<ModulePageShell
			title={t("academic.modulePage.title")}
			description={t("academic.modulePage.description")}
		>
			<ModulePageComingSoon
				moduleName={moduleName}
				paths={[
					{
						href: "/academic/areas-of-expertise",
						label: t("academic.areaOfExpertisePage.title"),
						description: t("academic.areaOfExpertisePage.description"),
					},
					{
						href: "/academic/courses",
						label: t("academic.coursePage.title"),
						description: t("academic.coursePage.description"),
					},
					{
						href: "/academic/former-students",
						label: t("academic.formerStudentPage.title"),
						description: t("academic.formerStudentPage.description"),
					},
				]}
			/>
		</ModulePageShell>
	);
}
