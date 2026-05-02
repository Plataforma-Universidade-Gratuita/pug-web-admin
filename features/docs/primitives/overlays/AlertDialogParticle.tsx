"use client";

import { useState } from "react";

import { CheckCircle2, Info, ShieldAlert, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	AlertDialog,
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
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

type VariantKey = "default" | "success" | "warning" | "danger";

export default function AlertDialogParticle() {
	const { t } = useTranslation();
	const [openKey, setOpenKey] = useState<VariantKey | null>(null);

	return (
		<>
			<ParticleContainer
				eyebrow={t("docs.shared.eyebrow")}
				title={t("docs.alertDialog.title")}
				description={t("docs.alertDialog.description")}
				patternNotesTitle={t("docs.shared.patternNotesTitle")}
				patternNotesItems={[
					{ description: t("docs.alertDialog.patternNotes.items.fixed") },
					{ description: t("docs.alertDialog.patternNotes.items.overhead") },
					{ description: t("docs.alertDialog.patternNotes.items.actions") },
					{ description: t("docs.alertDialog.patternNotes.items.severity") },
				]}
				patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
				patternNotesSnippet={t("docs.alertDialog.patternNotes.snippet")}
			>
				<ParticleSection
					title={t("docs.alertDialog.sections.variants.title")}
					description={t("docs.alertDialog.sections.variants.description")}
					defaultExpanded
				>
					<div className="grid gap-4 md:grid-cols-2">
						{(
							[
								["default", Info],
								["success", CheckCircle2],
								["warning", ShieldAlert],
								["danger", Trash2],
							] as const
						).map(([key, icon]) => (
							<Card
								key={key}
								className="flex min-h-44 flex-col justify-between p-4"
							>
								<CardHeader>
									<CardTitle>
										{t(`docs.alertDialog.cards.${key}.title`)}
									</CardTitle>
									<CardDescription>
										{t(`docs.alertDialog.cards.${key}.description`)}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Button
										usage={
											key === "success"
												? "success"
												: key === "warning"
													? "warning"
													: key === "danger"
														? "danger"
														: "primary"
										}
										leadingIcon={
											<Icon
												icon={icon}
												className="h-4 w-4"
											/>
										}
										onClick={() => setOpenKey(key)}
									>
										{t(`docs.alertDialog.cards.${key}.trigger`)}
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</ParticleSection>
			</ParticleContainer>

			{(["default", "success", "warning", "danger"] as const).map(key => (
				<AlertDialog
					key={key}
					open={openKey === key}
					onOpenChange={open => {
						if (!open) setOpenKey(null);
					}}
				>
					<AlertDialogContent variant={key}>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t(`docs.alertDialog.examples.${key}.title`)}
							</AlertDialogTitle>
							<AlertDialogDescription className="ty-helper">
								{t(`docs.alertDialog.examples.${key}.description`)}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter
							cancelLabel={t(`docs.alertDialog.examples.${key}.footer.cancel`)}
							actionLabel={t(`docs.alertDialog.examples.${key}.footer.confirm`)}
						/>
					</AlertDialogContent>
				</AlertDialog>
			))}
		</>
	);
}
