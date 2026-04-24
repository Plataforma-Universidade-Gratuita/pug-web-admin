"use client";

import { useState, type ReactNode } from "react";

import { Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui";

import { ParticlePatternNotes } from "./ParticlePatternNotes";

interface ParticleContainerProps {
	eyebrow: string;
	title: string;
	description: string;
	children: ReactNode;
}

export function ParticleContainer({
	eyebrow,
	title,
	description,
	children,
}: ParticleContainerProps) {
	const [isExpanded, setIsExpanded] = useState(true);
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
						leadingIcon={<Plus className="h-4 w-4" />}
						usage="primary"
						variant="flat"
						onClick={() => setIsExpanded(current => !current)}
					>
						{isExpanded ? "Hide items" : "New item"}
					</Button>
					<Button
						leadingIcon={<Sparkles className="h-4 w-4" />}
						usage="secondary"
						variant="ghost"
						onClick={() => setIsPreviewOpen(true)}
					>
						Preview pattern
					</Button>
				</div>
			</div>

			{isExpanded ? <div className="space-y-6 p-6">{children}</div> : null}

			{isPreviewOpen ? (
				<ParticlePatternNotes onClose={() => setIsPreviewOpen(false)} />
			) : null}
		</section>
	);
}
