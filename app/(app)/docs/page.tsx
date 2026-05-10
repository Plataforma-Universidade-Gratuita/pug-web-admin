import Link from "next/link";

import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	PageShell,
	Section,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";

const DOCS_HOME_AREAS = [
	{
		href: "/docs/primitives",
		path: "/docs/primitives",
		title: "Primitive contracts",
		description:
			"Open this when the work is about variants, states, escalation boundaries, or shared interaction patterns.",
		badge: "System",
		tone: "info" as const,
	},
	{
		href: "/docs/routing",
		path: "/docs/routing",
		title: "Route boundaries",
		description:
			"Open this when the work is about fallback scope, route-file ownership, and what the app should preserve when a page, segment, or shell fails.",
		badge: "Runtime",
		tone: "success" as const,
	},
] as const;

const DOCS_HOME_PREVIEWS = [
	{
		href: "/docs/routing/not-found",
		path: "/docs/routing/not-found",
		title: "Missing-route and missing-record fallback surface.",
	},
	{
		href: "/docs/routing/error",
		path: "/docs/routing/error",
		title: "Segment-level runtime error surface with retry-focused recovery.",
	},
	{
		href: "/docs/routing/global-error",
		path: "/docs/routing/global-error",
		title: "Root fallback mirror for shell-level catastrophic failures.",
	},
] as const;

export default function DocsPage() {
	return (
		<PageShell
			className="px-6 pt-3 pb-6 lg:px-8 lg:pt-4 lg:pb-6"
			width="wide"
		>
			<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="space-y-8">
					<Section className="surface-2 shadow-normal rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] p-7">
						<SectionHeader className="gap-3">
							<div className="space-y-3">
								<Badge tone="brand">System docs</Badge>
								<SectionTitle className="text-3xl md:text-4xl">
									Use the docs to make product decisions, not style guesses.
								</SectionTitle>
								<SectionDescription className="max-w-4xl">
									The docs home owns two real jobs: component contracts and
									route fallback behavior. Everything here should point toward
									those live decisions and avoid turning into a loose index of
									stale examples.
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent className="grid gap-4 xl:grid-cols-2">
							<Card className="surface-3 border border-[color:var(--twc-border-3)] p-5">
								<CardHeader>
									<CardTitle>Primitive contract</CardTitle>
									<CardDescription>
										Use the primitive library when the question is about
										variants, states, escalation boundaries, or shared
										interaction patterns.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="surface-3 border border-[color:var(--twc-border-3)] p-5">
								<CardHeader>
									<CardTitle>Route fallback contract</CardTitle>
									<CardDescription>
										Use routing docs when the question is about failure scope,
										file ownership, and what the user should still be able to do
										after a route breaks.
									</CardDescription>
								</CardHeader>
							</Card>
						</SectionContent>
					</Section>

					<Section className="surface-2 shadow-normal rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] p-7">
						<SectionHeader className="gap-3">
							<div className="space-y-3">
								<Badge
									tone="info"
									variant="secondary"
								>
									Direct paths
								</Badge>
								<SectionTitle className="text-3xl">
									The docs should expose the real entry points.
								</SectionTitle>
								<SectionDescription className="max-w-4xl">
									If a page cannot be defended as a current source of truth, it
									should not stay in the docs tree. This home should send people
									only to the areas that still reflect the product.
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent className="grid gap-4">
							{DOCS_HOME_AREAS.map(area => (
								<Card
									key={area.href}
									className="surface-3 border border-[color:var(--twc-border-3)] p-5"
								>
									<CardContent className="grid gap-4 p-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
										<div className="space-y-2">
											<p className="text-sm font-semibold text-[color:var(--twc-text)]">
												<code>{area.path}</code>
											</p>
											<div className="space-y-2">
												<CardTitle className="text-base">
													{area.title}
												</CardTitle>
												<CardDescription>{area.description}</CardDescription>
											</div>
										</div>
										<div className="grid gap-3 lg:justify-items-end">
											<Badge tone={area.tone}>{area.badge}</Badge>
											<Link
												href={area.href}
												className="ty-sm-semibold text-[color:var(--color-brand)] underline underline-offset-4"
											>
												Open area
											</Link>
										</div>
									</CardContent>
								</Card>
							))}
						</SectionContent>
					</Section>
				</div>

				<Section className="surface-2 shadow-normal h-fit rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] p-7 lg:sticky lg:top-3 lg:h-[calc(100dvh-6.5rem)] lg:self-start">
					<SectionHeader className="gap-3">
						<div className="space-y-3">
							<Badge
								tone="warning"
								variant="secondary"
							>
								Safe previews
							</Badge>
							<SectionTitle className="text-2xl">
								Inspect boundary UI without breaking the app.
							</SectionTitle>
						</div>
					</SectionHeader>
					<SectionContent className="min-h-0 flex-1 lg:pb-0">
						<div className="grid gap-3 lg:max-h-full lg:overflow-auto lg:pr-2">
							{DOCS_HOME_PREVIEWS.map(preview => (
								<Card
									key={preview.href}
									className="surface-3 border border-[color:var(--twc-border-3)] p-4"
								>
									<CardHeader className="space-y-3">
										<Badge
											tone="warning"
											variant="secondary"
										>
											Preview route
										</Badge>
										<CardTitle className="text-base">
											<code>{preview.path}</code>
										</CardTitle>
										<CardDescription>{preview.title}</CardDescription>
									</CardHeader>
									<CardContent className="pt-0">
										<Link
											href={preview.href}
											className="ty-sm-semibold text-[color:var(--color-brand)] underline underline-offset-4"
										>
											Open preview
										</Link>
									</CardContent>
								</Card>
							))}
						</div>
					</SectionContent>
				</Section>
			</div>
		</PageShell>
	);
}
