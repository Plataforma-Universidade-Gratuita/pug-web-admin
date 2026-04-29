"use client";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
} from "@/components";
import { Bell, CheckCircle2, Eye, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function IconParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.icon.title")}
			description={t("docs.icon.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.icon.patternNotes.items.decorative") },
				{ description: t("docs.icon.patternNotes.items.accessible") },
				{ description: t("docs.icon.patternNotes.items.tooltip") },
				{ description: t("docs.icon.patternNotes.items.buttons") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.icon.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.icon.sections.decorative.title")}
				description={t("docs.icon.sections.decorative.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.icon.decorativeCards.inline.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.icon.decorativeCards.inline.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="ty-body mt-6 flex items-center gap-2">
							<Icon
								icon={CheckCircle2}
								className="h-4 w-4 text-[color:var(--color-success)]"
							/>
							<span>{t("docs.icon.decorativeCards.inline.body")}</span>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.icon.decorativeCards.status.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.icon.decorativeCards.status.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="mt-6 flex items-center gap-3">
							<div className="surface-2 flex items-center gap-2 rounded-full px-3 py-2">
								<Icon
									icon={Bell}
									className="h-4 w-4 text-[color:var(--twc-muted)]"
								/>
								<span className="ty-sm-semibold">
									{t("docs.icon.decorativeCards.status.badge")}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.icon.sections.accessibility.title")}
				description={t("docs.icon.sections.accessibility.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.icon.accessibilityCards.tooltip.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.icon.accessibilityCards.tooltip.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="mt-6">
							<Icon
								icon={Search}
								label={t("docs.icon.accessibilityCards.tooltip.label")}
								className="h-5 w-5 text-[color:var(--color-brand)]"
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.icon.accessibilityCards.custom.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.icon.accessibilityCards.custom.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="mt-6">
							<Icon
								icon={Eye}
								label={t("docs.icon.accessibilityCards.custom.label")}
								tooltipContent={t(
									"docs.icon.accessibilityCards.custom.tooltip",
								)}
								className="h-5 w-5 text-[color:var(--twc-text)]"
							/>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.icon.sections.integration.title")}
				description={t("docs.icon.sections.integration.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.icon.integrationCard.title")}</CardTitle>
						<CardDescription>
							{t("docs.icon.integrationCard.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="mt-6 flex flex-wrap gap-3">
						<Button
							usage="primary"
							variant="flat"
							leadingIcon={
								<Icon
									icon={Search}
									className="h-4 w-4"
								/>
							}
						>
							{t("docs.icon.integrationCard.primary")}
						</Button>
						<Button
							size="icon"
							usage="secondary"
							variant="ghost"
							title={t("docs.icon.integrationCard.iconButton")}
							leadingIcon={
								<Icon
									icon={Bell}
									className="h-4 w-4"
								/>
							}
						/>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
