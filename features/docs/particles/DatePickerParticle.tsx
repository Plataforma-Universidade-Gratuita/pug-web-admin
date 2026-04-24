"use client";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	DatePicker,
	Label,
} from "@/components";
import { ParticleContainer } from "@/features/docs/particles/components/ParticleContainer";
import { ParticleSection } from "@/features/docs/particles/components/ParticleSection";

export default function DatePickerParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.datePicker.title")}
			description={t("docs.datePicker.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.datePicker.patternNotes.items.native") },
				{ description: t("docs.datePicker.patternNotes.items.scope") },
				{ description: t("docs.datePicker.patternNotes.items.constraints") },
				{ description: t("docs.datePicker.patternNotes.items.escalation") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.datePicker.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.datePicker.sections.fields.title")}
				description={t("docs.datePicker.sections.fields.description")}
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.datePicker.cards.basic.title")}</CardTitle>
							<CardDescription>
								{t("docs.datePicker.cards.basic.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-date-basic">
								{t("docs.datePicker.cards.basic.label")}
							</Label>
							<DatePicker
								id="docs-date-basic"
								defaultValue="2026-04-24"
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.datePicker.cards.constrained.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.datePicker.cards.constrained.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-date-constrained">
								{t("docs.datePicker.cards.constrained.label")}
							</Label>
							<DatePicker
								id="docs-date-constrained"
								min="2026-04-01"
								max="2026-04-30"
								defaultValue="2026-04-24"
							/>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
