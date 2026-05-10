"use client";

import { useState } from "react";

import { FileText, Info, Layers3 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Icon,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function DialogParticle() {
	const { t } = useTranslation();
	const [isBasicOpen, setIsBasicOpen] = useState(false);
	const [isOverheadOpen, setIsOverheadOpen] = useState(false);
	const [isOverflowOpen, setIsOverflowOpen] = useState(false);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.dialog.title")}
			description={t("docs.dialog.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.dialog.patternNotes.items.useCase") },
				{ description: t("docs.dialog.patternNotes.items.structure") },
				{ description: t("docs.dialog.patternNotes.items.header") },
				{ description: t("docs.dialog.patternNotes.items.overflow") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.dialog.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.dialog.sections.structure.title")}
				description={t("docs.dialog.sections.structure.description")}
				defaultExpanded
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.dialog.structureCards.basic.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.dialog.structureCards.basic.description")}
							</CardDescription>
						</CardHeader>
						<CardFooter>
							<Button
								leadingIcon={
									<Icon
										icon={Layers3}
										className="h-4 w-4"
									/>
								}
								onClick={() => setIsBasicOpen(true)}
							>
								{t("docs.dialog.structureCards.basic.trigger")}
							</Button>
						</CardFooter>
					</Card>

					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.dialog.structureCards.overhead.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.dialog.structureCards.overhead.description")}
							</CardDescription>
						</CardHeader>
						<CardFooter>
							<Button
								variant="secondary"
								leadingIcon={
									<Icon
										icon={Info}
										className="h-4 w-4"
									/>
								}
								onClick={() => setIsOverheadOpen(true)}
							>
								{t("docs.dialog.structureCards.overhead.trigger")}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.dialog.sections.overflow.title")}
				description={t("docs.dialog.sections.overflow.description")}
			>
				<Card className="flex min-h-44 flex-col justify-between p-4">
					<CardHeader>
						<CardTitle>{t("docs.dialog.overflowCard.title")}</CardTitle>
						<CardDescription>
							{t("docs.dialog.overflowCard.description")}
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button
							variant="secondary"
							leadingIcon={
								<Icon
									icon={FileText}
									className="h-4 w-4"
								/>
							}
							onClick={() => setIsOverflowOpen(true)}
						>
							{t("docs.dialog.overflowCard.trigger")}
						</Button>
					</CardFooter>
				</Card>
			</ParticleSection>

			<Dialog
				open={isBasicOpen}
				onOpenChange={setIsBasicOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("docs.dialog.examples.basic.title")}</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<p className="ty-body">{t("docs.dialog.examples.basic.body")}</p>
					</DialogBody>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isOverheadOpen}
				onOpenChange={setIsOverheadOpen}
			>
				<DialogContent>
					<DialogHeader overhead={t("docs.dialog.examples.overhead.eyebrow")}>
						<DialogTitle>
							{t("docs.dialog.examples.overhead.title")}
						</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<p className="ty-body">{t("docs.dialog.examples.overhead.body")}</p>
					</DialogBody>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isOverflowOpen}
				onOpenChange={setIsOverflowOpen}
			>
				<DialogContent>
					<DialogHeader overhead={t("docs.dialog.examples.overflow.eyebrow")}>
						<DialogTitle>
							{t("docs.dialog.examples.overflow.title")}
						</DialogTitle>
					</DialogHeader>
					<DialogBody>
						{(["one", "two", "three", "four", "five", "six"] as const).map(
							key => (
								<p
									key={key}
									className="ty-body"
								>
									{t(`docs.dialog.examples.overflow.paragraphs.${key}`)}
								</p>
							),
						)}
					</DialogBody>
				</DialogContent>
			</Dialog>
		</ParticleContainer>
	);
}
