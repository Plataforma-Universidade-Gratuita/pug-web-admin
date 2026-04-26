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
	DocsSectionPanel,
	DocsTextLink,
} from "../../../../features/docs/primitives";

type RouteFileStatus = "Implemented" | "Implement when needed" | "Skip for now";

type RouteFileRecommendation = {
	file: string;
	status: RouteFileStatus;
	tone: "success" | "warning" | "neutral";
	summary: string;
	reason: string;
};

type RoutePreviewCard = {
	href: string;
	title: string;
	tone: "success" | "warning";
	label: string;
	description: string;
	note: string;
};

const routeFileRecommendations: RouteFileRecommendation[] = [
	{
		file: "not-found.tsx",
		status: "Implemented",
		tone: "success",
		summary: "Give missing routes and missing records a proper fallback.",
		reason:
			"This is the most broadly useful routing file. It improves broken links, bad URLs, and resource-level 404 states without needing parallel routes or advanced layout behavior.",
	},
	{
		file: "error.tsx",
		status: "Implemented",
		tone: "success",
		summary: "Add segment-level recovery for normal runtime failures.",
		reason:
			"This is the right boundary for app-area failures such as broken fetches, rendering exceptions, or unexpected client/server state issues inside a route segment.",
	},
	{
		file: "global-error.tsx",
		status: "Implemented",
		tone: "success",
		summary:
			"Cover failures that escape normal route-segment error boundaries.",
		reason:
			"Use a minimal global fallback for catastrophic layout-level failures. It should stay simple, branded, and able to recover with a hard refresh or a link back into the app.",
	},
	{
		file: "loading.tsx",
		status: "Implement when needed",
		tone: "warning",
		summary: "Use it only where the route actually suspends or streams data.",
		reason:
			"Loading files are worth adding on data-heavy pages, but they should follow real async boundaries. Adding them everywhere up front usually creates noise instead of better UX.",
	},
	{
		file: "template.tsx",
		status: "Skip for now",
		tone: "neutral",
		summary:
			"Only useful when you explicitly need remount-on-navigation behavior.",
		reason:
			"Templates reset state and effects on navigation. That is a specialized tool for things like per-navigation animations or deliberate state resets, not a default routing primitive.",
	},
	{
		file: "default.tsx",
		status: "Skip for now",
		tone: "neutral",
		summary: "Relevant only if the app adopts parallel routes.",
		reason:
			"This file exists to provide fallback content for unmatched parallel route slots. Without parallel routes, it adds no value and just increases maintenance surface.",
	},
];

const routePreviewCards: RoutePreviewCard[] = [
	{
		href: "/docs/routing/previews/not-found",
		title: "not-found.tsx",
		tone: "success",
		label: "Live preview",
		description:
			"Renders the same 404 fallback UI used when a route or record does not resolve.",
		note: "Use this route to inspect missing-page and missing-record behavior without forcing a real broken link first.",
	},
	{
		href: "/docs/routing/previews/error",
		title: "error.tsx",
		tone: "success",
		label: "Live preview",
		description:
			"Uses the implemented segment error boundary with retry-focused UI.",
		note: "This preview exists because real route failures are not a safe way to inspect the design contract during normal development.",
	},
	{
		href: "/docs/routing/previews/global-error",
		title: "global-error.tsx",
		tone: "warning",
		label: "Visual preview",
		description:
			"Shows the same UI used by the root boundary. The real file only appears when the app shell itself fails.",
		note: "Treat this as a design mirror of the real root fallback, not a flow you should trigger manually in normal work.",
	},
];

const statusTone: Record<RouteFileStatus, "success" | "warning" | "neutral"> = {
	Implemented: "success",
	"Implement when needed": "warning",
	"Skip for now": "neutral",
};

const routeFileGroups: RouteFileStatus[] = [
	"Implemented",
	"Implement when needed",
	"Skip for now",
];

export default function RoutingDocsPage() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<DocsSectionPanel>
				<SectionHeader>
					<div className="max-w-3xl space-y-3">
						<Badge tone="brand">Next.js App Router</Badge>
						<SectionTitle>Overview</SectionTitle>
						<SectionDescription>
							For this project, the practical baseline is{" "}
							<code>not-found.tsx</code>, <code>error.tsx</code>, and{" "}
							<code>global-error.tsx</code>. Add <code>loading.tsx</code> where
							a route actually waits on async work. Skip{" "}
							<code>template.tsx</code> and <code>default.tsx</code> unless the
							architecture changes.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 md:grid-cols-3">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Implemented now</CardTitle>
							<CardDescription>
								`not-found.tsx`, `error.tsx`, and `global-error.tsx` form the
								current routing baseline.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Deferred files</CardTitle>
							<CardDescription>
								`loading.tsx` stays conditional, while `template.tsx` and
								`default.tsx` remain out until the routing model changes.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Why previews exist</CardTitle>
							<CardDescription>
								Each implemented boundary has a safe route so people can inspect
								the real fallback UI without forcing a real app failure.
							</CardDescription>
						</CardHeader>
					</Card>
				</SectionContent>
			</DocsSectionPanel>

			<DocsSectionPanel>
				<SectionHeader>
					<div className="space-y-3">
						<Badge tone="brand">Preview routes</Badge>
						<SectionTitle>Boundary Previews</SectionTitle>
						<SectionDescription>
							The preview routes below are the only place you need to open if
							you want to inspect the implemented fallback screens.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 xl:grid-cols-3">
					{routePreviewCards.map(card => (
						<Card
							key={card.href}
							className="flex h-full flex-col justify-between p-4"
						>
							<CardHeader className="space-y-3">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<CardTitle>
										<code>{card.title}</code>
									</CardTitle>
									<Badge tone={card.tone}>{card.label}</Badge>
								</div>
								<CardDescription>{card.description}</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<p className="ty-sm text-[color:var(--twc-muted)]">
									{card.note}
								</p>
							</CardContent>
							<CardFooter className="pt-0">
								<DocsTextLink href={card.href}>Open full preview</DocsTextLink>
							</CardFooter>
						</Card>
					))}
				</SectionContent>
			</DocsSectionPanel>

			{routeFileGroups.map(group => {
				const items = routeFileRecommendations.filter(
					recommendation => recommendation.status === group,
				);

				return (
					<DocsSectionPanel key={group}>
						<SectionHeader>
							<div className="space-y-3">
								<Badge tone={statusTone[group]}>{group}</Badge>
								<SectionTitle>{group}</SectionTitle>
								<SectionDescription>
									{group === "Implemented"
										? "These files are implemented in the app and previewable from the section above."
										: group === "Implement when needed"
											? "Add only where route behavior justifies it."
											: "Specialized files that are unnecessary in the current structure."}
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent className="grid gap-4 lg:grid-cols-2">
							{items.map(item => (
								<Card
									key={item.file}
									className="flex h-full flex-col justify-between p-4"
								>
									<CardHeader className="space-y-3">
										<div className="flex flex-wrap items-center justify-between gap-3">
											<CardTitle>
												<code>{item.file}</code>
											</CardTitle>
											<Badge tone={item.tone}>{item.status}</Badge>
										</div>
										<CardDescription>{item.summary}</CardDescription>
									</CardHeader>
									<CardContent className="pt-0">
										<p className="ty-sm text-[color:var(--twc-muted)]">
											{item.reason}
										</p>
									</CardContent>
								</Card>
							))}
						</SectionContent>
					</DocsSectionPanel>
				);
			})}
		</main>
	);
}
