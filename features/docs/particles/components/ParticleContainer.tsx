"use client";

import { useState } from "react";

import { Minus, Plus, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import type { ParticleContainerProps } from "@/types/client";

import { ParticlePatternNotes } from "./ParticlePatternNotes";

export function ParticleContainer({
	eyebrow,
	title,
	description,
	patternNotesItems,
	patternNotesTitle,
	patternNotesApiLabel,
	patternNotesSnippet,
	children,
}: ParticleContainerProps) {
	const { t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	return (
		<section className="border-default-2 surface-2 shadow-normal overflow-hidden rounded-[calc(var(--twc-radius-xl)+0.25rem)] border">
			<div className="border-default-2 flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-end lg:justify-between">
				<div className="max-w-2xl space-y-3">
					<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--color-brand)] uppercase">
						{eyebrow}
					</p>
					<h1 className="ty-title text-3xl">{title}</h1>
					<p className="ty-body">{description}</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button
						size={"icon"}
						tooltipContent={
							isExpanded ? t("docs.shared.collapse") : t("docs.shared.expand")
						}
						usage="primary"
						variant="flat"
						onClick={() => setIsExpanded(current => !current)}
					>
						{isExpanded ? (
							<Minus className="h-4 w-4" />
						) : (
							<Plus className="h-4 w-4" />
						)}
					</Button>
					<Button
						size={"icon"}
						tooltipContent={t("docs.shared.viewPatternNotes")}
						usage="secondary"
						variant="ghost"
						onClick={() => setIsPreviewOpen(true)}
					>
						<Sparkles className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{isExpanded ? <div className="space-y-6 p-6">{children}</div> : null}

			{isPreviewOpen ? (
				<ParticlePatternNotes
					open={isPreviewOpen}
					onOpenChange={setIsPreviewOpen}
					items={patternNotesItems}
					title={patternNotesTitle}
					apiLabel={patternNotesApiLabel}
					snippet={patternNotesSnippet}
				/>
			) : null}
		</section>
	);
}
