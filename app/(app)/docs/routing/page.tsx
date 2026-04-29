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
	ROUTE_FILE_GROUPS,
	ROUTE_FILE_RECOMMENDATIONS,
	ROUTE_FILE_STATUS_TONE,
	ROUTE_PREVIEW_CARDS,
} from "@/constants/docs";

import {
	DocsSectionPanel,
	DocsTextLink,
} from "@/features/docs/primitives";

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
					{ROUTE_PREVIEW_CARDS.map(card => (
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

			{ROUTE_FILE_GROUPS.map(group => {
				const items = ROUTE_FILE_RECOMMENDATIONS.filter(
					recommendation => recommendation.status === group,
				);

				return (
					<DocsSectionPanel key={group}>
						<SectionHeader>
							<div className="space-y-3">
								<Badge tone={ROUTE_FILE_STATUS_TONE[group]}>{group}</Badge>
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
