"use client";

import { useTranslation } from "react-i18next";

import {
	Badge,
	ScrollArea,
	Section,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";
import {
	PRIMITIVE_AREA_KEYS,
	PRIMITIVE_SUMMARY_CARD_KEYS,
} from "@/constants/docs";
import { DocsTextLink } from "@/features/docs/primitives";

export default function PrimitivesDocsPageContent() {
	const { t } = useTranslation();

	return (
		<main className="mx-auto max-w-7xl px-6 pt-3 pb-6 lg:-mb-6 lg:px-8 lg:pt-4 lg:pb-6">
			<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="space-y-8">
					<Section className="surface-2 shadow-normal rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] p-7">
						<SectionHeader className="gap-3">
							<div className="space-y-3">
								<Badge tone="brand">
									{t("docs.primitivesOverview.hero.badge")}
								</Badge>
								<SectionTitle className="text-3xl">
									{t("docs.primitivesOverview.hero.title")}
								</SectionTitle>
								<SectionDescription>
									{t("docs.primitivesOverview.hero.description")}
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
							{PRIMITIVE_SUMMARY_CARD_KEYS.map(key => (
								<div
									key={key}
									className="surface-3 grid h-full gap-2 rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-3)] px-5 py-5"
								>
									<p className="text-sm font-semibold text-[color:var(--twc-text)]">
										{t(`docs.primitivesOverview.summary.${key}.title`)}
									</p>
									<p className="text-sm leading-relaxed text-[color:var(--twc-muted)]">
										{t(`docs.primitivesOverview.summary.${key}.description`)}
									</p>
								</div>
							))}
						</SectionContent>
					</Section>

					<Section className="surface-2 shadow-normal rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] p-7">
						<SectionHeader className="gap-3">
							<div className="space-y-3">
								<Badge
									tone="info"
									variant="secondary"
								>
									{t("docs.primitivesOverview.categories.badge")}
								</Badge>
								<SectionTitle className="text-3xl">
									{t("docs.primitivesOverview.categories.title")}
								</SectionTitle>
								<SectionDescription className="max-w-3xl">
									{t("docs.primitivesOverview.categories.description")}
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent className="grid gap-4">
							{PRIMITIVE_SUMMARY_CARD_KEYS.map(key => (
								<div
									key={key}
									className="surface-3 grid gap-3 rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-3)] px-5 py-5 md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.45fr)] md:items-start md:gap-6"
								>
									<div className="space-y-2">
										<p className="text-base font-semibold">
											{t(`docs.primitivesOverview.summary.${key}.title`)}
										</p>
										<Badge
											tone="neutral"
											variant="secondary"
										>
											{t("docs.primitivesOverview.categories.guidanceLabel")}
										</Badge>
									</div>
									<p className="text-sm leading-relaxed text-[color:var(--twc-muted)]">
										{t(`docs.primitivesOverview.guidance.${key}`)}
									</p>
								</div>
							))}
						</SectionContent>
					</Section>
				</div>

				<Section className="surface-2 shadow-normal hidden rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] p-7 lg:sticky lg:top-3 lg:flex lg:h-[calc(100dvh-6.5rem)] lg:flex-col lg:self-start">
					<SectionHeader className="gap-3">
						<div className="space-y-3">
							<Badge
								tone="brand"
								variant="secondary"
							>
								{t("docs.primitivesOverview.rail.badge")}
							</Badge>
							<SectionTitle className="text-2xl">
								{t("docs.primitivesOverview.rail.title")}
							</SectionTitle>
							<SectionDescription>
								{t("docs.primitivesOverview.rail.description")}
							</SectionDescription>
						</div>
					</SectionHeader>
					<SectionContent className="min-h-0 flex-1">
						<ScrollArea
							className="h-full"
							viewportClassName="pr-3"
						>
							<div className="grid gap-3">
								{PRIMITIVE_AREA_KEYS.map(key => (
									<div
										key={key}
										className="surface-3 grid gap-2 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-3)] px-3 py-3"
									>
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<p className="text-sm font-semibold text-[color:var(--twc-text)]">
													{t(`docs.primitivesOverview.areas.${key}.title`)}
												</p>
												<p className="text-xs text-[color:var(--twc-muted)]">
													{t(`docs.primitivesOverview.areas.${key}.label`)}
												</p>
											</div>
											<Badge
												tone="neutral"
												variant="secondary"
											>
												{t(`docs.primitivesOverview.areas.${key}.tone`)}
											</Badge>
										</div>
										<p className="text-xs text-[color:var(--twc-muted)]">
											{t(`docs.primitivesOverview.areas.${key}.description`)}
										</p>
										<DocsTextLink
											href={t(`docs.primitivesOverview.areas.${key}.href`)}
										>
											{t(`docs.primitivesOverview.areas.${key}.cta`)}
										</DocsTextLink>
									</div>
								))}
							</div>
						</ScrollArea>
					</SectionContent>
				</Section>
			</div>
		</main>
	);
}
