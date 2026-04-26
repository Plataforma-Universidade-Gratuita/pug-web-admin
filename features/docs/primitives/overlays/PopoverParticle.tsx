"use client";

import { useState } from "react";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "components";
import {
	CalendarDays,
	Filter,
	MoreHorizontal,
	SlidersHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "../ParticleContainer";
import { ParticleSection } from "../ParticleSection";

export default function PopoverParticle() {
	const { t } = useTranslation();
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [isActionsOpen, setIsActionsOpen] = useState(false);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.popover.title")}
			description={t("docs.popover.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.popover.patternNotes.items.inline") },
				{ description: t("docs.popover.patternNotes.items.scope") },
				{ description: t("docs.popover.patternNotes.items.content") },
				{ description: t("docs.popover.patternNotes.items.escalation") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.popover.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.popover.sections.filters.title")}
				description={t("docs.popover.sections.filters.description")}
			>
				<Card className="p-4">
					<CardContent className="flex flex-wrap items-center gap-3">
						<Popover
							open={isFilterOpen}
							onOpenChange={setIsFilterOpen}
						>
							<PopoverTrigger>
								<Button
									usage="secondary"
									variant="flat"
									leadingIcon={
										<Icon
											icon={Filter}
											className="h-4 w-4"
										/>
									}
								>
									{t("docs.popover.examples.filters.trigger")}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								align="start"
								className="space-y-4"
							>
								<div className="space-y-1">
									<p className="ty-sm-bold">
										{t("docs.popover.examples.filters.title")}
									</p>
									<p className="ty-helper">
										{t("docs.popover.examples.filters.description")}
									</p>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="surface-1 rounded-[var(--twc-radius-lg)] p-3">
										<p className="ty-helper">
											{t("docs.popover.examples.filters.items.period")}
										</p>
										<p className="ty-sm-semibold">
											{t("docs.popover.examples.filters.values.period")}
										</p>
									</div>
									<div className="surface-1 rounded-[var(--twc-radius-lg)] p-3">
										<p className="ty-helper">
											{t("docs.popover.examples.filters.items.status")}
										</p>
										<p className="ty-sm-semibold">
											{t("docs.popover.examples.filters.values.status")}
										</p>
									</div>
								</div>
								<div className="flex flex-wrap justify-end gap-3">
									<Button
										usage="secondary"
										variant="ghost"
										onClick={() => setIsFilterOpen(false)}
									>
										{t("docs.popover.examples.filters.secondary")}
									</Button>
									<Button
										usage="primary"
										variant="flat"
										onClick={() => setIsFilterOpen(false)}
									>
										{t("docs.popover.examples.filters.primary")}
									</Button>
								</div>
							</PopoverContent>
						</Popover>
						<Button
							usage="secondary"
							variant="ghost"
							leadingIcon={
								<Icon
									icon={CalendarDays}
									className="h-4 w-4"
								/>
							}
						>
							{t("docs.popover.examples.filters.neighbor")}
						</Button>
					</CardContent>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.popover.sections.actions.title")}
				description={t("docs.popover.sections.actions.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.popover.examples.actions.title")}</CardTitle>
							<CardDescription>
								{t("docs.popover.examples.actions.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Popover
								open={isActionsOpen}
								onOpenChange={setIsActionsOpen}
							>
								<PopoverTrigger>
									<Button
										size="icon"
										usage="secondary"
										variant="ghost"
										tooltipContent={t("docs.popover.examples.actions.trigger")}
									>
										<Icon
											icon={MoreHorizontal}
											className="h-4 w-4"
										/>
									</Button>
								</PopoverTrigger>
								<PopoverContent
									align="end"
									className="space-y-2"
								>
									{(["layout", "rules", "owners"] as const).map(key => (
										<button
											key={key}
											type="button"
											className="interactive-surface border-default-2 surface-1 focus-ring flex w-full items-center justify-between rounded-[var(--twc-radius-lg)] border px-3 py-2 text-left"
											onClick={() => setIsActionsOpen(false)}
										>
											<span className="ty-sm-semibold">
												{t(`docs.popover.examples.actions.items.${key}.title`)}
											</span>
											<span className="ty-helper">
												{t(`docs.popover.examples.actions.items.${key}.meta`)}
											</span>
										</button>
									))}
								</PopoverContent>
							</Popover>
						</CardContent>
					</Card>

					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.popover.examples.inline.title")}</CardTitle>
							<CardDescription>
								{t("docs.popover.examples.inline.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Popover>
								<PopoverTrigger>
									<button
										type="button"
										className="border-default-2 surface-2 focus-ring inline-flex items-center gap-2 rounded-full border px-3 py-2"
									>
										<Icon
											icon={SlidersHorizontal}
											className="h-4 w-4"
										/>
										<span className="ty-sm-semibold">
											{t("docs.popover.examples.inline.trigger")}
										</span>
									</button>
								</PopoverTrigger>
								<PopoverContent
									align="start"
									className="space-y-3"
								>
									<p className="ty-sm-bold">
										{t("docs.popover.examples.inline.panelTitle")}
									</p>
									<p className="ty-helper">
										{t("docs.popover.examples.inline.panelDescription")}
									</p>
								</PopoverContent>
							</Popover>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
