"use client";

import {
	ArrowRight,
	CheckCircle2,
	Download,
	Info,
	OctagonAlert,
	Plus,
	ShieldAlert,
	Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";

import { ParticleContainer } from "./components/ParticleContainer";
import { ParticleSection } from "./components/ParticleSection";

export default function ButtonParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.button.title")}
			description={t("docs.button.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.button.patternNotes.items.usage") },
				{ description: t("docs.button.patternNotes.items.flat") },
				{ description: t("docs.button.patternNotes.items.ghost") },
				{ description: t("docs.button.patternNotes.items.icon") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.button.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.button.sections.usage.title")}
				description={t("docs.button.sections.usage.description")}
			>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{[
						{
							key: "primary",
							usage: "primary" as const,
							icon: <ArrowRight className="h-4 w-4" />,
						},
						{
							key: "secondary",
							usage: "secondary" as const,
							icon: <Download className="h-4 w-4" />,
						},
						{
							key: "success",
							usage: "success" as const,
							icon: <CheckCircle2 className="h-4 w-4" />,
						},
						{
							key: "info",
							usage: "info" as const,
							icon: <Info className="h-4 w-4" />,
						},
						{
							key: "warning",
							usage: "warning" as const,
							icon: <OctagonAlert className="h-4 w-4" />,
						},
						{
							key: "danger",
							usage: "danger" as const,
							icon: <ShieldAlert className="h-4 w-4" />,
						},
					].map(item => (
						<div
							key={item.key}
							className="border-default-2 surface-1 flex min-h-40 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4"
						>
							<div className="space-y-1">
								<h3 className="ty-sm-bold">
									{t(`docs.button.usageCards.${item.key}.name`)}
								</h3>
								<p className="ty-helper">
									{t(`docs.button.usageCards.${item.key}.description`)}
								</p>
							</div>
							<div>
								<Button
									usage={item.usage}
									trailingIcon={item.icon}
								>
									{t(`docs.button.usageCards.${item.key}.label`)}
								</Button>
							</div>
						</div>
					))}
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.variant.title")}
				description={t("docs.button.sections.variant.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					{[
						{ key: "flat", variant: "flat" as const },
						{ key: "ghost", variant: "ghost" as const },
					].map(item => (
						<div
							key={item.key}
							className="border-default-2 surface-1 flex min-h-40 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4"
						>
							<div className="space-y-1">
								<h3 className="ty-sm-bold">
									{t(`docs.button.variantCards.${item.key}.name`)}
								</h3>
								<p className="ty-helper">
									{t(`docs.button.variantCards.${item.key}.description`)}
								</p>
							</div>
							<div>
								<Button
									usage="primary"
									variant={item.variant}
									leadingIcon={<Zap className="h-4 w-4" />}
								>
									{t("docs.button.variantCards.label")}
								</Button>
							</div>
						</div>
					))}
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.scale.title")}
				description={t("docs.button.sections.scale.description")}
			>
				<div className="border-default-2 surface-1 flex flex-wrap items-center gap-3 rounded-[var(--twc-radius-xl)] border p-4">
					{[
						{ key: "small", size: "sm" as const },
						{ key: "medium", size: "md" as const },
						{ key: "large", size: "lg" as const },
					].map(item => (
						<Button
							key={item.key}
							size={item.size}
							usage="secondary"
							variant="flat"
							leadingIcon={<Plus className="h-4 w-4" />}
						>
							{t(`docs.button.sizes.${item.key}`)}
						</Button>
					))}
					<Button
						size="icon"
						usage="secondary"
						variant="ghost"
						title={t("docs.button.sizes.iconTitle")}
						leadingIcon={<Plus className="h-4 w-4" />}
					/>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.states.title")}
				description={t("docs.button.sections.states.description")}
			>
				<div className="grid gap-4 md:grid-cols-3">
					<div className="border-default-2 surface-1 space-y-3 rounded-[var(--twc-radius-xl)] border p-4">
						<p className="ty-sm-bold">
							{t("docs.button.statesCards.loading.title")}
						</p>
						<Button
							isLoading
							loadingText={t("docs.button.statesCards.loading.loadingText")}
							usage="primary"
						>
							{t("docs.button.statesCards.loading.button")}
						</Button>
					</div>
					<div className="border-default-2 surface-1 space-y-3 rounded-[var(--twc-radius-xl)] border p-4">
						<p className="ty-sm-bold">
							{t("docs.button.statesCards.disabled.title")}
						</p>
						<Button
							usage="secondary"
							variant="flat"
							disabled
						>
							{t("docs.button.statesCards.disabled.button")}
						</Button>
					</div>
					<div className="border-default-2 surface-1 space-y-3 rounded-[var(--twc-radius-xl)] border p-4">
						<p className="ty-sm-bold">
							{t("docs.button.statesCards.fullWidth.title")}
						</p>
						<Button
							className="w-full"
							usage="info"
							variant="flat"
							trailingIcon={<ArrowRight className="h-4 w-4" />}
						>
							{t("docs.button.statesCards.fullWidth.button")}
						</Button>
					</div>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
