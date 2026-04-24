"use client";

import { useState } from "react";

import { ArrowRight, FileText, Info, Layers3 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui";

import { ParticleContainer } from "./components/ParticleContainer";
import { ParticleSection } from "./components/ParticleSection";

export default function DialogParticle() {
	const { t } = useTranslation();
	const [isBasicOpen, setIsBasicOpen] = useState(false);
	const [isFooterOpen, setIsFooterOpen] = useState(false);
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
				{ description: t("docs.dialog.patternNotes.items.actions") },
				{ description: t("docs.dialog.patternNotes.items.overflow") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.dialog.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.dialog.sections.structure.title")}
				description={t("docs.dialog.sections.structure.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="border-default-2 surface-1 flex min-h-44 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4">
						<div className="space-y-1">
							<h3 className="ty-sm-bold">
								{t("docs.dialog.structureCards.basic.title")}
							</h3>
							<p className="ty-helper">
								{t("docs.dialog.structureCards.basic.description")}
							</p>
						</div>
						<Button
							usage="primary"
							variant="flat"
							leadingIcon={<Layers3 className="h-4 w-4" />}
							onClick={() => setIsBasicOpen(true)}
						>
							{t("docs.dialog.structureCards.basic.trigger")}
						</Button>
					</div>

					<div className="border-default-2 surface-1 flex min-h-44 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4">
						<div className="space-y-1">
							<h3 className="ty-sm-bold">
								{t("docs.dialog.structureCards.description.title")}
							</h3>
							<p className="ty-helper">
								{t("docs.dialog.structureCards.description.description")}
							</p>
						</div>
						<Button
							usage="secondary"
							variant="flat"
							leadingIcon={<Info className="h-4 w-4" />}
							onClick={() => setIsFooterOpen(true)}
						>
							{t("docs.dialog.structureCards.description.trigger")}
						</Button>
					</div>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.dialog.sections.footer.title")}
				description={t("docs.dialog.sections.footer.description")}
			>
				<div className="border-default-2 surface-1 flex min-h-44 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4">
					<div className="space-y-1">
						<h3 className="ty-sm-bold">{t("docs.dialog.footerCard.title")}</h3>
						<p className="ty-helper">
							{t("docs.dialog.footerCard.description")}
						</p>
					</div>
					<Button
						usage="primary"
						variant="flat"
						trailingIcon={<ArrowRight className="h-4 w-4" />}
						onClick={() => setIsFooterOpen(true)}
					>
						{t("docs.dialog.footerCard.trigger")}
					</Button>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.dialog.sections.overflow.title")}
				description={t("docs.dialog.sections.overflow.description")}
			>
				<div className="border-default-2 surface-1 flex min-h-44 flex-col justify-between rounded-[var(--twc-radius-xl)] border p-4">
					<div className="space-y-1">
						<h3 className="ty-sm-bold">
							{t("docs.dialog.overflowCard.title")}
						</h3>
						<p className="ty-helper">
							{t("docs.dialog.overflowCard.description")}
						</p>
					</div>
					<Button
						usage="secondary"
						variant="ghost"
						leadingIcon={<FileText className="h-4 w-4" />}
						onClick={() => setIsOverflowOpen(true)}
					>
						{t("docs.dialog.overflowCard.trigger")}
					</Button>
				</div>
			</ParticleSection>

			<Dialog
				open={isBasicOpen}
				onOpenChange={setIsBasicOpen}
			>
				<DialogContent>
					<DialogHeader className="border-default-2 border-b p-6">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							{t("docs.dialog.examples.basic.eyebrow")}
						</p>
						<DialogTitle>{t("docs.dialog.examples.basic.title")}</DialogTitle>
						<DialogDescription className="ty-helper">
							{t("docs.dialog.examples.basic.description")}
						</DialogDescription>
					</DialogHeader>

					<div className="flex-1 space-y-4 overflow-y-auto p-6">
						<p className="ty-body">{t("docs.dialog.examples.basic.body")}</p>
					</div>

					<DialogFooter>
						<Button
							usage="secondary"
							variant="ghost"
							onClick={() => setIsBasicOpen(false)}
						>
							{t("docs.dialog.examples.basic.footer.secondary")}
						</Button>
						<Button
							usage="primary"
							variant="flat"
							onClick={() => setIsBasicOpen(false)}
						>
							{t("docs.dialog.examples.basic.footer.primary")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isFooterOpen}
				onOpenChange={setIsFooterOpen}
			>
				<DialogContent>
					<DialogHeader className="border-default-2 border-b p-6">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							{t("docs.dialog.examples.footer.eyebrow")}
						</p>
						<DialogTitle>{t("docs.dialog.examples.footer.title")}</DialogTitle>
						<DialogDescription className="ty-helper">
							{t("docs.dialog.examples.footer.description")}
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button
							usage="secondary"
							variant="ghost"
							onClick={() => setIsFooterOpen(false)}
						>
							{t("docs.dialog.examples.footer.footer.tertiary")}
						</Button>
						<Button
							usage="secondary"
							variant="ghost"
							onClick={() => setIsFooterOpen(false)}
						>
							{t("docs.dialog.examples.footer.footer.secondary")}
						</Button>
						<Button
							usage="danger"
							variant="flat"
							onClick={() => setIsFooterOpen(false)}
						>
							{t("docs.dialog.examples.footer.footer.primary")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isOverflowOpen}
				onOpenChange={setIsOverflowOpen}
			>
				<DialogContent>
					<DialogHeader className="border-default-2 border-b p-6">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							{t("docs.dialog.examples.overflow.eyebrow")}
						</p>
						<DialogTitle>
							{t("docs.dialog.examples.overflow.title")}
						</DialogTitle>
						<DialogDescription className="ty-helper">
							{t("docs.dialog.examples.overflow.description")}
						</DialogDescription>
					</DialogHeader>

					<div className="flex-1 space-y-4 overflow-y-auto p-6">
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
					</div>

					<DialogFooter>
						<Button
							usage="info"
							variant="flat"
							onClick={() => setIsOverflowOpen(false)}
						>
							{t("docs.dialog.examples.overflow.footer.primary")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</ParticleContainer>
	);
}
