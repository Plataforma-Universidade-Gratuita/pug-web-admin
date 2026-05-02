"use client";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Label,
	TextArea,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function TextAreaParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.textArea.title")}
			description={t("docs.textArea.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.textArea.patternNotes.items.longform") },
				{ description: t("docs.textArea.patternNotes.items.resize") },
				{ description: t("docs.textArea.patternNotes.items.scope") },
				{ description: t("docs.textArea.patternNotes.items.rhythm") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.textArea.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.textArea.sections.usage.title")}
				description={t("docs.textArea.sections.usage.description")}
			>
				<div className="grid gap-4 lg:grid-cols-3">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.textArea.cards.notes.title")}</CardTitle>
							<CardDescription>
								{t("docs.textArea.cards.notes.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-textarea-notes">
								{t("docs.textArea.cards.notes.label")}
							</Label>
							<TextArea
								id="docs-textarea-notes"
								placeholder={t("docs.textArea.cards.notes.placeholder")}
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.textArea.cards.feedback.title")}</CardTitle>
							<CardDescription>
								{t("docs.textArea.cards.feedback.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-textarea-feedback">
								{t("docs.textArea.cards.feedback.label")}
							</Label>
							<TextArea
								id="docs-textarea-feedback"
								className="min-h-36"
								placeholder={t("docs.textArea.cards.feedback.placeholder")}
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.textArea.cards.disabled.title")}</CardTitle>
							<CardDescription>
								{t("docs.textArea.cards.disabled.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-textarea-disabled">
								{t("docs.textArea.cards.disabled.label")}
							</Label>
							<TextArea
								id="docs-textarea-disabled"
								disabled
								defaultValue={t("docs.textArea.cards.disabled.value")}
							/>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
