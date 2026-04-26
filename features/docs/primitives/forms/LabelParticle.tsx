"use client";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Label,
} from "@/components";

import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function LabelParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.structurePrimitives.primitives.labelTitle")}
			description={t("docs.structurePrimitives.patternNotes.items.label")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.structurePrimitives.patternNotes.items.label") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={`<Label htmlFor="workspace-name">${t("docs.structurePrimitives.labelCard.nameLabel")}</Label>`}
		>
			<ParticleSection
				title={t("docs.structurePrimitives.labelCard.title")}
				description={t("docs.structurePrimitives.labelCard.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.structurePrimitives.labelCard.title")}</CardTitle>
						<CardDescription>
							{t("docs.structurePrimitives.labelCard.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Label htmlFor="docs-label-workspace-name">
							{t("docs.structurePrimitives.labelCard.nameLabel")}
						</Label>
						<Input
							id="docs-label-workspace-name"
							placeholder={t("docs.structurePrimitives.labelCard.namePlaceholder")}
						/>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
