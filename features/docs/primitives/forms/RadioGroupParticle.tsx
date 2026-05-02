"use client";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	RadioGroup,
	RadioGroupItem,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function RadioGroupParticle() {
	const { t } = useTranslation();
	const [contactMode, setContactMode] = useState("email");

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.selectionControls.cards.radio.title")}
			description={t("docs.selectionControls.cards.radio.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.selectionControls.patternNotes.items.radio") },
				{
					description: t(
						"docs.selectionControls.patternNotes.items.descriptions",
					),
				},
				{ description: t("docs.selectionControls.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={`<RadioGroup value={value} onValueChange={setValue}>\n  <RadioGroupItem value="email" label="${t("docs.selectionControls.cards.radio.items.email.label")}" />\n</RadioGroup>`}
		>
			<ParticleSection
				title={t("docs.selectionControls.sections.comparison.title")}
				description={t("docs.selectionControls.cards.radio.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>
							{t("docs.selectionControls.cards.radio.title")}
						</CardTitle>
						<CardDescription>
							{t("docs.selectionControls.cards.radio.description")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<RadioGroup
							value={contactMode}
							onValueChange={setContactMode}
						>
							{(["email", "sms", "silent"] as const).map(key => (
								<RadioGroupItem
									key={key}
									value={key}
									disabled={key === "silent"}
									label={t(
										`docs.selectionControls.cards.radio.items.${key}.label`,
									)}
									description={t(
										`docs.selectionControls.cards.radio.items.${key}.description`,
									)}
								/>
							))}
						</RadioGroup>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
