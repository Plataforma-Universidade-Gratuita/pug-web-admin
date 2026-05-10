"use client";

import { useState } from "react";

import { CalendarDays, Filter, Info, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function PopoverParticle() {
	const { t } = useTranslation();
	const [isQuickFiltersOpen, setIsQuickFiltersOpen] = useState(false);
	const [isSupportOpen, setIsSupportOpen] = useState(false);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.popover.title")}
			description={t("docs.popover.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.popover.patternNotes.items.anchored") },
				{ description: t("docs.popover.patternNotes.items.compact") },
				{ description: t("docs.popover.patternNotes.items.singlePurpose") },
				{ description: t("docs.popover.patternNotes.items.escalation") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.popover.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.popover.sections.quickFilters.title")}
				description={t("docs.popover.sections.quickFilters.description")}
			>
				<Card className="p-4">
					<CardFooter className="flex flex-wrap items-center gap-3">
						<Popover
							open={isQuickFiltersOpen}
							onOpenChange={setIsQuickFiltersOpen}
						>
							<PopoverTrigger>
								<Button
									usage="secondary"
									variant="secondary"
									leadingIcon={
										<Icon
											icon={Filter}
											className="h-4 w-4"
										/>
									}
								>
									{t("docs.popover.examples.quickFilters.trigger")}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								align="start"
								className="space-y-3"
							>
								<div className="space-y-1">
									<p className="ty-sm-bold">
										{t("docs.popover.examples.quickFilters.title")}
									</p>
									<p className="ty-helper">
										{t("docs.popover.examples.quickFilters.description")}
									</p>
								</div>
								<div className="flex flex-wrap gap-2">
									{(["status", "period", "campus"] as const).map(key => (
										<Button
											key={key}
											size="sm"
											usage="secondary"
											variant="secondary"
											onClick={() => setIsQuickFiltersOpen(false)}
										>
											{t(`docs.popover.examples.quickFilters.options.${key}`)}
										</Button>
									))}
								</div>
							</PopoverContent>
						</Popover>
						<Button
							usage="secondary"
							variant="secondary"
							leadingIcon={
								<Icon
									icon={CalendarDays}
									className="h-4 w-4"
								/>
							}
						>
							{t("docs.popover.examples.quickFilters.neighbor")}
						</Button>
					</CardFooter>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.popover.sections.support.title")}
				description={t("docs.popover.sections.support.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.popover.examples.support.title")}</CardTitle>
							<CardDescription>
								{t("docs.popover.examples.support.description")}
							</CardDescription>
						</CardHeader>
						<CardFooter>
							<Popover
								open={isSupportOpen}
								onOpenChange={setIsSupportOpen}
							>
								<PopoverTrigger>
									<Button
										size="icon"
										usage="secondary"
										variant="secondary"
										tooltipContent={t("docs.popover.examples.support.trigger")}
									>
										<Icon
											icon={Info}
											className="h-4 w-4"
										/>
									</Button>
								</PopoverTrigger>
								<PopoverContent
									align="end"
									className="max-w-72 space-y-3"
								>
									<div className="space-y-1">
										<p className="ty-sm-bold">
											{t("docs.popover.examples.support.panelTitle")}
										</p>
										<p className="ty-helper">
											{t("docs.popover.examples.support.panelDescription")}
										</p>
									</div>
									<div className="space-y-2">
										{(["owner", "review", "visibility"] as const).map(key => (
											<div
												key={key}
												className="surface-1 rounded-[var(--twc-radius-lg)] p-3"
											>
												<p className="ty-helper">
													{t(
														`docs.popover.examples.support.items.${key}.label`,
													)}
												</p>
												<p className="ty-sm-semibold">
													{t(
														`docs.popover.examples.support.items.${key}.value`,
													)}
												</p>
											</div>
										))}
									</div>
								</PopoverContent>
							</Popover>
						</CardFooter>
					</Card>

					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.popover.examples.inline.title")}</CardTitle>
							<CardDescription>
								{t("docs.popover.examples.inline.description")}
							</CardDescription>
						</CardHeader>
						<CardFooter>
							<Popover>
								<PopoverTrigger>
									<Button
										usage="secondary"
										variant="secondary"
										leadingIcon={
											<Icon
												icon={SlidersHorizontal}
												className="h-4 w-4"
											/>
										}
									>
										{t("docs.popover.examples.inline.trigger")}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									align="start"
									className="space-y-3"
								>
									<p className="ty-sm-bold">
										{t("docs.popover.examples.inline.panelTitle")}
									</p>
									<div className="space-y-2">
										{(["comfortable", "compact"] as const).map(key => (
											<Button
												key={key}
												className="w-full justify-start"
												usage="secondary"
												variant="secondary"
											>
												{t(`docs.popover.examples.inline.options.${key}`)}
											</Button>
										))}
									</div>
								</PopoverContent>
							</Popover>
						</CardFooter>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
