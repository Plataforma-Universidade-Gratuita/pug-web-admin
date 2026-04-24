"use client";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Combobox,
	Label,
} from "@/components";
import { ParticleContainer } from "@/features/docs/particles/components/ParticleContainer";
import { ParticleSection } from "@/features/docs/particles/components/ParticleSection";

export default function ComboboxParticle() {
	const { t } = useTranslation();
	const [ownerValue, setOwnerValue] = useState("maria");

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.combobox.title")}
			description={t("docs.combobox.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.combobox.patternNotes.items.search") },
				{ description: t("docs.combobox.patternNotes.items.single") },
				{ description: t("docs.combobox.patternNotes.items.metadata") },
				{ description: t("docs.combobox.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.combobox.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.combobox.sections.examples.title")}
				description={t("docs.combobox.sections.examples.description")}
			>
				<div className="grid gap-4 lg:grid-cols-3">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.combobox.cards.people.title")}</CardTitle>
							<CardDescription>
								{t("docs.combobox.cards.people.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-combobox-people">
								{t("docs.combobox.cards.people.label")}
							</Label>
							<Combobox
								id="docs-combobox-people"
								value={ownerValue}
								onValueChange={setOwnerValue}
								placeholder={t("docs.combobox.cards.people.placeholder")}
								searchPlaceholder={t(
									"docs.combobox.cards.people.searchPlaceholder",
								)}
								emptyMessage={t("docs.combobox.cards.people.empty")}
								options={(["maria", "joao", "ana"] as const).map(key => ({
									value: key,
									label: t(`docs.combobox.cards.people.options.${key}.label`),
									description: t(
										`docs.combobox.cards.people.options.${key}.description`,
									),
									keywords: [
										t(`docs.combobox.cards.people.options.${key}.role`),
									],
								}))}
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.combobox.cards.city.title")}</CardTitle>
							<CardDescription>
								{t("docs.combobox.cards.city.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-combobox-city">
								{t("docs.combobox.cards.city.label")}
							</Label>
							<Combobox
								id="docs-combobox-city"
								placeholder={t("docs.combobox.cards.city.placeholder")}
								searchPlaceholder={t(
									"docs.combobox.cards.city.searchPlaceholder",
								)}
								emptyMessage={t("docs.combobox.cards.city.empty")}
								options={(["campinas", "osasco", "santos"] as const).map(
									key => ({
										value: key,
										label: t(`docs.combobox.cards.city.options.${key}.label`),
										description: t(
											`docs.combobox.cards.city.options.${key}.description`,
										),
									}),
								)}
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>Disabled combobox</CardTitle>
							<CardDescription>
								A disabled combobox should keep context without exposing
								interactive affordances.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-combobox-disabled">Reviewer</Label>
							<Combobox
								id="docs-combobox-disabled"
								disabled
								defaultValue="maria"
								options={(["maria", "joao"] as const).map(key => ({
									value: key,
									label: t(`docs.combobox.cards.people.options.${key}.label`),
								}))}
							/>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
