"use client";

import type { ReactNode } from "react";

import {
	ArrowRight,
	CalendarRange,
	FileText,
	Filter,
	FolderKanban,
	LayoutPanelLeft,
	Plus,
	Search,
	Sparkles,
	Users,
} from "lucide-react";

import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Icon,
	Input,
	Section,
	SectionActions,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
	Separator,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components";

export type PagePatternSlug =
	| "section-stack"
	| "operations-workspace"
	| "split-detail";

type PagePatternDefinition = {
	slug: PagePatternSlug;
	name: string;
	label: string;
	tone: "brand" | "info" | "success";
	summary: string;
	bestFor: string;
	tradeoff: string;
};

type PagePatternFrameProps = {
	slug: PagePatternSlug;
};

type PageIntroSectionProps = {
	eyebrow: string;
	tone: "brand" | "info" | "success";
	title: string;
	description: string;
	actions?: ReactNode;
	meta?: ReactNode;
	children?: ReactNode;
};

const pageSectionClassName =
	"surface-2 shadow-weak rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] p-6";

const pageStickyRailClassName =
	"surface-2 shadow-weak h-fit rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] p-4 xl:sticky xl:top-4";

export const pagePatternDefinitions: PagePatternDefinition[] = [
	{
		slug: "section-stack",
		name: "Section Stack",
		label: "Recommended default",
		tone: "brand",
		summary:
			"A centered shell with one strong page header, then stacked sections that each own their actions and card grid.",
		bestFor:
			"Most overview, dashboard, browse, and moderate-detail pages across the app.",
		tradeoff:
			"It stays calm and legible, but it is less dense than a workflow-heavy operations surface.",
	},
	{
		slug: "operations-workspace",
		name: "Operations Workspace",
		label: "Dense alternative",
		tone: "info",
		summary:
			"A tighter workspace with filters, tabs, queue-like content, and a supporting side rail.",
		bestFor:
			"High-frequency admin pages where people triage, review, and move items quickly.",
		tradeoff:
			"It raises information density, so it should stay scoped to operational screens.",
	},
	{
		slug: "split-detail",
		name: "Split Detail",
		label: "Detail alternative",
		tone: "success",
		summary:
			"A record-focused page with a persistent summary rail on the left and stacked detail sections on the right.",
		bestFor:
			"Entity detail, settings, and case-management flows where context must stay visible while editing.",
		tradeoff:
			"It works poorly for broad overviews because the left rail competes for width.",
	},
];

function PageIntroSection({
	eyebrow,
	tone,
	title,
	description,
	actions,
	meta,
	children,
}: PageIntroSectionProps) {
	return (
		<Section className={pageSectionClassName}>
			<SectionHeader>
				<div className="max-w-3xl space-y-3">
					{meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}
					<Badge tone={tone}>{eyebrow}</Badge>
					<div className="space-y-2">
						<SectionTitle className="text-3xl sm:text-4xl">
							{title}
						</SectionTitle>
						<SectionDescription>{description}</SectionDescription>
					</div>
				</div>
				{actions ? <SectionActions>{actions}</SectionActions> : null}
			</SectionHeader>
			{children ? <SectionContent>{children}</SectionContent> : null}
		</Section>
	);
}

function StatCard({
	label,
	value,
	detail,
}: {
	label: string;
	value: string;
	detail: string;
}) {
	return (
		<Card className="shadow-weak h-full p-4">
			<CardHeader className="space-y-2">
				<CardDescription>{label}</CardDescription>
				<CardTitle className="text-2xl">{value}</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<p className="ty-helper text-[color:var(--twc-muted)]">{detail}</p>
			</CardContent>
		</Card>
	);
}

