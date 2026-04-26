"use client";

import { useState } from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
} from "components";
import { AlertTriangle, ShieldAlert, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "../ParticleContainer";
import { ParticleSection } from "../ParticleSection";

export default function AlertDialogParticle() {
	const { t } = useTranslation();
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isArchiveOpen, setIsArchiveOpen] = useState(false);
	const [isLoadingOpen, setIsLoadingOpen] = useState(false);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.alertDialog.title")}
			description={t("docs.alertDialog.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.alertDialog.patternNotes.items.severity") },
				{ description: t("docs.alertDialog.patternNotes.items.confirmation") },
				{ description: t("docs.alertDialog.patternNotes.items.actions") },
				{ description: t("docs.alertDialog.patternNotes.items.loading") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.alertDialog.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.alertDialog.sections.confirmation.title")}
				description={t("docs.alertDialog.sections.confirmation.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.alertDialog.cards.delete.title")}</CardTitle>
							<CardDescription>
								{t("docs.alertDialog.cards.delete.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								usage="danger"
								variant="flat"
								leadingIcon={
									<Icon
										icon={Trash2}
										className="h-4 w-4"
									/>
								}
								onClick={() => setIsDeleteOpen(true)}
							>
								{t("docs.alertDialog.cards.delete.trigger")}
							</Button>
						</CardContent>
					</Card>

					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.alertDialog.cards.archive.title")}</CardTitle>
							<CardDescription>
								{t("docs.alertDialog.cards.archive.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								usage="warning"
								variant="flat"
								leadingIcon={
									<Icon
										icon={ShieldAlert}
										className="h-4 w-4"
									/>
								}
								onClick={() => setIsArchiveOpen(true)}
							>
								{t("docs.alertDialog.cards.archive.trigger")}
							</Button>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.alertDialog.sections.loading.title")}
				description={t("docs.alertDialog.sections.loading.description")}
			>
				<Card className="flex min-h-44 flex-col justify-between p-4">
					<CardHeader>
						<CardTitle>{t("docs.alertDialog.loadingCard.title")}</CardTitle>
						<CardDescription>
							{t("docs.alertDialog.loadingCard.description")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							usage="secondary"
							variant="flat"
							leadingIcon={
								<Icon
									icon={AlertTriangle}
									className="h-4 w-4"
								/>
							}
							onClick={() => setIsLoadingOpen(true)}
						>
							{t("docs.alertDialog.loadingCard.trigger")}
						</Button>
					</CardContent>
				</Card>
			</ParticleSection>

			<AlertDialog
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader className="border-default-2 border-b p-6">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							{t("docs.alertDialog.examples.delete.eyebrow")}
						</p>
						<AlertDialogTitle>
							{t("docs.alertDialog.examples.delete.title")}
						</AlertDialogTitle>
						<AlertDialogDescription className="ty-helper">
							{t("docs.alertDialog.examples.delete.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>
							<Button
								usage="secondary"
								variant="ghost"
							>
								{t("docs.alertDialog.examples.delete.footer.cancel")}
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction>
							<Button
								usage="danger"
								variant="flat"
							>
								{t("docs.alertDialog.examples.delete.footer.confirm")}
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={isArchiveOpen}
				onOpenChange={setIsArchiveOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader className="border-default-2 border-b p-6">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							{t("docs.alertDialog.examples.archive.eyebrow")}
						</p>
						<AlertDialogTitle>
							{t("docs.alertDialog.examples.archive.title")}
						</AlertDialogTitle>
						<AlertDialogDescription className="ty-helper">
							{t("docs.alertDialog.examples.archive.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>
							<Button
								usage="secondary"
								variant="ghost"
							>
								{t("docs.alertDialog.examples.archive.footer.cancel")}
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction>
							<Button
								usage="warning"
								variant="flat"
							>
								{t("docs.alertDialog.examples.archive.footer.confirm")}
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={isLoadingOpen}
				onOpenChange={setIsLoadingOpen}
				isLoading
				loadingLabel={t("docs.alertDialog.loadingLabel")}
			>
				<AlertDialogContent>
					<AlertDialogHeader className="border-default-2 border-b p-6">
						<AlertDialogTitle>
							{t("docs.alertDialog.loadingExample.title")}
						</AlertDialogTitle>
						<AlertDialogDescription className="ty-helper">
							{t("docs.alertDialog.loadingExample.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Button
								usage="secondary"
								variant="ghost"
							>
								{t("docs.alertDialog.loadingExample.cancel")}
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction>
							<Button
								usage="danger"
								variant="flat"
							>
								{t("docs.alertDialog.loadingExample.confirm")}
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ParticleContainer>
	);
}
