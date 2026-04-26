"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	DatePicker,
	Label,
} from "components";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "../ParticleContainer";
import { ParticleSection } from "../ParticleSection";

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
				<div className="grid gap-4 lg:grid-cols-3">
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
								defaultValue="2026-04-24T14:30"
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
								min="2026-04-20T09:00"
								max="2026-04-30T18:00"
								defaultValue="2026-04-24T11:00"
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.datePicker.cards.disabled.title")}</CardTitle>
							<CardDescription>
								{t("docs.datePicker.cards.disabled.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-date-disabled">
								{t("docs.datePicker.cards.disabled.label")}
							</Label>
							<DatePicker
								id="docs-date-disabled"
								disabled
								defaultValue="2026-04-24T09:00"
							/>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
