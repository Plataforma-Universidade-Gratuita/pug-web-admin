import {
	ArrowRight,
	CheckCircle2,
	Download,
	Info,
	LoaderCircle,
	OctagonAlert,
	Plus,
	ShieldAlert,
	Sparkles,
	Zap,
} from "lucide-react";

import { Button } from "@/components/ui";

const usages = [
	{
		name: "Primary",
		description: "Default high-emphasis action for confirm and submit flows.",
		usage: "primary" as const,
		icon: <ArrowRight className="h-4 w-4" />,
		label: "Save changes",
	},
	{
		name: "Secondary",
		description: "Neutral action for companion paths and supporting controls.",
		usage: "secondary" as const,
		icon: <Download className="h-4 w-4" />,
		label: "Export report",
	},
	{
		name: "Success",
		description: "Positive action for approvals, completion, or confirmation.",
		usage: "success" as const,
		icon: <CheckCircle2 className="h-4 w-4" />,
		label: "Mark approved",
	},
	{
		name: "Info",
		description:
			"Guidance action when you need emphasis without implying risk.",
		usage: "info" as const,
		icon: <Info className="h-4 w-4" />,
		label: "View details",
	},
	{
		name: "Warning",
		description: "Cautionary action that deserves review before continuing.",
		usage: "warning" as const,
		icon: <OctagonAlert className="h-4 w-4" />,
		label: "Review issue",
	},
	{
		name: "Danger",
		description: "Destructive action for irreversible changes and deletion.",
		usage: "danger" as const,
		icon: <ShieldAlert className="h-4 w-4" />,
		label: "Revoke access",
	},
] as const;

const treatments = [
	{
		name: "Flat",
		variant: "flat" as const,
		description:
			"Filled in light mode and softened in dark mode without changing the action meaning.",
	},
	{
		name: "Ghost",
		variant: "ghost" as const,
		description:
			"Low-chrome action for dense toolbars, lists, and utility affordances.",
	},
] as const;

const sizes = [
	{ label: "Small", size: "sm" as const },
	{ label: "Medium", size: "md" as const },
	{ label: "Large", size: "lg" as const },
] as const;

