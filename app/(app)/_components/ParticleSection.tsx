"use client";

import { useState, type ReactNode } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui";

interface ParticleSectionProps {
	title: string;
	description: string;
	children: ReactNode;
	defaultExpanded?: boolean;
}

export function ParticleSection({
	title,
	description,
	children,
	defaultExpanded = true,
}: ParticleSectionProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	return (
		<section className="space-y-3">
			<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
				<div>
					<h2 className="ty-header">{title}</h2>
					<p className="ty-helper">{description}</p>
				</div>
				<Button
					usage="secondary"
					variant="ghost"
					leadingIcon={
						isExpanded ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)
					}
					onClick={() => setIsExpanded(current => !current)}
				>
					{isExpanded ? "Collapse" : "Expand"}
				</Button>
			</div>

			{isExpanded ? children : null}
		</section>
	);
}
