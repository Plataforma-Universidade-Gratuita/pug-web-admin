"use client";

import { useTranslation } from "react-i18next";

import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
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
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={`<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">${t("docs.structurePrimitives.tabs.items.overview.label")}</TabsTrigger>\n  </TabsList>\n</Tabs>`}
		>
			<ParticleSection
				title={t("docs.structurePrimitives.sections.tabs.title")}
				description={t("docs.structurePrimitives.sections.tabs.description")}
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
		</ParticleContainer>
	);
}
