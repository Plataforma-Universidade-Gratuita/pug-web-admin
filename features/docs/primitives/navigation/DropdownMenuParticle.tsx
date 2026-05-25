"use client";

import { useMemo, useState } from "react";

import { Archive, Ellipsis, Eye, Pencil, Save, Trash2 } from "lucide-react";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuDangerItem,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPrimaryItem,
	DropdownMenuSeparator,
	DropdownMenuSuccessItem,
	DropdownMenuTrigger,
	DropdownMenuWarningItem,
	Icon,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";
import type { ConfirmAction } from "@/types";

export default function DropdownMenuParticle() {
	const { t } = useTranslation();
	const [isActionsOpen, setIsActionsOpen] = useState(false);
	const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

	const confirmCopy = useMemo(() => {
		if (!confirmAction) return null;

		return {
			actionLabel: t(`docs.dropdownMenu.confirm.${confirmAction}.action`),
			description: t(`docs.dropdownMenu.confirm.${confirmAction}.description`),
			title: t(`docs.dropdownMenu.confirm.${confirmAction}.title`),
		};
	}, [confirmAction, t]);

	return (
		<>
			<ParticleContainer
				eyebrow={t("docs.shared.eyebrow")}
				title={t("docs.dropdownMenu.title")}
				description={t("docs.dropdownMenu.description")}
				patternNotesTitle={t("docs.shared.patternNotesTitle")}
				patternNotesItems={[
					{ description: t("docs.dropdownMenu.patternNotes.items.compact") },
					{ description: t("docs.dropdownMenu.patternNotes.items.scope") },
					{ description: t("docs.dropdownMenu.patternNotes.items.brandFirst") },
					{ description: t("docs.dropdownMenu.patternNotes.items.grouping") },
					{
						description: t("docs.dropdownMenu.patternNotes.items.confirmation"),
					},
				]}
				patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
				patternNotesSnippet={t("docs.dropdownMenu.patternNotes.snippet")}
			>
				<ParticleSection
					title={t("docs.dropdownMenu.sections.actions.title")}
					description={t("docs.dropdownMenu.sections.actions.description")}
					defaultExpanded
				>
					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.dropdownMenu.cards.rowActions.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.dropdownMenu.cards.rowActions.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex items-center justify-between gap-4 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-3">
							<div className="space-y-1">
								<p className="ty-sm-semibold">
									{t("docs.dropdownMenu.cards.rowActions.rowTitle")}
								</p>
								<p className="ty-helper">
									{t("docs.dropdownMenu.cards.rowActions.rowDescription")}
								</p>
							</div>
							<DropdownMenu
								open={isActionsOpen}
								onOpenChange={setIsActionsOpen}
							>
								<DropdownMenuTrigger>
									<Button
										size="icon"
										variant="secondary"
										tooltipContent={t(
											"docs.dropdownMenu.cards.rowActions.trigger",
										)}
									>
										<Icon
											icon={Ellipsis}
											className="h-4 w-4"
										/>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel>
										{t("docs.dropdownMenu.cards.rowActions.menuLabel")}
									</DropdownMenuLabel>
									<DropdownMenuPrimaryItem
										current
										icon={Eye}
										label={t("docs.dropdownMenu.cards.rowActions.items.view")}
										onClick={() => setIsActionsOpen(false)}
									/>
									<DropdownMenuItem
										icon={Pencil}
										label={t("docs.dropdownMenu.cards.rowActions.items.edit")}
										onClick={() => setIsActionsOpen(false)}
									/>
									<DropdownMenuSeparator />
									<DropdownMenuSuccessItem
										icon={Save}
										label={t("docs.dropdownMenu.cards.rowActions.items.save")}
										onClick={() => {
											setIsActionsOpen(false);
											setConfirmAction("save");
										}}
									/>
									<DropdownMenuWarningItem
										icon={Archive}
										label={t(
											"docs.dropdownMenu.cards.rowActions.items.archive",
										)}
										onClick={() => {
											setIsActionsOpen(false);
											setConfirmAction("archive");
										}}
									/>
									<DropdownMenuDangerItem
										icon={Trash2}
										label={t("docs.dropdownMenu.cards.rowActions.items.delete")}
										onClick={() => {
											setIsActionsOpen(false);
											setConfirmAction("delete");
										}}
									/>
								</DropdownMenuContent>
							</DropdownMenu>
						</CardContent>
					</Card>
				</ParticleSection>
			</ParticleContainer>

			<AlertDialog
				open={confirmAction !== null}
				onOpenChange={open => {
					if (!open) setConfirmAction(null);
				}}
			>
				<AlertDialogContent
					variant={
						confirmAction === "save"
							? "success"
							: confirmAction === "archive"
								? "warning"
								: "danger"
					}
				>
					<AlertDialogHeader>
						<AlertDialogTitle>{confirmCopy?.title}</AlertDialogTitle>
						<AlertDialogDescription>
							{confirmCopy?.description}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("docs.dropdownMenu.confirm.cancel")}
						actionLabel={confirmCopy?.actionLabel ?? ""}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
