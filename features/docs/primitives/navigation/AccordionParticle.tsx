"use client";

import { useState } from "react";

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
import { useTranslation } from "react-i18next";

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
				{ description: t("docs.accordion.patternNotes.items.trigger") },
				{ description: t("docs.accordion.patternNotes.items.content") },
				{ description: t("docs.accordion.patternNotes.items.multi") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.accordion.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.accordion.sections.structure.title")}
				description={t("docs.accordion.sections.structure.description")}
			>
				<Card className="p-4">
					<Accordion
						value={value}
						onValueChange={setValue}
						collapsible
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
				<div className="grid gap-4 md:grid-cols-2">
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
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
