import { ShieldCheck } from "lucide-react";

import { Icon } from "../../components";

const securityHighlights = [
	"Administrator-only access",
	"Session continuity with secure cookies",
	"Token refresh handled automatically",
];

export function LoginHero() {
	return (
		<div
			className="shadow-strong hidden min-h-[38rem] flex-col justify-between overflow-hidden rounded-[calc(var(--twc-radius-xl)+0.25rem)] border p-8 lg:flex"
			style={{
				borderColor: "color-mix(in oklab, white 12%, transparent)",
				background:
					"linear-gradient(155deg, color-mix(in oklab, var(--color-brand) 42%, #0f1115), #0f1115 58%, color-mix(in oklab, var(--color-brand) 16%, #0b0d10))",
				color: "rgba(255,255,255,0.96)",
			}}
		>
			<div className="space-y-6">
				<div
					className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5"
					style={{
						borderColor: "rgba(255,255,255,0.18)",
						backgroundColor: "color-mix(in oklab, white 7%, transparent)",
						color: "rgba(255,255,255,0.86)",
					}}
				>
					<Icon
						icon={ShieldCheck}
						className="h-4 w-4"
					/>
					Admin access
				</div>

				<p
					className="text-xs font-medium tracking-[0.32em] uppercase"
					style={{ color: "rgba(255,255,255,0.58)" }}
				>
					PUG Web Admin
				</p>
				<h1 className="max-w-xl text-5xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
					Sign in to manage academic operations with clarity.
				</h1>
			</div>

			<div className="grid gap-3">
				{securityHighlights.map(item => (
					<div
						key={item}
						className="rounded-[var(--twc-radius-lg)] border px-4 py-3 text-sm leading-6 backdrop-blur-sm"
						style={{
							borderColor: "rgba(255,255,255,0.12)",
							backgroundColor: "color-mix(in oklab, white 6%, transparent)",
							color: "rgba(255,255,255,0.74)",
						}}
					>
						{item}
					</div>
				))}
			</div>
		</div>
	);
}
