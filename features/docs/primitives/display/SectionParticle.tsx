"use client";

import {
	Button,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	Section,
	SectionActions,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "components";
import { ArrowRight, Filter, Plus, Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "../ParticleContainer";
import { ParticleSection } from "../ParticleSection";

export default function SectionParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.section.title")}
			description={t("docs.section.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.section.patternNotes.items.structure") },
				{ description: t("docs.section.patternNotes.items.actions") },
				{ description: t("docs.section.patternNotes.items.surface") },
				{ description: t("docs.section.patternNotes.items.composition") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.section.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.section.sections.structure.title")}
				description={t("docs.section.sections.structure.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="p-4">
						<Section>
							<SectionHeader>
								<div className="space-y-1">
									<SectionTitle>
										{t("docs.section.structureCards.basic.title")}
									</SectionTitle>
									<SectionDescription>
										{t("docs.section.structureCards.basic.description")}
									</SectionDescription>
								</div>
							</SectionHeader>
							<SectionContent className="ty-body">
								{t("docs.section.structureCards.basic.body")}
							</SectionContent>
						</Section>
					</Card>

					<Card className="p-4">
						<Section>
							<SectionHeader>
								<div className="space-y-1">
									<SectionTitle>
										{t("docs.section.structureCards.minimal.title")}
									</SectionTitle>
									<SectionDescription>
										{t("docs.section.structureCards.minimal.description")}
									</SectionDescription>
								</div>
							</SectionHeader>
							<SectionContent className="ty-body">
								{t("docs.section.structureCards.minimal.body")}
							</SectionContent>
						</Section>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.section.sections.actions.title")}
				description={t("docs.section.sections.actions.description")}
			>
				<Card className="p-4">
					<Section>
						<SectionHeader>
							<div className="space-y-1">
								<SectionTitle>
									{t("docs.section.actionsCard.title")}
								</SectionTitle>
								<SectionDescription>
									{t("docs.section.actionsCard.description")}
								</SectionDescription>
							</div>
							<SectionActions>
								<Button
									usage="secondary"
									variant="ghost"
									leadingIcon={
										<Icon
											icon={Filter}
											className="h-4 w-4"
										/>
									}
								>
									{t("docs.section.actionsCard.actions.filter")}
								</Button>
								<Button
									usage="primary"
									variant="flat"
									leadingIcon={
										<Icon
											icon={Plus}
											className="h-4 w-4"
										/>
									}
								>
									{t("docs.section.actionsCard.actions.primary")}
								</Button>
							</SectionActions>
						</SectionHeader>
						<SectionContent className="grid gap-3 md:grid-cols-2">
							<Card className="p-4">
								<CardHeader>
									<CardTitle>
										{t("docs.section.actionsCard.items.one.title")}
									</CardTitle>
									<CardDescription>
										{t("docs.section.actionsCard.items.one.description")}
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="p-4">
								<CardHeader>
									<CardTitle>
										{t("docs.section.actionsCard.items.two.title")}
									</CardTitle>
									<CardDescription>
										{t("docs.section.actionsCard.items.two.description")}
									</CardDescription>
								</CardHeader>
							</Card>
						</SectionContent>
					</Section>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.section.sections.surface.title")}
				description={t("docs.section.sections.surface.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="p-4">
						<Section className="surface-2 rounded-[var(--twc-radius-xl)] p-4">
							<SectionHeader>
								<div className="space-y-1">
									<SectionTitle>
										{t("docs.section.surfaceCards.decorated.title")}
									</SectionTitle>
									<SectionDescription>
										{t("docs.section.surfaceCards.decorated.description")}
									</SectionDescription>
								</div>
								<SectionActions>
									<Button
										size="icon"
										usage="secondary"
										variant="ghost"
										title={t("docs.section.surfaceCards.decorated.action")}
										leadingIcon={
											<Icon
												icon={Settings2}
												className="h-4 w-4"
											/>
										}
									/>
								</SectionActions>
							</SectionHeader>
							<SectionContent className="ty-body">
								{t("docs.section.surfaceCards.decorated.body")}
							</SectionContent>
						</Section>
					</Card>

					<Card className="p-4">
						<Section>
							<SectionHeader>
								<div className="space-y-1">
									<SectionTitle>
										{t("docs.section.surfaceCards.plain.title")}
									</SectionTitle>
									<SectionDescription>
										{t("docs.section.surfaceCards.plain.description")}
									</SectionDescription>
								</div>
							</SectionHeader>
							<SectionContent className="space-y-3">
								<p className="ty-body">
									{t("docs.section.surfaceCards.plain.body")}
								</p>
								<Button
									usage="info"
									variant="ghost"
									trailingIcon={
										<Icon
											icon={ArrowRight}
											className="h-4 w-4"
										/>
									}
								>
									{t("docs.section.surfaceCards.plain.cta")}
								</Button>
							</SectionContent>
						</Section>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