export default function Page() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<section className="border-default-2 surface-2 shadow-normal overflow-hidden rounded-[calc(var(--twc-radius-xl)+0.25rem)] border">
				<div className="border-default-2 flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-2xl space-y-3">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--color-brand)] uppercase">
							UI Particles
						</p>
						<h1 className="ty-title text-3xl">Buttons</h1>
						<p className="ty-body">
							The button particle now separates semantic usage from visual
							treatment. `usage` controls intent and color. `variant` controls
							how that intent is rendered across surfaces.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							leadingIcon={<Plus className="h-4 w-4" />}
							usage="primary"
							variant="flat"
						>
							New item
						</Button>
						<Button
							leadingIcon={<Sparkles className="h-4 w-4" />}
							usage="secondary"
							variant="ghost"
						>
							Preview pattern
						</Button>
					</div>
				</div>

				<div className="space-y-6 p-6">
					<div className="space-y-3">
						<div>
							<h2 className="ty-header">Usage</h2>
							<p className="ty-helper">
								Usage communicates the job of the action and sets the color
								language behind the button.
							</p>
						</div>
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{usages.map(item => (
								<div
									key={item.name}
									className="border-default-2 surface-1 flex min-h-40 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4"
								>
									<div className="space-y-1">
										<h3 className="ty-sm-bold">{item.name}</h3>
										<p className="ty-helper">{item.description}</p>
									</div>
									<div>
										<Button
											usage={item.usage}
											trailingIcon={item.icon}
										>
											{item.label}
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-3">
						<div>
							<h2 className="ty-header">Variant</h2>
							<p className="ty-helper">
								Variant changes the visual treatment without changing the
								semantic meaning of the action.
							</p>
						</div>
						<div className="grid gap-4 md:grid-cols-2">
							{treatments.map(item => (
								<div
									key={item.name}
									className="border-default-2 surface-1 flex min-h-40 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4"
								>
									<div className="space-y-1">
										<h3 className="ty-sm-bold">{item.name}</h3>
										<p className="ty-helper">{item.description}</p>
									</div>
									<div>
										<Button
											usage="primary"
											variant={item.variant}
											leadingIcon={<Zap className="h-4 w-4" />}
										>
											Apply style
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-3">
						<div>
							<h2 className="ty-header">Scale</h2>
							<p className="ty-helper">
								Button size should adapt to density. Visual treatment and usage
								can stay the same.
							</p>
						</div>
						<div className="border-default-2 surface-1 flex flex-wrap items-center gap-3 rounded-[var(--twc-radius-xl)] border p-4">
							{sizes.map(item => (
								<Button
									key={item.label}
									size={item.size}
									usage="secondary"
									variant="flat"
									leadingIcon={<Plus className="h-4 w-4" />}
								>
									{item.label}
								</Button>
							))}
							<Button
								size="icon"
								usage="secondary"
								variant="ghost"
								title="Add item"
								leadingIcon={<Plus className="h-4 w-4" />}
							/>
						</div>
					</div>

					<div className="space-y-3">
						<div>
							<h2 className="ty-header">States</h2>
							<p className="ty-helper">
								Loading and disabled behavior is built into the primitive so
								flows stay consistent regardless of treatment.
							</p>
						</div>
						<div className="grid gap-4 md:grid-cols-3">
							<div className="border-default-2 surface-1 space-y-3 rounded-[var(--twc-radius-xl)] border p-4">
								<p className="ty-sm-bold">Loading</p>
								<Button
									isLoading
									loadingText="Publishing..."
									usage="primary"
								>
									Publish
								</Button>
							</div>
							<div className="border-default-2 surface-1 space-y-3 rounded-[var(--twc-radius-xl)] border p-4">
								<p className="ty-sm-bold">Disabled</p>
								<Button
									usage="secondary"
									variant="flat"
									disabled
								>
									Awaiting changes
								</Button>
							</div>
							<div className="border-default-2 surface-1 space-y-3 rounded-[var(--twc-radius-xl)] border p-4">
								<p className="ty-sm-bold">Full width</p>
								<Button
									className="w-full"
									usage="info"
									variant="flat"
									trailingIcon={<ArrowRight className="h-4 w-4" />}
								>
									Continue setup
								</Button>
							</div>
						</div>
					</div>

					<div className="border-default-2 surface-1 space-y-4 rounded-[var(--twc-radius-xl)] border p-5">
						<div className="space-y-2">
							<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
								Pattern Notes
							</p>
							<h2 className="ty-header">When to use</h2>
						</div>
						<ul className="ty-helper space-y-3">
							<li>
								Use `usage` to express meaning: primary, secondary, success,
								info, warning, or danger.
							</li>
							<li>
								Use <code>variant=&quot;flat&quot;</code> for the standard
								filled action. It uses the old flat treatment in light mode and
								the old soft treatment in dark mode.
							</li>
							<li>
								Use <code>variant=&quot;ghost&quot;</code> for utility controls
								and dense layouts.
							</li>
							<li>
								For icon-only buttons, pass a readable <code>title</code>,{" "}
								<code>aria-label</code>, or plain-text child so the primitive
								can derive the accessible name.
							</li>
						</ul>

						<div className="border-default-2 rounded-[var(--twc-radius-lg)] border border-dashed p-4">
							<div className="mb-3 flex items-center gap-2">
								<LoaderCircle className="h-4 w-4 text-[color:var(--twc-muted)]" />
								<p className="ty-sm-bold">Current primitive API</p>
							</div>
							<pre className="overflow-x-auto text-xs leading-6 text-[color:var(--twc-muted)]">
								{`<Button
  usage="primary | secondary | success | info | warning | danger"
  variant="flat | ghost"
  size="sm | md | lg | icon"
  leadingIcon={<Icon />}
  trailingIcon={<Icon />}
  isLoading
  loadingText="Saving..."
/>`}
							</pre>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
