"use client";

import { ArrowRight, FolderKanban, LayoutPanelTop, Rows3 } from "lucide-react";
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
} from "@/components";
import { ParticleContainer } from "@/features/docs/particles/components/ParticleContainer";
import { ParticleSection } from "@/features/docs/particles/components/ParticleSection";

export default function CardParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.card.title")}
			description={t("docs.card.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.card.patternNotes.items.container") },
				{ description: t("docs.card.patternNotes.items.structure") },
				{ description: t("docs.card.patternNotes.items.footer") },
				{ description: t("docs.card.patternNotes.items.behavior") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.card.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.card.sections.structure.title")}
				description={t("docs.card.sections.structure.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="min-h-44 p-4">
						<CardHeader>
							<CardTitle>{t("docs.card.structureCards.basic.title")}</CardTitle>
							<CardDescription>
								{t("docs.card.structureCards.basic.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="ty-body mt-6">
							{t("docs.card.structureCards.basic.body")}
						</CardContent>
					</Card>

					<Card className="min-h-44 p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.card.structureCards.header.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.card.structureCards.header.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="ty-body mt-6">
							{t("docs.card.structureCards.header.body")}
						</CardContent>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.card.sections.composition.title")}
				description={t("docs.card.sections.composition.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="flex min-h-52 flex-col p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.card.compositionCards.actions.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.card.compositionCards.actions.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="ty-body mt-6 flex-1">
							{t("docs.card.compositionCards.actions.body")}
						</CardContent>
						<CardFooter className="mt-6 flex flex-wrap justify-end gap-3">
							<Button
								usage="secondary"
								variant="ghost"
							>
								{t("docs.card.compositionCards.actions.footer.secondary")}
							</Button>
							<Button
								usage="primary"
								variant="flat"
								trailingIcon={
									<Icon
										icon={ArrowRight}
										className="h-4 w-4"
									/>
								}
							>
								{t("docs.card.compositionCards.actions.footer.primary")}
							</Button>
						</CardFooter>
					</Card>

					<Card className="flex min-h-52 flex-col p-4">
						<CardHeader className="flex items-start gap-3 space-y-0">
							<div className="surface-2 flex h-10 w-10 items-center justify-center rounded-[var(--twc-radius-lg)]">
								<Icon
									icon={FolderKanban}
									className="h-5 w-5 text-[color:var(--color-brand)]"
								/>
							</div>
							<div className="space-y-1">
								<CardTitle>
									{t("docs.card.compositionCards.summary.title")}
								</CardTitle>
								<CardDescription>
									{t("docs.card.compositionCards.summary.description")}
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="mt-6 grid gap-3 sm:grid-cols-2">
							<div className="surface-2 rounded-[var(--twc-radius-lg)] p-3">
								<p className="ty-helper">
									{t(
										"docs.card.compositionCards.summary.stats.items.projects.label",
									)}
								</p>
								<p className="ty-sm-bold">
									{t(
										"docs.card.compositionCards.summary.stats.items.projects.value",
									)}
								</p>
							</div>
							<div className="surface-2 rounded-[var(--twc-radius-lg)] p-3">
								<p className="ty-helper">
									{t(
										"docs.card.compositionCards.summary.stats.items.openTasks.label",
									)}
								</p>
								<p className="ty-sm-bold">
									{t(
										"docs.card.compositionCards.summary.stats.items.openTasks.value",
									)}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.card.sections.layouts.title")}
				description={t("docs.card.sections.layouts.description")}
			>
				<div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.card.layoutCards.list.title")}</CardTitle>
							<CardDescription>
								{t("docs.card.layoutCards.list.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="mt-6 space-y-3">
							{(["overview", "composition", "actions"] as const).map(key => (
								<div
									key={key}
									className="surface-2 flex items-start gap-3 rounded-[var(--twc-radius-lg)] p-3"
								>
									<Icon
										icon={Rows3}
										className="mt-0.5 h-4 w-4 text-[color:var(--twc-muted)]"
									/>
									<div className="space-y-1">
										<p className="ty-sm-bold">
											{t(`docs.card.layoutCards.list.items.${key}.title`)}
										</p>
										<p className="ty-helper">
											{t(`docs.card.layoutCards.list.items.${key}.description`)}
										</p>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="flex min-h-52 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.card.layoutCards.compact.title")}</CardTitle>
							<CardDescription>
								{t("docs.card.layoutCards.compact.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="mt-6">
							<div className="surface-2 inline-flex items-center gap-2 rounded-full px-3 py-2">
								<Icon
									icon={LayoutPanelTop}
									className="h-4 w-4 text-[color:var(--color-brand)]"
								/>
								<span className="ty-sm-semibold">
									{t("docs.card.layoutCards.compact.badge")}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
