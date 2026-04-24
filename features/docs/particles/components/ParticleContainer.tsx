"use client";

import { useState } from "react";

import { Minus, Plus, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ParticleContainerProps } from "@/types/client";

import {
	Button,
	Icon,
	Section,
	SectionActions,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "../../../../components";
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
		<Section className="border-default-2 surface-2 shadow-normal overflow-hidden rounded-[calc(var(--twc-radius-xl)+0.25rem)] border">
			<SectionHeader className="border-default-2 items-end border-b p-6">
				<div className="max-w-2xl space-y-3">
					<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--color-brand)] uppercase">
						{eyebrow}
					</p>
					<SectionTitle className="ty-title text-3xl">{title}</SectionTitle>
					<SectionDescription className="ty-body">
						{description}
					</SectionDescription>
				</div>
				<SectionActions>
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
							<Icon
								icon={Minus}
								className="h-4 w-4"
							/>
						) : (
							<Icon
								icon={Plus}
								className="h-4 w-4"
							/>
						)}
					</Button>
					<Button
						size={"icon"}
						tooltipContent={t("docs.shared.viewPatternNotes")}
						usage="secondary"
						variant="ghost"
						onClick={() => setIsPreviewOpen(true)}
					>
						<Icon
							icon={Sparkles}
							className="h-4 w-4"
						/>
					</Button>
				</SectionActions>
			</SectionHeader>

			{isExpanded ? (
				<SectionContent className="p-6">{children}</SectionContent>
			) : null}

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
		</Section>
	);
}
