"use client";

import { useState } from "react";

import { Bold, Grid2x2, Italic, List, Underline } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, Icon, ToggleGroup, ToggleGroupItem } from "@/components";

import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function ToggleGroupParticle() {
	const { t } = useTranslation();
	const [viewMode, setViewMode] = useState("grid");
	const [formatting, setFormatting] = useState<string[]>(["bold"]);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.toggleControls.primitives.toggleGroupTitle")}
			description={t("docs.toggleControls.patternNotes.items.group")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.toggleControls.patternNotes.items.group") },
				{ description: t("docs.toggleControls.patternNotes.items.press") },
				{ description: t("docs.toggleControls.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.toggleControls.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.toggleControls.cards.view.title")}
				description={t("docs.toggleControls.cards.view.description")}
			>
				<Card className="p-4">
					<CardContent className="space-y-4">
						<ToggleGroup
							value={viewMode}
							onValueChange={value => {
								if (value) setViewMode(value);
							}}
						>
							<ToggleGroupItem
								value="grid"
								aria-label={t("docs.toggleControls.cards.view.items.grid")}
							>
								<Icon
									icon={Grid2x2}
									className="h-4 w-4"
								/>
								<span>{t("docs.toggleControls.cards.view.items.grid")}</span>
							</ToggleGroupItem>
							<ToggleGroupItem
								value="list"
								aria-label={t("docs.toggleControls.cards.view.items.list")}
								disabled
							>
								<Icon
									icon={List}
									className="h-4 w-4"
								/>
								<span>{t("docs.toggleControls.cards.view.items.list")}</span>
							</ToggleGroupItem>
						</ToggleGroup>
					</CardContent>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.toggleControls.cards.multi.title")}
				description={t("docs.toggleControls.cards.multi.description")}
			>
				<Card className="p-4">
					<CardContent>
						<ToggleGroup
							type="multiple"
							value={formatting}
							onValueChange={setFormatting}
						>
							{(
								[
									["bold", Bold],
									["italic", Italic],
									["underline", Underline],
								] as const
							).map(([key, icon]) => (
								<ToggleGroupItem
									key={key}
									value={key}
									disabled={key === "underline"}
									aria-label={t(`docs.toggleControls.cards.multi.items.${key}`)}
								>
									<Icon
										icon={icon}
										className="h-4 w-4"
									/>
									<span>{t(`docs.toggleControls.cards.multi.items.${key}`)}</span>
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
