"use client";

import { LoaderCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ParticlePatternNotesProps } from "@/types/client";

import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Icon,
} from "../../../../components";

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
				<div className="border-default-2 flex items-start justify-between gap-4 border-b p-6">
					<DialogHeader>
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							{t("docs.shared.patternNotesLabel")}
						</p>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>
					<Button
						size="icon"
						variant="ghost"
						usage="secondary"
						aria-label={t("docs.shared.closePatternNotes")}
						onClick={() => onOpenChange(false)}
						leadingIcon={
							<Icon
								icon={X}
								className="h-4 w-4"
							/>
						}
					/>
				</div>

				<div className="flex-1 space-y-4 overflow-y-auto p-6">
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
				</div>
			</DialogContent>
		</Dialog>
	);
}
