"use client";

import { useState } from "react";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Footer,
	Header,
	Icon,
	Content,
	Section,
	SectionActions,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
	Skeleton,
} from "components";
import { Circle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "../ParticleContainer";
import { ParticleSection } from "../ParticleSection";

export default function SkeletonParticle() {
	const { t } = useTranslation();
	const [isDialogPreviewOpen, setIsDialogPreviewOpen] = useState(false);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.skeleton.title")}
			description={t("docs.skeleton.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.skeleton.patternNotes.items.automatic") },
				{ description: t("docs.skeleton.patternNotes.items.scope") },
				{ description: t("docs.skeleton.patternNotes.items.stability") },
				{ description: t("docs.skeleton.patternNotes.items.manual") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.skeleton.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.skeleton.sections.cards.title")}
				description={t("docs.skeleton.sections.cards.description")}
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card
						isLoading
						className="flex min-h-48 flex-col justify-between p-4"
						loadingLabel={t("docs.skeleton.loadingLabels.card")}
					>
						<CardHeader>
							<CardTitle>{t("docs.skeleton.cardExample.title")}</CardTitle>
							<CardDescription>
								{t("docs.skeleton.cardExample.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button usage="primary">
								{t("docs.skeleton.cardExample.cta")}
							</Button>
						</CardContent>
					</Card>

					<Card className="flex min-h-48 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.skeleton.cardExample.title")}</CardTitle>
							<CardDescription>
								{t("docs.skeleton.cardExample.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button usage="primary">
								{t("docs.skeleton.cardExample.cta")}
							</Button>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.skeleton.sections.buttonUsage.title")}
				description={t("docs.skeleton.sections.buttonUsage.description")}
			>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{[
						{ key: "primary", usage: "primary" as const },
						{ key: "secondary", usage: "secondary" as const },
						{ key: "success", usage: "success" as const },
					].map(item => (
						<Card
							key={item.key}
							isLoading
							className="flex min-h-40 flex-col justify-between p-4"
							loadingLabel={t("docs.skeleton.loadingLabels.usageCard")}
						>
							<CardHeader>
								<CardTitle>
									{t(`docs.button.usageCards.${item.key}.name`)}
								</CardTitle>
								<CardDescription>
									{t(`docs.button.usageCards.${item.key}.description`)}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button usage={item.usage}>
									{t(`docs.button.usageCards.${item.key}.label`)}
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.skeleton.sections.primitive.title")}
				description={t("docs.skeleton.sections.primitive.description")}
			>
				<Card className="p-4">
					<CardContent className="grid gap-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-3 w-2/3" />
						</div>
						<div className="grid gap-3 md:grid-cols-[1fr_0.4fr]">
							<Skeleton className="h-24 rounded-[var(--twc-radius-lg)]" />
							<div className="space-y-3">
								<Skeleton className="h-10 rounded-full" />
								<Skeleton className="h-10 rounded-full" />
							</div>
						</div>
					</CardContent>
					<p className="ty-helper mt-4">{t("docs.skeleton.primitiveNote")}</p>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.skeleton.sections.section.title")}
				description={t("docs.skeleton.sections.section.description")}
			>
				<div className="grid gap-6 lg:grid-cols-2">
					<Section
						isLoading
						loadingLabel={t("docs.skeleton.loadingLabels.section")}
					>
						<SectionHeader>
							<div className="space-y-2">
								<SectionTitle>
									{t("docs.skeleton.sectionExample.title")}
								</SectionTitle>
								<SectionDescription>
									{t("docs.skeleton.sectionExample.description")}
								</SectionDescription>
							</div>
							<SectionActions>
								<Button
									usage="primary"
									variant="flat"
								>
									{t("docs.skeleton.sectionExample.cta")}
								</Button>
							</SectionActions>
						</SectionHeader>
						<SectionContent>
							<Card className="p-4">
								<CardContent>
									{t("docs.skeleton.sectionExample.content")}
								</CardContent>
							</Card>
						</SectionContent>
					</Section>

					<Section>
						<SectionHeader>
							<div className="space-y-2">
								<SectionTitle>
									{t("docs.skeleton.sectionExample.title")}
								</SectionTitle>
								<SectionDescription>
									{t("docs.skeleton.sectionExample.description")}
								</SectionDescription>
							</div>
							<SectionActions>
								<Button
									usage="primary"
									variant="flat"
								>
									{t("docs.skeleton.sectionExample.cta")}
								</Button>
							</SectionActions>
						</SectionHeader>
						<SectionContent>
							<Card className="p-4">
								<CardContent>
									{t("docs.skeleton.sectionExample.content")}
								</CardContent>
							</Card>
						</SectionContent>
					</Section>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.skeleton.sections.dialog.title")}
				description={t("docs.skeleton.sections.dialog.description")}
			>
				<Card className="space-y-4 p-4">
					<CardContent className="flex flex-wrap items-center gap-3">
						<Button
							usage="primary"
							variant="flat"
							onClick={() => setIsDialogPreviewOpen(true)}
						>
							{t("docs.skeleton.dialogExample.trigger")}
						</Button>
					</CardContent>
					<p className="ty-helper">{t("docs.skeleton.dialogExample.note")}</p>
				</Card>
				<Dialog
					open={isDialogPreviewOpen}
					onOpenChange={setIsDialogPreviewOpen}
					isLoading
					loadingLabel={t("docs.skeleton.loadingLabels.dialog")}
				>
					<DialogContent>
						<DialogHeader className="p-6 pb-4">
							<DialogTitle>
								{t("docs.skeleton.dialogExample.title")}
							</DialogTitle>
							<DialogDescription>
								{t("docs.skeleton.dialogExample.description")}
							</DialogDescription>
						</DialogHeader>
						<div className="flex-1 p-6 pt-0">
							<Content isLoading />
						</div>
						<DialogFooter>
							<Button variant="ghost">
								{t("docs.skeleton.dialogExample.secondary")}
							</Button>
							<Button
								usage="primary"
								variant="flat"
							>
								{t("docs.skeleton.dialogExample.primary")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</ParticleSection>

			<ParticleSection
				title={t("docs.skeleton.sections.icon.title")}
				description={t("docs.skeleton.sections.icon.description")}
			>
				<Card className="p-4">
					<CardContent className="flex flex-wrap items-center gap-4">
						<Icon
							isLoading
							icon={Circle}
							size={20}
						/>
						<Icon
							isLoading
							icon={Circle}
							size={28}
						/>
						<Icon
							isLoading
							icon={Circle}
							size={36}
						/>
					</CardContent>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.skeleton.sections.layout.title")}
				description={t("docs.skeleton.sections.layout.description")}
			>
				<Card className="p-4">
					<div className="grid gap-4">
						<Header isLoading />
						<Content
							isLoading
							className="min-h-14"
						/>
						<Footer isLoading />
					</div>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
