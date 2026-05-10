"use client";

import {
	ArrowUpRight,
	CircleHelp,
	Info,
	PanelTop,
	Plus,
	Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Icon,
	Tooltip,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function TooltipParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.tooltip.title")}
			description={t("docs.tooltip.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.tooltip.patternNotes.items.clarify") },
				{ description: t("docs.tooltip.patternNotes.items.reinforce") },
				{ description: t("docs.tooltip.patternNotes.items.compact") },
				{ description: t("docs.tooltip.patternNotes.items.iconButtons") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.tooltip.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.tooltip.sections.automatic.title")}
				description={t("docs.tooltip.sections.automatic.description")}
			>
				<Card className="p-4">
					<CardFooter className="flex flex-wrap items-center gap-3">
						<Button
							size="icon"
							usage="primary"
							variant="primary"
							title={t("docs.tooltip.automatic.createItem")}
							leadingIcon={
								<Icon
									icon={Plus}
									className="h-4 w-4"
								/>
							}
						/>
						<Button
							size="icon"
							usage="secondary"
							variant="secondary"
							tooltipContent={t("docs.tooltip.automatic.moreInformation")}
							aria-label={t("docs.tooltip.automatic.moreInformation")}
							leadingIcon={
								<Icon
									icon={Info}
									className="h-4 w-4"
								/>
							}
						/>
						<Button
							size="icon"
							usage="danger"
							variant="secondary"
							title={t("docs.tooltip.automatic.deleteDraft")}
							leadingIcon={
								<Icon
									icon={Trash2}
									className="h-4 w-4"
								/>
							}
						/>
					</CardFooter>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.tooltip.sections.placement.title")}
				description={t("docs.tooltip.sections.placement.description")}
			>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{(["top", "right", "bottom", "left"] as const).map(side => (
						<Card
							key={side}
							className="flex min-h-40 flex-col justify-between p-4"
						>
							<CardHeader>
								<CardTitle>
									{t(`docs.tooltip.placementCards.${side}.name`)}
								</CardTitle>
								<CardDescription>
									{t(`docs.tooltip.placementCards.${side}.description`)}
								</CardDescription>
							</CardHeader>
							<CardFooter>
								<Tooltip
									content={t(`docs.tooltip.placementCards.${side}.tooltip`)}
									side={side}
								>
									<button
										type="button"
										className="border-default-2 surface-2 ty-sm-semibold focus-ring rounded-[var(--twc-radius-lg)] border px-3 py-2"
									>
										{t("docs.tooltip.placementCards.trigger")}
									</button>
								</Tooltip>
							</CardFooter>
						</Card>
					))}
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.tooltip.sections.richContent.title")}
				description={t("docs.tooltip.sections.richContent.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="flex min-h-40 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.tooltip.richContent.inlineHint.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.tooltip.richContent.inlineHint.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="ty-body">
							{t("docs.tooltip.richContent.inlineHint.prefix")}{" "}
							<Tooltip
								content={t("docs.tooltip.richContent.inlineHint.tooltip")}
								align="start"
							>
								<span className="cursor-help text-[color:var(--color-brand)] underline decoration-dotted underline-offset-3">
									{t("docs.tooltip.richContent.inlineHint.link")}
								</span>
							</Tooltip>
							{t("docs.tooltip.richContent.inlineHint.suffix")}
						</CardContent>
					</Card>

					<Card className="flex min-h-40 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.tooltip.richContent.compactMetadata.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.tooltip.richContent.compactMetadata.description")}
							</CardDescription>
						</CardHeader>
						<CardFooter>
							<Tooltip
								content={
									<div className="space-y-1">
										<p className="text-xs font-semibold">
											{t(
												"docs.tooltip.richContent.compactMetadata.tooltipTitle",
											)}
										</p>
										<p className="text-[11px] opacity-80">
											{t(
												"docs.tooltip.richContent.compactMetadata.tooltipBody",
											)}
										</p>
									</div>
								}
								align="start"
							>
								<button
									type="button"
									className="border-default-2 surface-2 ty-sm-semibold focus-ring inline-flex items-center gap-2 rounded-[var(--twc-radius-lg)] border px-3 py-2"
								>
									<Icon
										icon={PanelTop}
										className="h-4 w-4"
									/>
									{t("docs.tooltip.richContent.compactMetadata.button")}
									<Icon
										icon={ArrowUpRight}
										className="h-4 w-4"
									/>
								</button>
							</Tooltip>
						</CardFooter>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.tooltip.sections.triggerGuidance.title")}
				description={t("docs.tooltip.sections.triggerGuidance.description")}
			>
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="space-y-3 p-4">
						<CardTitle>
							{t("docs.tooltip.triggerGuidance.goodFit.title")}
						</CardTitle>
						<CardFooter>
							<Tooltip
								content={t("docs.tooltip.triggerGuidance.goodFit.tooltip")}
							>
								<button
									type="button"
									className="border-default-2 surface-2 focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border"
								>
									<Icon
										icon={CircleHelp}
										className="h-4 w-4"
									/>
								</button>
							</Tooltip>
						</CardFooter>
					</Card>
					<Card className="space-y-3 p-4">
						<CardTitle>
							{t("docs.tooltip.triggerGuidance.needsLabel.title")}
						</CardTitle>
						<CardFooter>
							<Button
								usage="secondary"
								variant="secondary"
								leadingIcon={
									<Icon
										icon={Info}
										className="h-4 w-4"
									/>
								}
							>
								{t("docs.tooltip.triggerGuidance.needsLabel.button")}
							</Button>
						</CardFooter>
					</Card>
					<Card className="space-y-3 p-4">
						<CardTitle>
							{t("docs.tooltip.triggerGuidance.avoidLongInstructions.title")}
						</CardTitle>
						<CardDescription>
							{t(
								"docs.tooltip.triggerGuidance.avoidLongInstructions.description",
							)}
						</CardDescription>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
