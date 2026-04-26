"use client";

import { useTranslation } from "react-i18next";

import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";
import { DocsSectionPanel, DocsTextLink } from "@/features/docs/primitives";

const primitiveAreaKeys = [
	"actions",
	"display",
	"forms",
	"navigation",
	"overlays",
	"structure",
] as const;

const summaryCardKeys = ["organization", "patterns", "exploration"] as const;

export default function PrimitivesDocsPageContent() {
	const { t } = useTranslation();

	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<DocsSectionPanel>
				<SectionHeader>
					<div className="max-w-3xl space-y-3">
						<Badge tone="brand">
							{t("docs.primitivesOverview.hero.badge")}
						</Badge>
						<SectionTitle>
							{t("docs.primitivesOverview.hero.title")}
						</SectionTitle>
						<SectionDescription>
							{t("docs.primitivesOverview.hero.description")}
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 md:grid-cols-3">
					{summaryCardKeys.map(key => (
						<Card
							key={key}
							className="p-4"
						>
							<CardHeader>
								<CardTitle>
									{t(`docs.primitivesOverview.summary.${key}.title`)}
								</CardTitle>
								<CardDescription>
									{t(`docs.primitivesOverview.summary.${key}.description`)}
								</CardDescription>
							</CardHeader>
						</Card>
					))}
				</SectionContent>
			</DocsSectionPanel>

			<DocsSectionPanel>
				<SectionHeader>
					<div className="space-y-3">
						<Badge tone="info">
							{t("docs.primitivesOverview.categories.badge")}
						</Badge>
						<SectionTitle>
							{t("docs.primitivesOverview.categories.title")}
						</SectionTitle>
						<SectionDescription>
							{t("docs.primitivesOverview.categories.description")}
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 xl:grid-cols-3">
					{primitiveAreaKeys.map(key => (
						<Card
							key={key}
							className="flex h-full flex-col justify-between p-4"
						>
							<CardHeader className="space-y-3">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<CardTitle>
										{t(`docs.primitivesOverview.areas.${key}.title`)}
									</CardTitle>
									<Badge tone="neutral">
										{t(`docs.primitivesOverview.areas.${key}.label`)}
									</Badge>
								</div>
								<CardDescription>
									{t(`docs.primitivesOverview.areas.${key}.description`)}
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<DocsTextLink
									href={t(`docs.primitivesOverview.areas.${key}.href`)}
								>
									{t(`docs.primitivesOverview.areas.${key}.cta`)}
								</DocsTextLink>
							</CardContent>
						</Card>
					))}
				</SectionContent>
			</DocsSectionPanel>
		</main>
	);
}
