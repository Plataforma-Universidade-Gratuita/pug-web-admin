"use client";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Switch,
} from "@/components";

import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function SwitchParticle() {
	const { t } = useTranslation();
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.selectionControls.cards.switch.title")}
			description={t("docs.selectionControls.cards.switch.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.selectionControls.patternNotes.items.switch") },
				{ description: t("docs.selectionControls.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={`<Switch label="${t("docs.selectionControls.cards.switch.item.label")}" />`}
		>
			<ParticleSection
				title={t("docs.selectionControls.sections.comparison.title")}
				description={t("docs.selectionControls.cards.switch.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.selectionControls.cards.switch.title")}</CardTitle>
						<CardDescription>
							{t("docs.selectionControls.cards.switch.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Switch
							checked={notificationsEnabled}
							onCheckedChange={setNotificationsEnabled}
							label={t("docs.selectionControls.cards.switch.item.label")}
							description={t("docs.selectionControls.cards.switch.item.description")}
						/>
						<Switch
							disabled
							checked={false}
							label={t("docs.selectionControls.cards.switch.disabled.label")}
							description={t("docs.selectionControls.cards.switch.disabled.description")}
						/>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