function SectionStackPreview() {
	return (
		<>
			<PageIntroSection
				eyebrow="Default app direction"
				tone="brand"
				title="Program overview"
				description="The default page stays calm at the shell level: one clear intro up top, then stacked sections that each own one topic, their actions, and a smaller set of cards."
				actions={
					<>
						<Button
							usage="secondary"
							variant="ghost"
							leadingIcon={
								<Icon
									icon={FileText}
									className="h-4 w-4"
								/>
							}
						>
							Export snapshot
						</Button>
						<Button
							usage="primary"
							variant="flat"
							leadingIcon={
								<Icon
									icon={Plus}
									className="h-4 w-4"
								/>
							}
						>
							Add school
						</Button>
					</>
				}
			>
				<div className="grid gap-4 md:grid-cols-3">
					<StatCard
						label="Active schools"
						value="18"
						detail="3 are awaiting approval updates this week."
					/>
					<StatCard
						label="Enrollment window"
						value="12 days"
						detail="Next milestone closes on May 8."
					/>
					<StatCard
						label="Completion"
						value="74%"
						detail="Up from 68% after the last support cycle."
					/>
				</div>
			</PageIntroSection>

			<Section className={pageSectionClassName}>
				<SectionHeader>
					<div className="space-y-1">
						<SectionTitle>Priority work</SectionTitle>
						<SectionDescription>
							The page header stays broad. The real density lives inside the
							section that owns the work.
						</SectionDescription>
					</div>
					<SectionActions>
						<Button
							usage="secondary"
							variant="ghost"
							trailingIcon={
								<Icon
									icon={ArrowRight}
									className="h-4 w-4"
								/>
							}
						>
							Open backlog
						</Button>
					</SectionActions>
				</SectionHeader>
				<SectionContent className="grid gap-4 lg:grid-cols-2">
					<Card className="shadow-weak h-full p-4">
						<CardHeader>
							<CardTitle>Schools waiting for review</CardTitle>
							<CardDescription>
								Dense detail stays close to the user in lighter cards inside the
								section surface.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 pt-0">
							<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-3">
								<p className="ty-sm-semibold">Escola Horizonte</p>
								<p className="ty-helper text-[color:var(--twc-muted)]">
									Enrollment cap changed yesterday.
								</p>
							</div>
							<div className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-3">
								<p className="ty-sm-semibold">Instituto Delta</p>
								<p className="ty-helper text-[color:var(--twc-muted)]">
									Documents uploaded, missing final approval.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="shadow-weak h-full p-4">
						<CardHeader>
							<CardTitle>Upcoming milestones</CardTitle>
							<CardDescription>
								Mix summaries, lists, and secondary actions inside cards instead
								of expanding the page shell.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 pt-0">
							<div className="flex items-start justify-between gap-3 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-3">
								<div>
									<p className="ty-sm-semibold">Funding validation</p>
									<p className="ty-helper text-[color:var(--twc-muted)]">
										Friday, 14:00
									</p>
								</div>
								<Badge tone="warning">Attention</Badge>
							</div>
							<div className="flex items-start justify-between gap-3 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-3">
								<div>
									<p className="ty-sm-semibold">Partner sync</p>
									<p className="ty-helper text-[color:var(--twc-muted)]">
										Monday, 09:30
									</p>
								</div>
								<Badge tone="success">Ready</Badge>
							</div>
						</CardContent>
					</Card>
				</SectionContent>
			</Section>

			<Section className={pageSectionClassName}>
				<SectionHeader>
					<div className="space-y-1">
						<SectionTitle>Recent signals</SectionTitle>
						<SectionDescription>
							Sections can stay broad while cards handle the smaller story
							slices.
						</SectionDescription>
					</div>
				</SectionHeader>
				<SectionContent className="grid gap-4 md:grid-cols-3">
					{[
						{
							title: "Attendance risk",
							copy: "Three schools dropped below the weekly participation threshold.",
						},
						{
							title: "Partner response",
							copy: "Average response time improved after the new notification flow.",
						},
						{
							title: "Data quality",
							copy: "One import feed still needs manual confirmation before publish.",
						},
					].map(item => (
						<Card
							key={item.title}
							className="shadow-weak h-full p-4"
						>
							<CardHeader>
								<CardTitle>{item.title}</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<p className="ty-helper text-[color:var(--twc-muted)]">
									{item.copy}
								</p>
							</CardContent>
						</Card>
					))}
				</SectionContent>
			</Section>
		</>
	);
}

