"use client";

import { useTranslation } from "react-i18next";

import {
	ModulePageComingSoon,
	ModulePageShell,
} from "@/features/shared/module-pages";

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
						href: "/academic/school",
						label: t("academic.schoolPage.title"),
						description: t("academic.schoolPage.description"),
					},
					{
						href: "/academic/course",
						label: t("academic.coursePage.title"),
						description: t("academic.coursePage.description"),
					},
					{
						href: "/academic/student",
						label: t("academic.studentPage.title"),
						description: t("academic.studentPage.description"),
					},
				]}
			/>
		</ModulePageShell>
	);
}
