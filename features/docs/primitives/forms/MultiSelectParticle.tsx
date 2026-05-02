"use client";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Label,
	MultiSelect,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function MultiSelectParticle() {
	const { t } = useTranslation();
	const [statusValues, setStatusValues] = useState<string[]>([
		"active",
		"paused",
	]);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.multiSelect.title")}
			description={t("docs.multiSelect.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.multiSelect.patternNotes.items.scope") },
				{ description: t("docs.multiSelect.patternNotes.items.summary") },
				{ description: t("docs.multiSelect.patternNotes.items.options") },
				{ description: t("docs.multiSelect.patternNotes.items.tone") },
				{ description: t("docs.multiSelect.patternNotes.items.escalation") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.multiSelect.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.multiSelect.sections.filters.title")}
				description={t("docs.multiSelect.sections.filters.description")}
			>
				<div className="grid gap-4 lg:grid-cols-3">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.multiSelect.cards.status.title")}</CardTitle>
							<CardDescription>
								{t("docs.multiSelect.cards.status.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-multi-select-status">
								{t("docs.multiSelect.cards.status.label")}
							</Label>
							<MultiSelect
								id="docs-multi-select-status"
								value={statusValues}
								onValueChange={setStatusValues}
								placeholder={t("docs.multiSelect.cards.status.placeholder")}
								options={(["active", "paused", "archived"] as const).map(
									key => ({
										value: key,
										label: t(`docs.multiSelect.cards.status.options.${key}`),
									}),
								)}
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.multiSelect.cards.owners.title")}</CardTitle>
							<CardDescription>
								{t("docs.multiSelect.cards.owners.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-multi-select-owners">
								{t("docs.multiSelect.cards.owners.label")}
							</Label>
							<MultiSelect
								id="docs-multi-select-owners"
								defaultValue={["maria", "joao"]}
								selectionTone="info"
								placeholder={t("docs.multiSelect.cards.owners.placeholder")}
								options={(["maria", "joao", "ana"] as const).map(key => ({
									value: key,
									label: t(
										`docs.multiSelect.cards.owners.options.${key}.label`,
									),
									description: t(
										`docs.multiSelect.cards.owners.options.${key}.description`,
									),
								}))}
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.multiSelect.cards.disabled.title")}
							</CardTitle>
							<CardDescription>
								Disabled multi-selects should keep their selected context but
								prevent edits.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-multi-select-disabled">
								{t("docs.multiSelect.cards.disabled.label")}
							</Label>
							<MultiSelect
								id="docs-multi-select-disabled"
								disabled
								defaultValue={["active", "archived"]}
								options={(["active", "paused", "archived"] as const).map(
									key => ({
										value: key,
										label: t(`docs.multiSelect.cards.status.options.${key}`),
									}),
								)}
							/>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
