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
import { RouteBoundaryScreen } from "@/features/routing/RouteBoundaryScreen";

type RouteFileStatus = "Implemented" | "Implement when needed" | "Skip for now";

type RouteFileRecommendation = {
	file: string;
	status: RouteFileStatus;
	tone: "success" | "warning" | "neutral";
	summary: string;
	reason: string;
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
		summary: "Cover failures that escape normal route-segment error boundaries.",
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
		summary: "Only useful when you explicitly need remount-on-navigation behavior.",
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
			<Section>
				<SectionHeader>
					<div className="space-y-3">
						<Badge tone="brand">Next.js App Router</Badge>
						<SectionTitle>Routing Files</SectionTitle>
						<SectionDescription>
							For this project, the practical baseline is
							{" "}
							<code>not-found.tsx</code>
							,
							{" "}
							<code>error.tsx</code>
							, and
							{" "}
							<code>global-error.tsx</code>
							. Add
							{" "}
							<code>loading.tsx</code>
							{" "}
							where a route actually waits on async work. Skip
							{" "}
							<code>template.tsx</code>
							{" "}
							and
							{" "}
							<code>default.tsx</code>
							{" "}
							unless the architecture changes.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="space-y-8">
					<section className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge tone="brand">Preview routes</Badge>
							<p className="ty-sm text-[color:var(--twc-muted)]">
								Each implemented screen has a matching preview entry so people can
								inspect the real fallback UI.
							</p>
						</div>

						<div className="grid gap-4 xl:grid-cols-3">
							<Card className="flex h-full flex-col gap-4 overflow-hidden p-4">
								<div className="flex items-center justify-between gap-3">
									<CardTitle>
										<code>not-found.tsx</code>
									</CardTitle>
									<Badge tone="success">Live preview</Badge>
								</div>
								<CardDescription>
									Triggers the real 404 boundary through
									{" "}
									<code>notFound()</code>
									.
								</CardDescription>
								<RouteBoundaryScreen
									variant="not-found"
									mode="preview"
								/>
								<CardContent className="pt-0">
									<a
										href="/docs/routing/previews/not-found"
										className="ty-sm-semibold text-[color:var(--color-brand)] underline underline-offset-4"
									>
										Open full preview
									</a>
								</CardContent>
							</Card>

							<Card className="flex h-full flex-col gap-4 overflow-hidden p-4">
								<div className="flex items-center justify-between gap-3">
									<CardTitle>
										<code>error.tsx</code>
									</CardTitle>
									<Badge tone="success">Live preview</Badge>
								</div>
								<CardDescription>
									Throws a route error and lets the implemented boundary recover.
								</CardDescription>
								<RouteBoundaryScreen
									variant="error"
									mode="preview"
									error={
										new Error(
											"Preview only: this route failed before it could finish rendering.",
										)
									}
								/>
								<CardContent className="pt-0">
									<a
										href="/docs/routing/previews/error"
										className="ty-sm-semibold text-[color:var(--color-brand)] underline underline-offset-4"
									>
										Open full preview
									</a>
								</CardContent>
							</Card>

							<Card className="flex h-full flex-col gap-4 overflow-hidden p-4">
								<div className="flex items-center justify-between gap-3">
									<CardTitle>
										<code>global-error.tsx</code>
									</CardTitle>
									<Badge tone="warning">Visual preview</Badge>
								</div>
								<CardDescription>
									Shows the same UI used by the root boundary. The real file only
									appears when the app shell itself fails.
								</CardDescription>
								<RouteBoundaryScreen
									variant="global-error"
									mode="preview"
									error={
										new Error(
											"Preview only: the root app shell would need to fail for the real boundary to appear.",
										)
									}
								/>
								<CardContent className="pt-0">
									<a
										href="/docs/routing/previews/global-error"
										className="ty-sm-semibold text-[color:var(--color-brand)] underline underline-offset-4"
									>
										Open full preview
									</a>
								</CardContent>
							</Card>
						</div>
					</section>

					{routeFileGroups.map(group => {
						const items = routeFileRecommendations.filter(
							recommendation => recommendation.status === group,
						);

						return (
							<section
								key={group}
								className="space-y-4"
							>
								<div className="flex items-center gap-3">
									<Badge tone={statusTone[group]}>{group}</Badge>
									<p className="ty-sm text-[color:var(--twc-muted)]">
										{group === "Implemented"
											? "These files are now implemented in the app and previewable from this page."
											: group === "Implement when needed"
												? "Add only where route behavior justifies it."
												: "Specialized files that are unnecessary in the current structure."}
									</p>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									{items.map(item => (
										<Card
											key={item.file}
											className="flex h-full flex-col justify-between"
										>
											<CardHeader className="space-y-3">
												<div className="flex items-center justify-between gap-3">
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
								</div>
							</section>
						);
					})}
				</SectionContent>
			</Section>
		</main>
	);
}
