"use client";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function SelectParticle() {
	const { t } = useTranslation();
	const [statusValue, setStatusValue] = useState("active");

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.select.title")}
			description={t("docs.select.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.select.patternNotes.items.scope") },
				{ description: t("docs.select.patternNotes.items.placeholder") },
				{ description: t("docs.select.patternNotes.items.grouping") },
				{ description: t("docs.select.patternNotes.items.forms") },
				{ description: t("docs.select.patternNotes.items.clear") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.select.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.select.sections.filters.title")}
				description={t("docs.select.sections.filters.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.select.cards.status.title")}</CardTitle>
							<CardDescription>
								{t("docs.select.cards.status.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="ty-helper">{t("docs.select.cards.status.label")}</p>
							<Select
								value={statusValue}
								onValueChange={setStatusValue}
							>
								<SelectTrigger
									placeholder={t("docs.select.cards.status.placeholder")}
								/>
								<SelectContent>
									{(["active", "paused", "archived"] as const).map(key => (
										<SelectItem
											key={key}
											value={key}
										>
											{t(`docs.select.cards.status.options.${key}`)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.select.cards.placeholder.title")}</CardTitle>
							<CardDescription>
								{t("docs.select.cards.placeholder.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="ty-helper">
								{t("docs.select.cards.placeholder.label")}
							</p>
							<Select>
								<SelectTrigger
									placeholder={t("docs.select.cards.placeholder.placeholder")}
								/>
								<SelectContent>
									{(["today", "week", "month"] as const).map(key => (
										<SelectItem
											key={key}
											value={key}
										>
											{t(`docs.select.cards.placeholder.options.${key}`)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.select.sections.groups.title")}
				description={t("docs.select.sections.groups.description")}
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.select.cards.grouped.title")}</CardTitle>
							<CardDescription>
								{t("docs.select.cards.grouped.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="max-w-sm space-y-2">
							<p className="ty-helper">
								{t("docs.select.cards.grouped.label")}
							</p>
							<Select defaultValue="overview">
								<SelectTrigger
									placeholder={t("docs.select.cards.grouped.placeholder")}
								/>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>
											{t("docs.select.cards.grouped.groups.workspace")}
										</SelectLabel>
										{(["overview", "members"] as const).map(key => (
											<SelectItem
												key={key}
												value={key}
											>
												{t(`docs.select.cards.grouped.options.${key}`)}
											</SelectItem>
										))}
									</SelectGroup>
									<SelectSeparator />
									<SelectGroup>
										<SelectLabel>
											{t("docs.select.cards.grouped.groups.lifecycle")}
										</SelectLabel>
										{(["archive", "transfer"] as const).map(key => (
											<SelectItem
												key={key}
												value={key}
											>
												{t(`docs.select.cards.grouped.options.${key}`)}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.select.cards.disabled.title")}</CardTitle>
							<CardDescription>
								Disabled selects should preserve the chosen value but stop
								interaction.
							</CardDescription>
						</CardHeader>
						<CardContent className="max-w-sm space-y-2">
							<p className="ty-helper">
								{t("docs.select.cards.disabled.label")}
							</p>
							<Select
								disabled
								defaultValue="active"
							>
								<SelectTrigger
									placeholder={t("docs.select.cards.disabled.placeholder")}
								/>
								<SelectContent>
									<SelectItem value="active">
										{t("docs.select.cards.disabled.options.active")}
									</SelectItem>
									<SelectItem value="paused">
										{t("docs.select.cards.disabled.options.paused")}
									</SelectItem>
								</SelectContent>
							</Select>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
