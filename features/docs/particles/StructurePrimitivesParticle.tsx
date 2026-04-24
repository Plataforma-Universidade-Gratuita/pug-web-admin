"use client";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Label,
	ScrollArea,
	Separator,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components";
import { ParticleContainer } from "@/features/docs/particles/components/ParticleContainer";
import { ParticleSection } from "@/features/docs/particles/components/ParticleSection";

export default function StructurePrimitivesParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.structurePrimitives.title")}
			description={t("docs.structurePrimitives.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.structurePrimitives.patternNotes.items.tabs") },
				{ description: t("docs.structurePrimitives.patternNotes.items.label") },
				{
					description: t(
						"docs.structurePrimitives.patternNotes.items.separator",
					),
				},
				{
					description: t(
						"docs.structurePrimitives.patternNotes.items.scrollArea",
					),
				},
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.structurePrimitives.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.structurePrimitives.sections.tabs.title")}
				description={t("docs.structurePrimitives.sections.tabs.description")}
			>
				<Card className="p-4">
					<Tabs defaultValue="overview">
						<TabsList>
							{(["overview", "members", "history"] as const).map(key => (
								<TabsTrigger
									key={key}
									value={key}
								>
									{t(`docs.structurePrimitives.tabs.items.${key}.label`)}
								</TabsTrigger>
							))}
						</TabsList>

						{(["overview", "members", "history"] as const).map(key => (
							<TabsContent
								key={key}
								value={key}
								className="border-default-2 rounded-[var(--twc-radius-lg)] border p-4"
							>
								<p className="ty-sm-semibold">
									{t(`docs.structurePrimitives.tabs.items.${key}.title`)}
								</p>
								<p className="ty-helper mt-2">
									{t(`docs.structurePrimitives.tabs.items.${key}.description`)}
								</p>
							</TabsContent>
						))}
					</Tabs>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.structurePrimitives.sections.structure.title")}
				description={t(
					"docs.structurePrimitives.sections.structure.description",
				)}
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.structurePrimitives.labelCard.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.structurePrimitives.labelCard.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<Label htmlFor="workspace-name">
									{t("docs.structurePrimitives.labelCard.nameLabel")}
								</Label>
								<Input
									id="workspace-name"
									placeholder={t(
										"docs.structurePrimitives.labelCard.namePlaceholder",
									)}
								/>
							</div>
							<Separator />
							<div className="flex items-center gap-3">
								<span className="ty-helper">
									{t("docs.structurePrimitives.labelCard.leftMeta")}
								</span>
								<Separator
									orientation="vertical"
									className="h-4"
								/>
								<span className="ty-helper">
									{t("docs.structurePrimitives.labelCard.rightMeta")}
								</span>
							</div>
						</CardContent>
					</Card>

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
									{(
										["one", "two", "three", "four", "five", "six"] as const
									).map(key => (
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
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
