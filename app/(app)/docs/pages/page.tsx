"use client";

import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";

import {
	PagePatternLegend,
	PagePatternNote,
	PagePatternRecommendation,
	PagePatternTitle,
	pagePatternDefinitions,
} from "../../../../features/docs/page-patterns/PagePatternShowcase";
import {
	DocsSectionPanel,
	DocsTextLink,
} from "../../../../features/docs/primitives";

const alternativePatterns = pagePatternDefinitions.filter(
	pattern => pattern.slug !== "section-stack",
);

export default function PagesDocsPage() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<DocsSectionPanel>
				<SectionHeader>
					<div className="max-w-3xl space-y-3">
						<Badge tone="brand">Application page language</Badge>
						<SectionTitle>Overview</SectionTitle>
						<SectionDescription>
							`/docs/primitives` already hints at a usable page system. The
							extracted default is a centered page shell with one clear intro
							and stacked sections underneath it. The alternatives below keep
							the same design tokens and components, but shift the composition
							for denser or record-focused screens.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="space-y-8">
					<PagePatternRecommendation />
					<PagePatternLegend />
					<PagePatternNote />
				</SectionContent>
			</DocsSectionPanel>

			<DocsSectionPanel>
				<SectionHeader>
					<div className="space-y-3">
						<PagePatternTitle slug="section-stack" />
						<SectionDescription>
							This is the app-wide baseline. It keeps the shell calm, creates
							default first-layer versus second-layer separation, and lets cards
							carry the real density.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="space-y-4">
					<div className="grid gap-4 lg:grid-cols-3">
						<Card className="p-4">
							<CardHeader>
								<CardTitle>Top structure</CardTitle>
								<CardDescription>
									One intro area at the top, then stacked sections below it.
									Each section owns one problem, its actions, and a smaller
									content set.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="p-4">
							<CardHeader>
								<CardTitle>Surface rhythm</CardTitle>
								<CardDescription>
									Use a darker section surface behind lighter cards by default.
									The third layer stays optional instead of mandatory.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="p-4">
							<CardHeader>
								<CardTitle>Best fit</CardTitle>
								<CardDescription>
									Use it for module overviews, calmer browse pages, dashboards,
									settings hubs, and most non-operational screens.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
					<DocsTextLink href="/docs/pages/previews/section-stack">
						Open section-stack preview
					</DocsTextLink>
				</SectionContent>
			</DocsSectionPanel>

			<DocsSectionPanel>
				<SectionHeader>
					<div className="space-y-3">
						<Badge tone="info">Alternative directions</Badge>
						<SectionTitle>Other Valid Page Looks</SectionTitle>
						<SectionDescription>
							These two options stay within the same component system, but
							change how the page prioritizes action density and persistent
							context.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="space-y-6">
					{alternativePatterns.map(pattern => (
						<Card
							key={pattern.slug}
							className="p-4 sm:p-6"
						>
							<CardHeader className="space-y-4">
								<PagePatternTitle slug={pattern.slug} />
								<CardDescription>
									{pattern.slug === "operations-workspace"
										? "Use this when the page behaves like a tool: filtering, reviewing, and changing status quickly."
										: "Use this when a single record needs stable context while the user reads or edits related information."}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-0">
								<div className="grid gap-4 lg:grid-cols-2">
									<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
										<p className="ty-sm-semibold">Best for</p>
										<p className="ty-helper mt-1 text-[color:var(--twc-muted)]">
											{pattern.bestFor}
										</p>
									</div>
									<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
										<p className="ty-sm-semibold">Tradeoff</p>
										<p className="ty-helper mt-1 text-[color:var(--twc-muted)]">
											{pattern.tradeoff}
										</p>
									</div>
								</div>
							</CardContent>
							<CardFooter className="pt-0">
								<DocsTextLink href={`/docs/pages/previews/${pattern.slug}`}>
									Open {pattern.name.toLowerCase()} preview
								</DocsTextLink>
							</CardFooter>
						</Card>
					))}
				</SectionContent>
			</DocsSectionPanel>

			<DocsSectionPanel>
				<SectionHeader>
					<div className="space-y-3">
						<Badge tone="success">Decision rules</Badge>
						<SectionTitle>How To Pick A Pattern</SectionTitle>
						<SectionDescription>
							These rules should stay consistent with the current app
							architecture and the preview routes linked above.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 lg:grid-cols-3">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Default to Section Stack</CardTitle>
							<CardDescription>
								Most module overviews, calmer browse pages, and lighter
								reference surfaces should start here.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Promote Dense Collections</CardTitle>
							<CardDescription>
								Collection screens that search, filter, triage, or change status
								frequently should move into an operations workspace.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Reserve Split Detail</CardTitle>
							<CardDescription>
								Use the split detail layout when a single record deserves
								persistent context rather than a short overlay.
							</CardDescription>
						</CardHeader>
					</Card>
				</SectionContent>
			</DocsSectionPanel>
		</main>
	);
}
