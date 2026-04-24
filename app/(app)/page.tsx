import {
	ArrowRight,
	CheckCircle2,
	Download,
	Info,
	OctagonAlert,
	Plus,
	ShieldAlert,
	Zap,
} from "lucide-react";

import { ParticleContainer, ParticleSection } from "@/app/(app)/_components";
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
			<ParticleContainer
				eyebrow="UI Particles"
				title="Buttons"
				description="The button particle now separates semantic usage from visual treatment. `usage` controls intent and color. `variant` controls how that intent is rendered across surfaces."
			>
				<ParticleSection
					title="Usage"
					description="Usage communicates the job of the action and sets the color language behind the button."
				>
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
				</ParticleSection>

				<ParticleSection
					title="Variant"
					description="Variant changes the visual treatment without changing the semantic meaning of the action."
				>
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
				</ParticleSection>

				<ParticleSection
					title="Scale"
					description="Button size should adapt to density. Visual treatment and usage can stay the same."
				>
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
				</ParticleSection>

				<ParticleSection
					title="States"
					description="Loading and disabled behavior is built into the primitive so flows stay consistent regardless of treatment."
				>
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
				</ParticleSection>
			</ParticleContainer>
		</main>
	);
}
