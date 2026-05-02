"use client";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Separator,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function SeparatorParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.structurePrimitives.primitives.separatorTitle")}
			description={t("docs.structurePrimitives.patternNotes.items.separator")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{
					description: t(
						"docs.structurePrimitives.patternNotes.items.separator",
					),
				},
				{
					description: t(
						"docs.structurePrimitives.patternNotes.items.separatorRhythm",
					),
				},
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet="<Separator />"
		>
			<ParticleSection
				title={t("docs.structurePrimitives.sections.structure.title")}
				description={t("docs.structurePrimitives.labelCard.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>
							{t("docs.structurePrimitives.labelCard.title")}
						</CardTitle>
						<CardDescription>
							{t("docs.structurePrimitives.labelCard.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<p className="ty-sm-semibold">
								{t("docs.structurePrimitives.labelCard.nameLabel")}
							</p>
							<Separator />
							<div className="flex items-center gap-3">
								<span className="ty-helper">
									{t("docs.structurePrimitives.labelCard.leftMeta")}
								</span>
								<Separator
									orientation="vertical"
									className="h-4"
								/>
								<span className="ty-helper">
									{t("docs.structurePrimitives.labelCard.rightMeta")}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
