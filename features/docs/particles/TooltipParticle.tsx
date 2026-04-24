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

import { Button, Tooltip } from "@/components/ui";

import { ParticleContainer } from "./components/ParticleContainer";
import { ParticleSection } from "./components/ParticleSection";

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
				<div className="border-default-2 surface-1 flex flex-wrap items-center gap-3 rounded-[var(--twc-radius-xl)] border p-4">
					<Button
						size="icon"
						usage="primary"
						variant="flat"
						title={t("docs.tooltip.automatic.createItem")}
						leadingIcon={<Plus className="h-4 w-4" />}
					/>
					<Button
						size="icon"
						usage="secondary"
						variant="ghost"
						tooltipContent={t("docs.tooltip.automatic.moreInformation")}
						aria-label={t("docs.tooltip.automatic.moreInformation")}
						leadingIcon={<Info className="h-4 w-4" />}
					/>
					<Button
						size="icon"
						usage="danger"
						variant="ghost"
						title={t("docs.tooltip.automatic.deleteDraft")}
						leadingIcon={<Trash2 className="h-4 w-4" />}
					/>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.tooltip.sections.placement.title")}
				description={t("docs.tooltip.sections.placement.description")}
			>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{(["top", "right", "bottom", "left"] as const).map(side => (
						<div
							key={side}
							className="border-default-2 surface-1 flex min-h-40 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4"
						>
							<div className="space-y-1">
								<h3 className="ty-sm-bold">
									{t(`docs.tooltip.placementCards.${side}.name`)}
								</h3>
								<p className="ty-helper">
									{t(`docs.tooltip.placementCards.${side}.description`)}
								</p>
							</div>
							<div>
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
							</div>
						</div>
					))}
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.tooltip.sections.richContent.title")}
				description={t("docs.tooltip.sections.richContent.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="border-default-2 surface-1 flex min-h-40 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4">
						<div className="space-y-1">
							<h3 className="ty-sm-bold">
								{t("docs.tooltip.richContent.inlineHint.title")}
							</h3>
							<p className="ty-helper">
								{t("docs.tooltip.richContent.inlineHint.description")}
							</p>
						</div>
						<div className="ty-body">
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
						</div>
					</div>

					<div className="border-default-2 surface-1 flex min-h-40 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4">
						<div className="space-y-1">
							<h3 className="ty-sm-bold">
								{t("docs.tooltip.richContent.compactMetadata.title")}
							</h3>
							<p className="ty-helper">
								{t("docs.tooltip.richContent.compactMetadata.description")}
							</p>
						</div>
						<div>
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
									<PanelTop className="h-4 w-4" />
									{t("docs.tooltip.richContent.compactMetadata.button")}
									<ArrowUpRight className="h-4 w-4" />
								</button>
							</Tooltip>
						</div>
					</div>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.tooltip.sections.triggerGuidance.title")}
				description={t("docs.tooltip.sections.triggerGuidance.description")}
			>
				<div className="grid gap-4 md:grid-cols-3">
					<div className="border-default-2 surface-1 space-y-3 rounded-[var(--twc-radius-xl)] border p-4">
						<p className="ty-sm-bold">
							{t("docs.tooltip.triggerGuidance.goodFit.title")}
						</p>
						<Tooltip
							content={t("docs.tooltip.triggerGuidance.goodFit.tooltip")}
						>
							<button
								type="button"
								className="border-default-2 surface-2 focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border"
							>
								<CircleHelp className="h-4 w-4" />
							</button>
						</Tooltip>
					</div>
					<div className="border-default-2 surface-1 space-y-3 rounded-[var(--twc-radius-xl)] border p-4">
						<p className="ty-sm-bold">
							{t("docs.tooltip.triggerGuidance.needsLabel.title")}
						</p>
						<Button
							usage="secondary"
							variant="ghost"
							leadingIcon={<Info className="h-4 w-4" />}
						>
							{t("docs.tooltip.triggerGuidance.needsLabel.button")}
						</Button>
					</div>
					<div className="border-default-2 surface-1 space-y-3 rounded-[var(--twc-radius-xl)] border p-4">
						<p className="ty-sm-bold">
							{t("docs.tooltip.triggerGuidance.avoidLongInstructions.title")}
						</p>
						<p className="ty-helper">
							{t(
								"docs.tooltip.triggerGuidance.avoidLongInstructions.description",
							)}
						</p>
					</div>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
