"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Icon,
	Section,
	SectionActions,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";
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
		<Section className="space-y-3">
			<SectionHeader className="gap-3 md:flex-row md:items-start md:justify-between">
				<div>
					<SectionTitle>{title}</SectionTitle>
					<SectionDescription>{description}</SectionDescription>
				</div>
				<SectionActions className="shrink-0">
					<Button
						variant="secondary"
						leadingIcon={
							isExpanded ? (
								<Icon
									icon={ChevronUp}
									className="h-4 w-4"
								/>
							) : (
								<Icon
									icon={ChevronDown}
									className="h-4 w-4"
								/>
							)
						}
						onClick={() => setIsExpanded(current => !current)}
					>
						{isExpanded ? t("docs.shared.collapse") : t("docs.shared.expand")}
					</Button>
				</SectionActions>
			</SectionHeader>

			{isExpanded ? (
				<SectionContent className="space-y-0">{children}</SectionContent>
			) : null}
		</Section>
	);
}
