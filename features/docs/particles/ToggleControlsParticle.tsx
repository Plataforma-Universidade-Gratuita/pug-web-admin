"use client";

import { useState } from "react";

import { Bold, Grid2x2, Italic, List, Underline } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
} from "@/components";

import { ParticleContainer } from "../primitives/ParticleContainer";
import { ParticleSection } from "../primitives/ParticleSection";

export default function ToggleControlsParticle() {
	const { t } = useTranslation();
	const [viewMode, setViewMode] = useState("grid");
	const [formatting, setFormatting] = useState<string[]>(["bold"]);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.toggleControls.title")}
			description={t("docs.toggleControls.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.toggleControls.patternNotes.items.toggle") },
				{ description: t("docs.toggleControls.patternNotes.items.group") },
				{ description: t("docs.toggleControls.patternNotes.items.press") },
				{ description: t("docs.toggleControls.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.toggleControls.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.toggleControls.sections.usage.title")}
				description={t("docs.toggleControls.sections.usage.description")}
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.toggleControls.cards.single.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.toggleControls.cards.single.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Toggle
								aria-label={t("docs.toggleControls.cards.single.ariaLabel")}
							>
								<Icon
									icon={Bold}
									className="h-4 w-4"
								/>
								<span>{t("docs.toggleControls.cards.single.label")}</span>
							</Toggle>
							<Toggle disabled>Locked</Toggle>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.toggleControls.cards.view.title")}</CardTitle>
							<CardDescription>
								{t("docs.toggleControls.cards.view.description")}
							</CardDescription>
						</CardHeader>
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
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.toggleControls.sections.multi.title")}
				description={t("docs.toggleControls.sections.multi.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.toggleControls.cards.multi.title")}</CardTitle>
						<CardDescription>
							{t("docs.toggleControls.cards.multi.description")}
						</CardDescription>
					</CardHeader>
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
									<span>
										{t(`docs.toggleControls.cards.multi.items.${key}`)}
									</span>
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
