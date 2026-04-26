"use client";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
	RadioGroup,
	RadioGroupItem,
	Switch,
} from "@/components";

import { ParticleContainer } from "../primitives/ParticleContainer";
import { ParticleSection } from "../primitives/ParticleSection";

export default function SelectionControlsParticle() {
	const { t } = useTranslation();
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [contactMode, setContactMode] = useState("email");

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.selectionControls.title")}
			description={t("docs.selectionControls.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{
					description: t("docs.selectionControls.patternNotes.items.checkbox"),
				},
				{ description: t("docs.selectionControls.patternNotes.items.radio") },
				{ description: t("docs.selectionControls.patternNotes.items.switch") },
				{ description: t("docs.selectionControls.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.selectionControls.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.selectionControls.sections.comparison.title")}
				description={t(
					"docs.selectionControls.sections.comparison.description",
				)}
			>
				<div className="grid gap-4 lg:grid-cols-3">
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
								label={t(
									"docs.selectionControls.cards.checkbox.items.one.label",
								)}
								description={t(
									"docs.selectionControls.cards.checkbox.items.one.description",
								)}
							/>
							<Checkbox
								label={t(
									"docs.selectionControls.cards.checkbox.items.two.label",
								)}
								description={t(
									"docs.selectionControls.cards.checkbox.items.two.description",
								)}
							/>
							<Checkbox
								disabled
								label="Locked setting"
								description="This option is unavailable in the current workflow."
							/>
						</CardContent>
					</Card>

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

					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.selectionControls.cards.switch.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.selectionControls.cards.switch.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Switch
								checked={notificationsEnabled}
								onCheckedChange={setNotificationsEnabled}
								label={t("docs.selectionControls.cards.switch.item.label")}
								description={t(
									"docs.selectionControls.cards.switch.item.description",
								)}
							/>
							<Switch
								disabled
								checked={false}
								label="System lock"
								description="This preference is controlled by workspace policy."
							/>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
