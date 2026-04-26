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

const primitivesAreas = [
	{
		href: "/docs/primitives/actions",
		label: "Actions",
		title: "Actions",
		description: "Buttons, toggles, and other actionable primitives.",
	},
	{
		href: "/docs/primitives/display",
		label: "Display",
		title: "Display",
		description: "Cards, badges, icons, and visual display elements.",
	},
	{
		href: "/docs/primitives/forms",
		label: "Forms",
		title: "Forms",
		description: "Inputs, selects, checkboxes, and form controls.",
	},
	{
		href: "/docs/primitives/navigation",
		label: "Navigation",
		title: "Navigation",
		description: "Tabs, accordions, breadcrumbs, and navigation aids.",
	},
	{
		href: "/docs/primitives/overlays",
		label: "Overlays",
		title: "Overlays",
		description: "Dialogs, popovers, tooltips, and overlay components.",
	},
	{
		href: "/docs/primitives/structure",
		label: "Structure",
		title: "Structure",
		description: "Layout, scroll areas, and structural primitives.",
	},
];

const sectionPanelClassName =
	"surface-2 shadow-weak rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] p-6";

export default function PrimitivesDocsPage() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<Section className={sectionPanelClassName}>
				<SectionHeader>
					<div className="max-w-3xl space-y-3">
						<Badge tone="brand">Primitives</Badge>
						<SectionTitle>Primitives Overview</SectionTitle>
						<SectionDescription>
							This section provides a reference for all shared UI primitives.
							Browse the categories below to explore actionable, display, form,
							navigation, overlay, and structure components.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 md:grid-cols-3">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Organized by Role</CardTitle>
							<CardDescription>
								Primitives are grouped by their primary UI role for clarity and
								discoverability.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Consistent Patterns</CardTitle>
							<CardDescription>
								All primitives follow the same design system and interaction
								patterns.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="p-4">
						<CardHeader>
							<CardTitle>Explore by Category</CardTitle>
							<CardDescription>
								Use the cards below to jump into each primitive category and see
								detailed docs.
							</CardDescription>
						</CardHeader>
					</Card>
				</SectionContent>
			</Section>

			<Section className={sectionPanelClassName}>
				<SectionHeader>
					<div className="space-y-3">
						<Badge tone="info">Categories</Badge>
						<SectionTitle>Primitive Categories</SectionTitle>
						<SectionDescription>
							Each category contains related primitives. Click a card to view
							all primitives in that group.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 xl:grid-cols-3">
					{primitivesAreas.map(area => (
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
		</main>
	);
}
