"use client";

import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import {
	Badge,
	PageShell,
	Section,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
	Table,
} from "@/components";
import { ROUTE_FILE_RECOMMENDATIONS, ROUTE_PREVIEW_CARDS } from "@/constants";
import { DocsTextLink } from "@/features/docs/primitives";
import type { RoutePreviewRow, RouteRecommendationRow } from "@/types";

export default function RoutingDocsPage() {
	const columns = useMemo<ColumnDef<RouteRecommendationRow>[]>(
		() => [
			{
				accessorKey: "file",
				header: "Route file",
				cell: ({ row }) => (
					<div className="grid gap-1">
						<p className="text-sm font-semibold text-[color:var(--twc-text)]">
							<code>{row.original.file}</code>
						</p>
						<p className="text-xs text-[color:var(--twc-muted)]">
							{row.original.summary}
						</p>
					</div>
				),
			},
			{
				accessorKey: "status",
				header: "Status",
				enableSorting: false,
				cell: ({ row }) => (
					<Badge tone={row.original.tone}>{row.original.status}</Badge>
				),
			},
			{
				accessorKey: "reason",
				header: "Why it belongs here",
				enableSorting: false,
				cell: ({ row }) => (
					<p className="text-sm leading-relaxed text-[color:var(--twc-muted)]">
						{row.original.reason}
					</p>
				),
			},
		],
		[],
	);

	return (
		<PageShell
			className="px-6 pt-3 pb-6 lg:-mb-6 lg:px-8 lg:pt-4 lg:pb-6"
			width="wide"
		>
			<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="space-y-8">
					<Section className="surface-2 shadow-normal rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] p-7">
						<SectionHeader className="gap-3">
							<div className="space-y-3">
								<Badge tone="brand">Routing overview</Badge>
								<SectionTitle className="text-3xl">
									The routing layer should define failure behavior, not just URL
									structure.
								</SectionTitle>
								<SectionDescription className="max-w-4xl">
									This page should make one thing obvious: which App Router
									boundaries the product already depends on, what each one is
									responsible for, and how much of the app is allowed to survive
									when that boundary trips.
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent className="grid gap-4 xl:grid-cols-3">
							<div className="surface-3 grid gap-2 rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-3)] px-5 py-5">
								<p className="text-base font-semibold text-[color:var(--twc-text)]">
									Local failure first
								</p>
								<p className="text-sm leading-relaxed text-[color:var(--twc-muted)]">
									Keep runtime errors inside the smallest route segment that can
									recover safely without collapsing the whole app shell.
								</p>
							</div>
							<div className="surface-3 grid gap-2 rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-3)] px-5 py-5">
								<p className="text-base font-semibold text-[color:var(--twc-text)]">
									Operational fallbacks
								</p>
								<p className="text-sm leading-relaxed text-[color:var(--twc-muted)]">
									Fallback surfaces should explain what failed and offer one
									clear next action like retry, reload, or go home.
								</p>
							</div>
							<div className="surface-3 grid gap-2 rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-3)] px-5 py-5">
								<p className="text-base font-semibold text-[color:var(--twc-text)]">
									No decorative route files
								</p>
								<p className="text-sm leading-relaxed text-[color:var(--twc-muted)]">
									Only ship the route boundaries the app actually benefits from
									today. Completeness is not the goal.
								</p>
							</div>
						</SectionContent>
					</Section>

					<Section className="surface-2 shadow-normal rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] p-7">
						<SectionHeader className="gap-3">
							<div className="space-y-3">
								<Badge
									tone="info"
									variant="secondary"
								>
									Route file matrix
								</Badge>
								<SectionTitle className="text-3xl">
									Implement the boundaries the app already needs. Defer the
									rest.
								</SectionTitle>
								<SectionDescription className="max-w-4xl">
									The current contract is practical. <code>not-found.tsx</code>,{" "}
									<code>error.tsx</code>, and <code>global-error.tsx</code> are
									part of the product baseline.
									<code>loading.tsx</code> stays conditional.{" "}
									<code>template.tsx</code> and <code>default.tsx</code> stay
									out until the routing model actually demands them.
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent>
							<Table
								columns={columns}
								data={[...ROUTE_FILE_RECOMMENDATIONS]}
								enableSorting={false}
							/>
						</SectionContent>
					</Section>

					<Section className="surface-2 shadow-normal rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] p-7">
						<SectionHeader className="gap-3">
							<div className="space-y-3">
								<Badge tone="brand">Boundary index</Badge>
								<SectionTitle className="text-3xl">
									Choose the route file you need to reason about.
								</SectionTitle>
								<SectionDescription className="max-w-4xl">
									Use this section to decide which boundary belongs on the page
									you are building, how narrow the failure should stay, and when
									the fallback has to escalate to the whole shell.
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent className="grid gap-4 xl:grid-cols-3">
							{[
								{
									title: "not-found.tsx",
									description:
										"Missing route or missing record fallback where navigation can continue normally.",
								},
								{
									title: "error.tsx",
									description:
										"Segment-level runtime recovery that should not collapse the entire shell.",
								},
								{
									title: "global-error.tsx",
									description:
										"Root-level catastrophic fallback for failures that escape normal route boundaries.",
								},
							].map(card => (
								<div
									key={card.title}
									className="surface-3 grid gap-3 rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-3)] px-5 py-5"
								>
									<p className="text-base font-semibold text-[color:var(--twc-text)]">
										<code>{card.title}</code>
									</p>
									<p className="text-sm leading-relaxed text-[color:var(--twc-muted)]">
										{card.description}
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
								tone="neutral"
								variant="secondary"
							>
								Preview routes
							</Badge>
							<SectionTitle className="text-2xl">
								Open the implemented boundary previews directly.
							</SectionTitle>
							<SectionDescription>
								These routes are for safe inspection only. They should mirror
								the real fallback surfaces used by the actual route files.
							</SectionDescription>
						</div>
					</SectionHeader>
					<SectionContent className="min-h-0 flex-1">
						<div className="grid gap-3 overflow-auto pr-3 pb-3">
							{ROUTE_PREVIEW_CARDS.map((card: RoutePreviewRow) => (
								<div
									key={card.href}
									className="surface-3 grid gap-2 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-3)] px-4 py-4"
								>
									<div className="flex items-start justify-between gap-3">
										<p className="text-sm font-semibold text-[color:var(--twc-text)]">
											<code>{card.title}</code>
										</p>
										<Badge tone={card.tone}>{card.label}</Badge>
									</div>
									<DocsTextLink href={card.href}>
										Open full preview
									</DocsTextLink>
								</div>
							))}
						</div>
					</SectionContent>
				</Section>
			</div>
		</PageShell>
	);
}
