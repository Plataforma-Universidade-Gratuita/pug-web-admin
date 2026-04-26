"use client";

import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Icon,
} from "components";
import { CheckCircle2, Clock3, ShieldAlert, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "../ParticleContainer";
import { ParticleSection } from "../ParticleSection";

export default function BadgeParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.badge.title")}
			description={t("docs.badge.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.badge.patternNotes.items.status") },
				{ description: t("docs.badge.patternNotes.items.tone") },
				{ description: t("docs.badge.patternNotes.items.variant") },
				{ description: t("docs.badge.patternNotes.items.compact") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.badge.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.badge.sections.tones.title")}
				description={t("docs.badge.sections.tones.description")}
			>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{(
						[
							{
								key: "brand",
								tone: "brand" as const,
								icon: Sparkles,
							},
							{
								key: "success",
								tone: "success" as const,
								icon: CheckCircle2,
							},
							{
								key: "warning",
								tone: "warning" as const,
								icon: Clock3,
							},
							{
								key: "danger",
								tone: "danger" as const,
								icon: ShieldAlert,
							},
						] as const
					).map(item => (
						<Card
							key={item.key}
							className="h-full p-5"
						>
							<CardHeader className="space-y-3">
								<CardTitle>{t(`docs.badge.cards.${item.key}.title`)}</CardTitle>
								<CardDescription>
									{t(`docs.badge.cards.${item.key}.description`)}
								</CardDescription>
							</CardHeader>
							<CardFooter className="pt-2">
								<Badge tone={item.tone}>
									<Icon
										icon={item.icon}
										className="h-3.5 w-3.5"
									/>
									{t(`docs.badge.cards.${item.key}.label`)}
								</Badge>
							</CardFooter>
						</Card>
					))}
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.badge.sections.variants.title")}
				description={t("docs.badge.sections.variants.description")}
			>
				<div className="grid gap-4 md:grid-cols-3">
					{(["soft", "solid", "outline"] as const).map(variant => (
						<Card
							key={variant}
							className="h-full p-5"
						>
							<CardHeader className="space-y-3">
								<CardTitle>{t(`docs.badge.variants.${variant}`)}</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-wrap items-center gap-3">
								<Badge
									tone="brand"
									variant={variant}
								>
									{t("docs.badge.cards.brand.label")}
								</Badge>
								<Badge
									tone="success"
									variant={variant}
								>
									{t("docs.badge.cards.success.label")}
								</Badge>
							</CardContent>
						</Card>
					))}
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
