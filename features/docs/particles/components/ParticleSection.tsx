"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import type { ParticleSectionProps } from "@/types/client";

export function ParticleSection({
	title,
	description,
	children,
	defaultExpanded = false,
}: ParticleSectionProps) {
	const { t } = useTranslation();
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
					{isExpanded ? t("docs.shared.collapse") : t("docs.shared.expand")}
				</Button>
			</div>

			{isExpanded ? children : null}
		</section>
	);
}
