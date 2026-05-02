"use client";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ScrollArea,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function ScrollAreaParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.structurePrimitives.primitives.scrollAreaTitle")}
			description={t("docs.structurePrimitives.patternNotes.items.scrollArea")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{
					description: t(
						"docs.structurePrimitives.patternNotes.items.scrollArea",
					),
				},
				{
					description: t(
						"docs.structurePrimitives.patternNotes.items.scrollAreaBounded",
					),
				},
				{
					description: t(
						"docs.structurePrimitives.patternNotes.items.scrollAreaViewport",
					),
				},
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t(
				"docs.structurePrimitives.patternNotes.scrollAreaSnippet",
			)}
		>
			<ParticleSection
				title={t("docs.structurePrimitives.scrollCard.title")}
				description={t("docs.structurePrimitives.scrollCard.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>
							{t("docs.structurePrimitives.scrollCard.title")}
						</CardTitle>
						<CardDescription>
							{t("docs.structurePrimitives.scrollCard.description")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ScrollArea className="border-default-2 surface-1 h-52 rounded-[var(--twc-radius-lg)] border">
							<div className="space-y-3 p-4">
								{(["one", "two", "three", "four", "five", "six"] as const).map(
									key => (
										<div
											key={key}
											className="rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-3"
										>
											<p className="ty-sm-semibold">
												{t(
													`docs.structurePrimitives.scrollCard.items.${key}.title`,
												)}
											</p>
											<p className="ty-helper mt-1">
												{t(
													`docs.structurePrimitives.scrollCard.items.${key}.description`,
												)}
											</p>
										</div>
									),
								)}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
