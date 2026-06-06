"use client";

import { useTranslation } from "react-i18next";

import { ModulePageComingSoon, ModulePageShell } from "@/components";

export function AcademicOverviewPage() {
	const { t } = useTranslation();

	return (
		<ModulePageShell
			title={t("academic.modulePage.title")}
			description={t("academic.modulePage.description")}
		>
			<ModulePageComingSoon
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
