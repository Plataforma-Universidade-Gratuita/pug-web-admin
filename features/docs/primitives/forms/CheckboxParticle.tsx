"use client";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function CheckboxParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.selectionControls.cards.checkbox.title")}
			description={t("docs.selectionControls.cards.checkbox.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{
					description: t("docs.selectionControls.patternNotes.items.checkbox"),
				},
				{
					description: t(
						"docs.selectionControls.patternNotes.items.descriptions",
					),
				},
				{ description: t("docs.selectionControls.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={`<Checkbox label="${t("docs.selectionControls.cards.checkbox.items.one.label")}" />`}
		>
			<ParticleSection
				title={t("docs.selectionControls.sections.comparison.title")}
				description={t("docs.selectionControls.cards.checkbox.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>
							{t("docs.selectionControls.cards.checkbox.title")}
						</CardTitle>
						<CardDescription>
							{t("docs.selectionControls.cards.checkbox.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Checkbox
							defaultChecked
							label={t("docs.selectionControls.cards.checkbox.items.one.label")}
							description={t(
								"docs.selectionControls.cards.checkbox.items.one.description",
							)}
						/>
						<Checkbox
							label={t("docs.selectionControls.cards.checkbox.items.two.label")}
							description={t(
								"docs.selectionControls.cards.checkbox.items.two.description",
							)}
						/>
						<Checkbox
							disabled
							label={t("docs.selectionControls.cards.checkbox.disabled.label")}
							description={t(
								"docs.selectionControls.cards.checkbox.disabled.description",
							)}
						/>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
