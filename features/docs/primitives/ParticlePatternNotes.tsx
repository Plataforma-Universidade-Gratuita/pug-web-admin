"use client";

import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Icon,
} from "@/components";
import type { ParticlePatternNotesProps } from "@/types/client";

export function ParticlePatternNotes({
	open,
	onOpenChange,
	items,
	title,
	apiLabel,
	snippet,
}: ParticlePatternNotesProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent>
				<DialogHeader overhead={t("docs.shared.patternNotesLabel")}>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogBody className="space-y-4">
					<ul className="ty-helper space-y-3">
						{items.map((item, index) => (
							<li key={index}>{item.description}</li>
						))}
					</ul>

					<div className="border-default-2 rounded-[var(--twc-radius-lg)] border border-dashed p-4">
						<div className="mb-3 flex items-center gap-2">
							<Icon
								icon={LoaderCircle}
								className="h-4 w-4 text-[color:var(--twc-muted)]"
							/>
							<p className="ty-sm-bold">{apiLabel}</p>
						</div>
						<pre className="overflow-x-auto text-xs leading-6 text-[color:var(--twc-muted)]">
							{snippet}
						</pre>
					</div>
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
