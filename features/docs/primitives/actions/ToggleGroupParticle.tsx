"use client";

import { useState } from "react";

import {
	Bold,
	Grid2x2,
	Italic,
	List,
	Monitor,
	Moon,
	Sun,
	Underline,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	ToggleGroup,
	ToggleGroupItem,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function ToggleGroupParticle() {
	const { t } = useTranslation();
	const [viewMode, setViewMode] = useState("grid");
	const [formatting, setFormatting] = useState<string[]>(["bold"]);
	const [themeMode, setThemeMode] = useState("system");
	const [language, setLanguage] = useState("en-US");

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.toggleControls.primitives.toggleGroupTitle")}
			description={t("docs.toggleControls.patternNotes.items.group")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.toggleControls.patternNotes.items.group") },
				{ description: t("docs.toggleControls.patternNotes.items.spaced") },
				{ description: t("docs.toggleControls.patternNotes.items.pill") },
				{ description: t("docs.toggleControls.patternNotes.items.chrome") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.toggleControls.patternNotes.groupSnippet")}
		>
			<ParticleSection
				title={t("docs.toggleControls.sections.spaced.title")}
				description={t("docs.toggleControls.sections.spaced.description")}
				defaultExpanded
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.toggleControls.cards.view.title")}</CardTitle>
							<CardDescription>
								{t("docs.toggleControls.cards.view.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
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

					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.toggleControls.cards.multi.title")}
							</CardTitle>
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
										aria-label={t(
											`docs.toggleControls.cards.multi.items.${key}`,
										)}
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
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.toggleControls.sections.pill.title")}
				description={t("docs.toggleControls.sections.pill.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.toggleControls.cards.pill.title")}</CardTitle>
						<CardDescription>
							{t("docs.toggleControls.cards.pill.description")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ToggleGroup
							variant="pill"
							value={themeMode}
							onValueChange={value => {
								if (value) setThemeMode(value);
							}}
						>
							<ToggleGroupItem
								value="light"
								aria-label={t("docs.toggleControls.cards.pill.items.light")}
							>
								<Icon
									icon={Sun}
									className="h-4 w-4"
								/>
								<span>{t("docs.toggleControls.cards.pill.items.light")}</span>
							</ToggleGroupItem>
							<ToggleGroupItem
								value="dark"
								aria-label={t("docs.toggleControls.cards.pill.items.dark")}
							>
								<Icon
									icon={Moon}
									className="h-4 w-4"
								/>
								<span>{t("docs.toggleControls.cards.pill.items.dark")}</span>
							</ToggleGroupItem>
							<ToggleGroupItem
								value="system"
								aria-label={t("docs.toggleControls.cards.pill.items.system")}
							>
								<Icon
									icon={Monitor}
									className="h-4 w-4"
								/>
								<span>{t("docs.toggleControls.cards.pill.items.system")}</span>
							</ToggleGroupItem>
						</ToggleGroup>
					</CardContent>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.toggleControls.sections.chrome.title")}
				description={t("docs.toggleControls.sections.chrome.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.toggleControls.cards.chrome.title")}</CardTitle>
						<CardDescription>
							{t("docs.toggleControls.cards.chrome.description")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div
							className="flex flex-wrap items-center gap-3 rounded-xl p-4"
							style={{ backgroundColor: "var(--color-brand)" }}
						>
							<ToggleGroup
								variant="pill"
								colorVariant="chrome"
								value={themeMode}
								onValueChange={value => {
									if (value) setThemeMode(value);
								}}
							>
								<ToggleGroupItem
									value="light"
									aria-label={t("docs.toggleControls.cards.chrome.theme.light")}
									tooltipContent={t(
										"docs.toggleControls.cards.chrome.theme.light",
									)}
								>
									<Icon
										icon={Sun}
										className="h-4 w-4"
									/>
								</ToggleGroupItem>
								<ToggleGroupItem
									value="dark"
									aria-label={t("docs.toggleControls.cards.chrome.theme.dark")}
									tooltipContent={t(
										"docs.toggleControls.cards.chrome.theme.dark",
									)}
								>
									<Icon
										icon={Moon}
										className="h-4 w-4"
									/>
								</ToggleGroupItem>
								<ToggleGroupItem
									value="system"
									aria-label={t(
										"docs.toggleControls.cards.chrome.theme.system",
									)}
									tooltipContent={t(
										"docs.toggleControls.cards.chrome.theme.system",
									)}
								>
									<Icon
										icon={Monitor}
										className="h-4 w-4"
									/>
								</ToggleGroupItem>
							</ToggleGroup>

							<ToggleGroup
								variant="pill"
								colorVariant="chrome"
								value={language}
								onValueChange={value => {
									if (value) setLanguage(value);
								}}
							>
								<ToggleGroupItem
									value="en-US"
									aria-label={t(
										"docs.toggleControls.cards.chrome.locale.english",
									)}
									tooltipContent={t(
										"docs.toggleControls.cards.chrome.locale.english",
									)}
								>
									<span className="toggle-group-item-short-label">EN</span>
								</ToggleGroupItem>
								<ToggleGroupItem
									value="pt-BR"
									aria-label={t(
										"docs.toggleControls.cards.chrome.locale.portuguese",
									)}
									tooltipContent={t(
										"docs.toggleControls.cards.chrome.locale.portuguese",
									)}
								>
									<span className="toggle-group-item-short-label">PT</span>
								</ToggleGroupItem>
							</ToggleGroup>
						</div>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