function OperationsWorkspacePreview() {
	return (
		<>
			<PageIntroSection
				eyebrow="Operations-heavy alternative"
				tone="info"
				title="Attendance operations"
				description="This pattern is still a page, but the primary work surface is denser. Use it when the user needs filters, queues, and rapid state changes near the top."
				meta={
					<>
						<Badge tone="info">Live workspace</Badge>
						<Badge
							tone="warning"
							variant="outline"
						>
							4 items need attention
						</Badge>
					</>
				}
				actions={
					<>
						<Button
							usage="secondary"
							variant="ghost"
							leadingIcon={
								<Icon
									icon={Filter}
									className="h-4 w-4"
								/>
							}
						>
							Saved filters
						</Button>
						<Button
							usage="primary"
							variant="flat"
							leadingIcon={
								<Icon
									icon={Plus}
									className="h-4 w-4"
								/>
							}
						>
							Create batch
						</Button>
					</>
				}
			>
				<div className="grid gap-4 md:grid-cols-3">
					<StatCard
						label="Pending review"
						value="28"
						detail="11 arrived in the last hour."
					/>
					<StatCard
						label="Escalations"
						value="4"
						detail="Two are blocked by missing partner confirmation."
					/>
					<StatCard
						label="Avg. resolution"
						value="17m"
						detail="Down from 24m after queue cleanup."
					/>
				</div>
			</PageIntroSection>

			<Section className={pageSectionClassName}>
				<SectionHeader>
					<div className="space-y-1">
						<SectionTitle>Queue workspace</SectionTitle>
						<SectionDescription>
							The workspace stays inside a section surface, but the cards inside
							it move closer to the user and carry the operational density.
						</SectionDescription>
					</div>
					<SectionActions>
						<Button
							usage="secondary"
							variant="ghost"
							trailingIcon={
								<Icon
									icon={ArrowRight}
									className="h-4 w-4"
								/>
							}
						>
							Open playbook
						</Button>
					</SectionActions>
				</SectionHeader>
				<SectionContent className="space-y-6">
					<Card className="shadow-weak p-4">
						<CardContent className="grid gap-3 pt-0 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
							<Input
								type="search"
								defaultValue="North"
								leadingIcon={
									<Icon
										icon={Search}
										className="h-4 w-4"
									/>
								}
							/>
							<Button
								usage="secondary"
								variant="ghost"
							>
								School cluster
							</Button>
							<Button
								usage="secondary"
								variant="ghost"
							>
								Only overdue
							</Button>
						</CardContent>
					</Card>

					<Tabs defaultValue="incoming">
						<TabsList>
							<TabsTrigger value="incoming">Incoming</TabsTrigger>
							<TabsTrigger value="processing">Processing</TabsTrigger>
							<TabsTrigger value="history">History</TabsTrigger>
						</TabsList>

						{(["incoming", "processing", "history"] as const).map(value => (
							<TabsContent
								key={value}
								value={value}
								className="pt-4"
							>
								<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
									<Card className="shadow-weak p-4">
										<CardHeader>
											<CardTitle>
												{value === "incoming"
													? "Queue items"
													: value === "processing"
														? "Active work"
														: "Recent resolutions"}
											</CardTitle>
											<CardDescription>
												Filters, tabs, and lists move to the top here because
												the page behaves like a tool.
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-3 pt-0">
											{[
												"North cluster attendance mismatch",
												"Manual confirmation for Escola Horizonte",
												"Partner exception for Instituto Delta",
											].map(item => (
												<div
													key={`${value}-${item}`}
													className="flex items-start justify-between gap-3 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-3"
												>
													<div className="space-y-1">
														<p className="ty-sm-semibold">{item}</p>
														<p className="ty-helper text-[color:var(--twc-muted)]">
															Assigned to ops pod B. Last touched 8 minutes ago.
														</p>
													</div>
													<Badge
														tone={value === "history" ? "success" : "info"}
													>
														{value === "history" ? "Closed" : "Open"}
													</Badge>
												</div>
											))}
										</CardContent>
									</Card>

									<div className="space-y-4">
										<Card className="shadow-weak p-4">
											<CardHeader>
												<CardTitle>SLA today</CardTitle>
											</CardHeader>
											<CardContent className="space-y-3 pt-0">
												<div className="flex items-center justify-between">
													<span className="ty-helper text-[color:var(--twc-muted)]">
														Within target
													</span>
													<span className="ty-sm-semibold">91%</span>
												</div>
												<Separator />
												<div className="flex items-center justify-between">
													<span className="ty-helper text-[color:var(--twc-muted)]">
														Average age
													</span>
													<span className="ty-sm-semibold">42m</span>
												</div>
											</CardContent>
										</Card>

										<Card className="shadow-weak p-4">
											<CardHeader>
												<CardTitle>Guidance</CardTitle>
											</CardHeader>
											<CardContent className="space-y-3 pt-0">
												<p className="ty-helper text-[color:var(--twc-muted)]">
													Keep the side rail narrow and tactical. It should
													support the queue, not compete with it.
												</p>
												<Button
													usage="info"
													variant="ghost"
													trailingIcon={
														<Icon
															icon={ArrowRight}
															className="h-4 w-4"
														/>
													}
												>
													Open playbook
												</Button>
											</CardContent>
										</Card>
									</div>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</SectionContent>
			</Section>
		</>
	);
}

function SplitDetailPreview() {
	return (
		<>
			<PageIntroSection
				eyebrow="Detail-focused alternative"
				tone="success"
				title="School partner profile"
				description="This direction keeps stable record context visible while the right column handles detail, audit trail, and follow-up work."
				meta={
					<>
						<Badge tone="success">Active</Badge>
						<Badge
							tone="neutral"
							variant="outline"
						>
							Last sync 12 minutes ago
						</Badge>
					</>
				}
				actions={
					<>
						<Button
							usage="secondary"
							variant="ghost"
							leadingIcon={
								<Icon
									icon={CalendarRange}
									className="h-4 w-4"
								/>
							}
						>
							Schedule visit
						</Button>
						<Button
							usage="primary"
							variant="flat"
							leadingIcon={
								<Icon
									icon={Users}
									className="h-4 w-4"
								/>
							}
						>
							Manage contacts
						</Button>
					</>
				}
			>
				<div className="grid gap-4 md:grid-cols-3">
					<StatCard
						label="Students served"
						value="412"
						detail="Up 9% against the last program cycle."
					/>
					<StatCard
						label="Open tasks"
						value="3"
						detail="All currently owned by the partner operations pod."
					/>
					<StatCard
						label="Relationship health"
						value="Strong"
						detail="Consistent reporting, stable staffing, and one pending document refresh."
					/>
				</div>
			</PageIntroSection>

			<div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
				<Card className={pageStickyRailClassName}>
					<CardHeader className="space-y-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-[var(--twc-radius-lg)] bg-[color:color-mix(in_oklab,var(--color-brand)_14%,transparent)] text-[color:var(--color-brand)]">
							<Icon
								icon={LayoutPanelLeft}
								className="h-6 w-6"
							/>
						</div>
						<div>
							<CardTitle>Escola Horizonte</CardTitle>
							<CardDescription>
								North district partner since 2021.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4 pt-0">
						<div className="flex flex-wrap gap-2">
							<Badge tone="success">Compliant</Badge>
							<Badge tone="brand">Tier A</Badge>
						</div>
						<Separator />
						<div className="space-y-3">
							<div>
								<p className="ty-helper text-[color:var(--twc-muted)]">Owner</p>
								<p className="ty-sm-semibold">Marta Fernandes</p>
							</div>
							<div>
								<p className="ty-helper text-[color:var(--twc-muted)]">
									Open tasks
								</p>
								<p className="ty-sm-semibold">3 active items</p>
							</div>
							<div>
								<p className="ty-helper text-[color:var(--twc-muted)]">
									Students served
								</p>
								<p className="ty-sm-semibold">412 this cycle</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-6">
					<Section className={pageSectionClassName}>
						<SectionHeader>
							<div className="space-y-1">
								<SectionTitle>Overview</SectionTitle>
								<SectionDescription>
									Use the main column for narrative detail, audit trail, and
									editable surface areas.
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent className="grid gap-4 lg:grid-cols-2">
							<Card className="shadow-weak p-4">
								<CardHeader>
									<CardTitle>Relationship health</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="ty-helper text-[color:var(--twc-muted)]">
										Strong attendance history, consistent reporting, and one
										pending document refresh.
									</p>
								</CardContent>
							</Card>
							<Card className="shadow-weak p-4">
								<CardHeader>
									<CardTitle>Next checkpoint</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="ty-helper text-[color:var(--twc-muted)]">
										On-site review scheduled for Tuesday with funding and
										compliance leads.
									</p>
								</CardContent>
							</Card>
						</SectionContent>
					</Section>

					<Section className={pageSectionClassName}>
						<SectionHeader>
							<div className="space-y-1">
								<SectionTitle>Open work</SectionTitle>
								<SectionDescription>
									The split layout keeps task detail close without hiding the
									record identity.
								</SectionDescription>
							</div>
							<SectionActions>
								<Button
									usage="secondary"
									variant="ghost"
									leadingIcon={
										<Icon
											icon={FolderKanban}
											className="h-4 w-4"
										/>
									}
								>
									View board
								</Button>
							</SectionActions>
						</SectionHeader>
						<SectionContent className="space-y-3">
							{[
								"Upload renewed insurance certificate.",
								"Confirm updated transportation capacity for next cycle.",
								"Review partner contact fallback list.",
							].map(item => (
								<div
									key={item}
									className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-3"
								>
									<p className="ty-sm-semibold">{item}</p>
								</div>
							))}
						</SectionContent>
					</Section>

					<Section className={pageSectionClassName}>
						<SectionHeader>
							<div className="space-y-1">
								<SectionTitle>Recent notes</SectionTitle>
								<SectionDescription>
									The right column can grow without losing persistent context.
								</SectionDescription>
							</div>
						</SectionHeader>
						<SectionContent className="space-y-4">
							<Card className="shadow-weak p-4">
								<CardHeader>
									<CardTitle>Field visit summary</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="ty-helper text-[color:var(--twc-muted)]">
										Staffing is stable, reporting cadence is healthy, and the
										new enrollment cap looks realistic.
									</p>
								</CardContent>
							</Card>
							<Card className="shadow-weak p-4">
								<CardHeader>
									<CardTitle>Compliance follow-up</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="ty-helper text-[color:var(--twc-muted)]">
										One certification expires next month. Keep the renewal task
										visible until the document lands.
									</p>
								</CardContent>
							</Card>
						</SectionContent>
					</Section>
				</div>
			</div>
		</>
	);
}

function renderPatternPreview(slug: PagePatternSlug) {
	switch (slug) {
		case "section-stack":
			return <SectionStackPreview />;
		case "operations-workspace":
			return <OperationsWorkspacePreview />;
		case "split-detail":
			return <SplitDetailPreview />;
	}
}

export function PagePatternFrame({ slug }: PagePatternFrameProps) {
	return <div className="space-y-8">{renderPatternPreview(slug)}</div>;
}

export function PagePatternRecommendation() {
	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			<Card className="p-4">
				<CardHeader>
					<CardTitle>Shell</CardTitle>
					<CardDescription>
						Stay inside the centered app canvas. Escalate layout density with
						sections, not with a new page shell every time.
					</CardDescription>
				</CardHeader>
			</Card>
			<Card className="p-4">
				<CardHeader>
					<CardTitle>Header</CardTitle>
					<CardDescription>
						Use the shared route breadcrumb from the shell, then keep one strong
						intro area at the top of the page.
					</CardDescription>
				</CardHeader>
			</Card>
			<Card className="p-4">
				<CardHeader>
					<CardTitle>Surfaces</CardTitle>
					<CardDescription>
						Darker surfaces sit farther back. Lighter cards move closer to the
						user and should separate from the section behind them.
					</CardDescription>
				</CardHeader>
			</Card>
			<Card className="p-4">
				<CardHeader>
					<CardTitle>Overlays</CardTitle>
					<CardDescription>
						Use drawers, modals, and popovers to support a page, not to replace
						a page that deserves its own stable layout.
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
}

export function PagePatternLegend() {
	return (
		<div className="grid gap-4 lg:grid-cols-3">
			{pagePatternDefinitions.map(pattern => (
				<Card
					key={pattern.slug}
					className="h-full p-5"
				>
					<CardHeader className="space-y-3">
						<CardTitle>{pattern.name}</CardTitle>
						<CardDescription>{pattern.summary}</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 pt-1">
						<Card className="shadow-weak p-4">
							<CardHeader className="space-y-2">
								<CardTitle>Best for</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<p className="ty-helper text-[color:var(--twc-muted)]">
									{pattern.bestFor}
								</p>
							</CardContent>
						</Card>
						<Card className="shadow-weak p-4">
							<CardHeader className="space-y-2">
								<CardTitle>Tradeoff</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<p className="ty-helper text-[color:var(--twc-muted)]">
									{pattern.tradeoff}
								</p>
							</CardContent>
						</Card>
					</CardContent>
					<CardFooter className="pt-3">
						<Badge tone={pattern.tone}>{pattern.label}</Badge>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

export function PagePatternDirectionTag({ slug }: { slug: PagePatternSlug }) {
	const pattern = pagePatternDefinitions.find(item => item.slug === slug);

	if (!pattern) return null;

	return (
		<div className="flex flex-wrap gap-2">
			<Badge tone={pattern.tone}>{pattern.label}</Badge>
			<Badge
				tone="neutral"
				variant="outline"
			>
				Preview
			</Badge>
		</div>
	);
}

export function PagePatternTitle({ slug }: { slug: PagePatternSlug }) {
	const pattern = pagePatternDefinitions.find(item => item.slug === slug);

	if (!pattern) return null;

	return (
		<div className="space-y-3">
			<PagePatternDirectionTag slug={slug} />
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold tracking-tight text-[color:var(--twc-text)]">
					{pattern.name}
				</h2>
				<p className="ty-body text-[color:var(--twc-muted)]">
					{pattern.summary}
				</p>
			</div>
		</div>
	);
}

export function PagePatternNote() {
	return (
		<Card className="surface-2 p-4">
			<CardContent className="flex items-start gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--twc-radius-lg)] bg-[color:color-mix(in_oklab,var(--color-brand)_14%,transparent)] text-[color:var(--color-brand)]">
					<Icon
						icon={Sparkles}
						className="h-5 w-5"
					/>
				</div>
				<div className="space-y-1">
					<p className="ty-sm-semibold">Recommendation</p>
					<p className="ty-helper text-[color:var(--twc-muted)]">
						Adopt the section stack as the default page grammar, promote only
						the collection-heavy pages into operations workspaces, and reserve
						split-detail pages for records that need persistent context.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
