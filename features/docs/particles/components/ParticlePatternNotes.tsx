"use client";

import { LoaderCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import type { ParticlePatternNotesProps } from "@/types/client";

export function ParticlePatternNotes({
	onClose,
	items,
	title,
	apiLabel,
	snippet,
}: ParticlePatternNotesProps) {
	const { t } = useTranslation();

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="border-default-2 surface-2 shadow-strong w-full max-w-2xl rounded-[calc(var(--twc-radius-xl)+0.25rem)] border">
				<div className="border-default-2 flex items-start justify-between gap-4 border-b p-6">
					<div className="space-y-2">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							{t("docs.shared.patternNotesLabel")}
						</p>
						<h2 className="ty-header">{title}</h2>
					</div>
					<Button
						size="icon"
						variant="ghost"
						usage="secondary"
						aria-label={t("docs.shared.closePatternNotes")}
						onClick={onClose}
						leadingIcon={<X className="h-4 w-4" />}
					/>
				</div>

				<div className="space-y-4 p-6">
					<ul className="ty-helper space-y-3">
						{items.map((item, index) => (
							<li key={index}>{item.description}</li>
						))}
					</ul>

					<div className="border-default-2 rounded-[var(--twc-radius-lg)] border border-dashed p-4">
						<div className="mb-3 flex items-center gap-2">
							<LoaderCircle className="h-4 w-4 text-[color:var(--twc-muted)]" />
							<p className="ty-sm-bold">{apiLabel}</p>
						</div>
						<pre className="overflow-x-auto text-xs leading-6 text-[color:var(--twc-muted)]">
							{snippet}
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
