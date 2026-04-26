import Link from "next/link";

import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Section,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";

const docsAreas = [
	{
		href: "/docs/components",
		label: "Primitives",
		title: "Components",
		description:
			"Browse the shared primitive library, states, usage notes, and visual contracts.",
	},
	{
		href: "/docs/routing",
		label: "App Router",
		title: "Routing",
		description:
			"Review the implemented Next.js route boundaries and inspect their real preview screens.",
	},
	{
		href: "/docs/pages",
		label: "Page language",
		title: "Page Patterns",
		description:
			"Compare the default section stack against denser and record-focused page compositions.",
	},
] as const;

const sectionPanelClassName =
	"surface-2 shadow-weak rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] p-6";

export default function DocsPage() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<Section className={sectionPanelClassName}>
				<SectionHeader>
					<div className="max-w-3xl space-y-3">
						<Badge tone="brand">Internal reference</Badge>
						<SectionTitle>Overview</SectionTitle>
						<SectionDescription>
							This route should behave like the default app page pattern:
							a calm intro at the top, then stacked sections that each own one
							clear topic. From here, the rest of the docs branch splits into
							primitive references, routing fallbacks, and page-level guidance.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 md:grid-cols-3">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Default Pattern</CardTitle>
							<CardDescription>
								`/docs` is a module overview, so `Section Stack` is the right fit.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Scope</CardTitle>
							<CardDescription>
								Keep top-level docs pages calm and explanatory. Push density down
								into the deeper operational or preview pages when needed.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Navigation</CardTitle>
							<CardDescription>
								Use this page as the stable entry point for the docs area instead
								of redirecting immediately into one subsection.
							</CardDescription>
						</CardHeader>
					</Card>
				</SectionContent>
			</Section>

			<Section className={sectionPanelClassName}>
				<SectionHeader>
					<div className="space-y-3">
						<Badge tone="info">Explore</Badge>
						<SectionTitle>Docs Areas</SectionTitle>
						<SectionDescription>
							Each subsection has a different job, but they all stay inside the
							same component system and overall page language.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 xl:grid-cols-3">
					{docsAreas.map(area => (
						<Card
							key={area.href}
							className="flex h-full flex-col justify-between p-4"
						>
							<CardHeader className="space-y-3">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<CardTitle>{area.title}</CardTitle>
									<Badge tone="neutral">{area.label}</Badge>
								</div>
								<CardDescription>{area.description}</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<Link
									href={area.href}
									className="ty-sm-semibold text-[color:var(--color-brand)] underline underline-offset-4"
								>
									Open {area.title.toLowerCase()}
								</Link>
							</CardContent>
						</Card>
					))}
				</SectionContent>
			</Section>

			<Section className={sectionPanelClassName}>
				<SectionHeader>
					<div className="space-y-3">
						<Badge tone="success">Current guidance</Badge>
						<SectionTitle>How Pages Should Layer</SectionTitle>
						<SectionDescription>
							The docs branch now mirrors the page-pattern and surface rules
							already accepted for the rest of the app.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 lg:grid-cols-3">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Section Stack First</CardTitle>
							<CardDescription>
								Use stacked sections for module overviews, landing pages, and calm
								reference pages like this one.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Promote Only When Needed</CardTitle>
							<CardDescription>
								Move into denser workspaces or split-detail layouts only when the
								job of the page becomes operational or record-centric.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Use Surface Contrast by Default</CardTitle>
							<CardDescription>
								Keep darker surfaces farther back and lighter surfaces closer to
								the user. Sections do not always need a different surface, but
								cards should at least separate from their immediate background.
							</CardDescription>
						</CardHeader>
					</Card>
				</SectionContent>
			</Section>
		</main>
	);
}
