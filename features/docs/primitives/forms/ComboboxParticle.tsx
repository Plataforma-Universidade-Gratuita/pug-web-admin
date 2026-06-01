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
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function ComboboxParticle() {
	const { t } = useTranslation();
	const [ownerValue, setOwnerValue] = useState("maria");
	const [cityValues, setCityValues] = useState(["campinas", "santos"]);
	const [creatableValue, setCreatableValue] = useState("onboarding");
	const [creatableOptions, setCreatableOptions] = useState([
		{
			value: "onboarding",
			label: t("docs.combobox.cards.creatable.options.onboarding.label"),
			description: t(
				"docs.combobox.cards.creatable.options.onboarding.description",
			),
		},
		{
			value: "follow-up",
			label: t("docs.combobox.cards.creatable.options.followUp.label"),
			description: t(
				"docs.combobox.cards.creatable.options.followUp.description",
			),
		},
		{
			value: "internal",
			label: t("docs.combobox.cards.creatable.options.internal.label"),
			description: t(
				"docs.combobox.cards.creatable.options.internal.description",
			),
		},
	]);

	function handleCreateValue(value: string) {
		const nextValue = value.trim();
		if (!nextValue) return;

		setCreatableOptions(currentOptions => {
			if (currentOptions.some(option => option.value === nextValue)) {
				return currentOptions;
			}

			return [
				...currentOptions,
				{
					value: nextValue,
					label: nextValue,
					description: t("docs.combobox.cards.creatable.createdDescription"),
				},
			];
		});

		return nextValue;
	}

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.combobox.title")}
			description={t("docs.combobox.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.combobox.patternNotes.items.search") },
				{ description: t("docs.combobox.patternNotes.items.single") },
				{ description: t("docs.combobox.patternNotes.items.multiple") },
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
							<CardTitle>{t("docs.combobox.cards.disabled.title")}</CardTitle>
							<CardDescription>
								{t("docs.combobox.cards.disabled.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-combobox-disabled">
								{t("docs.combobox.cards.disabled.label")}
							</Label>
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

			<ParticleSection
				title={t("docs.combobox.sections.multiple.title")}
				description={t("docs.combobox.sections.multiple.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.combobox.cards.multiple.title")}</CardTitle>
						<CardDescription>
							{t("docs.combobox.cards.multiple.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Label htmlFor="docs-combobox-multiple">
							{t("docs.combobox.cards.multiple.label")}
						</Label>
						<Combobox
							id="docs-combobox-multiple"
							multiple
							values={cityValues}
							onValuesChange={setCityValues}
							placeholder={t("docs.combobox.cards.multiple.placeholder")}
							searchPlaceholder={t(
								"docs.combobox.cards.multiple.searchPlaceholder",
							)}
							emptyMessage={t("docs.combobox.cards.multiple.empty")}
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
			</ParticleSection>

			<ParticleSection
				title={t("docs.combobox.sections.creatable.title")}
				description={t("docs.combobox.sections.creatable.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.combobox.cards.creatable.title")}</CardTitle>
						<CardDescription>
							{t("docs.combobox.cards.creatable.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Label htmlFor="docs-combobox-creatable">
							{t("docs.combobox.cards.creatable.label")}
						</Label>
						<Combobox
							id="docs-combobox-creatable"
							value={creatableValue}
							onValueChange={setCreatableValue}
							placeholder={t("docs.combobox.cards.creatable.placeholder")}
							searchPlaceholder={t(
								"docs.combobox.cards.creatable.searchPlaceholder",
							)}
							emptyMessage={t("docs.combobox.cards.creatable.empty")}
							options={creatableOptions}
							creatable
							createLabel={value =>
								t("docs.combobox.cards.creatable.createLabel", { value })
							}
							onCreateValue={handleCreateValue}
						/>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
