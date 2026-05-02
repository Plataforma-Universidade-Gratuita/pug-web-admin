"use client";

import { Bold } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	Toggle,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function ToggleParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.toggleControls.cards.single.title")}
			description={t("docs.toggleControls.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.toggleControls.patternNotes.items.toggle") },
				{
					description: t(
						"docs.toggleControls.patternNotes.items.defaultSurface",
					),
				},
				{ description: t("docs.toggleControls.patternNotes.items.press") },
				{ description: t("docs.toggleControls.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.toggleControls.patternNotes.singleSnippet")}
		>
			<ParticleSection
				title={t("docs.toggleControls.sections.default.title")}
				description={t("docs.toggleControls.sections.default.description")}
				defaultExpanded
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.toggleControls.cards.single.title")}</CardTitle>
						<CardDescription>
							{t("docs.toggleControls.cards.single.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-wrap items-center gap-3">
							<Toggle
								aria-label={t("docs.toggleControls.cards.single.ariaLabel")}
							>
								<Icon
									icon={Bold}
									className="h-4 w-4"
								/>
								<span>{t("docs.toggleControls.cards.single.label")}</span>
							</Toggle>
							<Toggle disabled>
								{t("docs.toggleControls.cards.single.disabledLabel")}
							</Toggle>
						</div>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
