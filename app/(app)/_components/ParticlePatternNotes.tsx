"use client";

import { LoaderCircle, X } from "lucide-react";

import { Button } from "@/components/ui";

interface ParticlePatternNotesProps {
	onClose: () => void;
}

export function ParticlePatternNotes({ onClose }: ParticlePatternNotesProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="border-default-2 surface-2 shadow-strong w-full max-w-2xl rounded-[calc(var(--twc-radius-xl)+0.25rem)] border">
				<div className="border-default-2 flex items-start justify-between gap-4 border-b p-6">
					<div className="space-y-2">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							Pattern Notes
						</p>
						<h2 className="ty-header">When to use</h2>
					</div>
					<Button
						size="icon"
						variant="ghost"
						usage="secondary"
						aria-label="Close pattern notes"
						onClick={onClose}
						leadingIcon={<X className="h-4 w-4" />}
					/>
				</div>

				<div className="space-y-4 p-6">
					<ul className="ty-helper space-y-3">
						<li>
							Use `usage` to express meaning: primary, secondary, success, info,
							warning, or danger.
						</li>
						<li>
							Use <code>variant=&quot;flat&quot;</code> for the standard filled
							action. It uses the old flat treatment in light mode and the old
							soft treatment in dark mode.
						</li>
						<li>
							Use <code>variant=&quot;ghost&quot;</code> for utility controls
							and dense layouts.
						</li>
						<li>
							For icon-only buttons, pass a readable <code>title</code>,{" "}
							<code>aria-label</code>, or plain-text child so the primitive can
							derive the accessible name.
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
		</div>
	);
}
