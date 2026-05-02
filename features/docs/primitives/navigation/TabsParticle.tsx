"use client";

import { Activity, LayoutGrid, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function TabsParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.structurePrimitives.sections.tabs.title")}
			description={t("docs.structurePrimitives.sections.tabs.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.structurePrimitives.patternNotes.items.tabs") },
				{
					description: t(
						"docs.structurePrimitives.patternNotes.items.iconTabs",
					),
				},
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.structurePrimitives.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.structurePrimitives.sections.tabs.title")}
				description={t("docs.structurePrimitives.sections.tabs.description")}
				defaultExpanded
			>
				<Card className="p-4">
					<Tabs defaultValue="overview">
						<TabsList>
							{(["overview", "members", "history"] as const).map(key => (
								<TabsTrigger
									key={key}
									value={key}
									disabled={key === "history"}
								>
									{t(`docs.structurePrimitives.tabs.items.${key}.label`)}
								</TabsTrigger>
							))}
						</TabsList>

						{(["overview", "members", "history"] as const).map(key => (
							<TabsContent
								key={key}
								value={key}
								className="border-default-2 rounded-[var(--twc-radius-lg)] border p-4"
							>
								<p className="ty-sm-semibold">
									{t(`docs.structurePrimitives.tabs.items.${key}.title`)}
								</p>
								<p className="ty-helper mt-2">
									{t(`docs.structurePrimitives.tabs.items.${key}.description`)}
								</p>
							</TabsContent>
						))}
					</Tabs>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.structurePrimitives.sections.iconTabs.title")}
				description={t(
					"docs.structurePrimitives.sections.iconTabs.description",
				)}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>
							{t("docs.structurePrimitives.iconTabs.title")}
						</CardTitle>
						<CardDescription>
							{t("docs.structurePrimitives.iconTabs.description")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="overview">
							<TabsList variant="icon">
								<TabsTrigger
									value="overview"
									tooltipContent={t(
										"docs.structurePrimitives.tabs.items.overview.label",
									)}
								>
									<Icon
										icon={LayoutGrid}
										className="h-4 w-4"
									/>
								</TabsTrigger>
								<TabsTrigger
									value="members"
									tooltipContent={t(
										"docs.structurePrimitives.tabs.items.members.label",
									)}
								>
									<Icon
										icon={Users}
										className="h-4 w-4"
									/>
								</TabsTrigger>
								<TabsTrigger
									value="history"
									tooltipContent={t(
										"docs.structurePrimitives.tabs.items.history.label",
									)}
								>
									<Icon
										icon={Activity}
										className="h-4 w-4"
									/>
								</TabsTrigger>
							</TabsList>

							{(["overview", "members", "history"] as const).map(key => (
								<TabsContent
									key={key}
									value={key}
									className="border-default-2 mt-4 rounded-[var(--twc-radius-lg)] border p-4"
								>
									<p className="ty-sm-semibold">
										{t(`docs.structurePrimitives.tabs.items.${key}.title`)}
									</p>
									<p className="ty-helper mt-2">
										{t(
											`docs.structurePrimitives.tabs.items.${key}.description`,
										)}
									</p>
								</TabsContent>
							))}
						</Tabs>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
