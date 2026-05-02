"use client";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function AccordionParticle() {
	const { t } = useTranslation();
	const [value, setValue] = useState("overview");

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.accordion.title")}
			description={t("docs.accordion.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.accordion.patternNotes.items.disclosure") },
				{ description: t("docs.accordion.patternNotes.items.secondary") },
				{ description: t("docs.accordion.patternNotes.items.trigger") },
				{ description: t("docs.accordion.patternNotes.items.multi") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.accordion.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.accordion.sections.single.title")}
				description={t("docs.accordion.sections.single.description")}
				defaultExpanded
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.accordion.singleCard.title")}</CardTitle>
						<CardDescription>
							{t("docs.accordion.singleCard.description")}
						</CardDescription>
					</CardHeader>
					<Accordion
						value={value}
						onValueChange={setValue}
						collapsible
						className="mt-6"
					>
						{(["overview", "roles", "delivery"] as const).map(key => (
							<AccordionItem
								key={key}
								value={key}
							>
								<AccordionTrigger>
									{t(`docs.accordion.structure.items.${key}.title`)}
								</AccordionTrigger>
								<AccordionContent>
									<p className="ty-body">
										{t(`docs.accordion.structure.items.${key}.description`)}
									</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.accordion.sections.compact.title")}
				description={t("docs.accordion.sections.compact.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.accordion.compactCard.title")}</CardTitle>
						<CardDescription>
							{t("docs.accordion.compactCard.description")}
						</CardDescription>
					</CardHeader>
					<Accordion
						type="single"
						collapsible
						className="mt-6 space-y-2"
					>
						{(["timing", "ownership", "escalation"] as const).map(key => (
							<AccordionItem
								key={key}
								value={key}
								className="rounded-[var(--twc-radius-lg)]"
							>
								<AccordionTrigger className="p-3">
									{t(`docs.accordion.compactCard.items.${key}.title`)}
								</AccordionTrigger>
								<AccordionContent>
									<p className="ty-helper">
										{t(`docs.accordion.compactCard.items.${key}.description`)}
									</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.accordion.sections.multiple.title")}
				description={t("docs.accordion.sections.multiple.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.accordion.multiCard.title")}</CardTitle>
						<CardDescription>
							{t("docs.accordion.multiCard.description")}
						</CardDescription>
					</CardHeader>
					<Accordion
						type="multiple"
						defaultValue={["filters", "visibility"]}
						className="mt-6"
					>
						{(["filters", "visibility", "history"] as const).map(key => (
							<AccordionItem
								key={key}
								value={key}
							>
								<AccordionTrigger>
									{t(`docs.accordion.multiCard.items.${key}.title`)}
								</AccordionTrigger>
								<AccordionContent>
									<p className="ty-body">
										{t(`docs.accordion.multiCard.items.${key}.description`)}
									</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
