"use client";

import { useState } from "react";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
} from "@/components";
import { Archive, Ellipsis, Eye, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function DropdownMenuParticle() {
	const { t } = useTranslation();
	const [isActionsOpen, setIsActionsOpen] = useState(false);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.dropdownMenu.title")}
			description={t("docs.dropdownMenu.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.dropdownMenu.patternNotes.items.compact") },
				{ description: t("docs.dropdownMenu.patternNotes.items.scope") },
				{ description: t("docs.dropdownMenu.patternNotes.items.grouping") },
				{ description: t("docs.dropdownMenu.patternNotes.items.escalation") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.dropdownMenu.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.dropdownMenu.sections.actions.title")}
				description={t("docs.dropdownMenu.sections.actions.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
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
										usage="secondary"
										variant="ghost"
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
									<DropdownMenuItem onClick={() => setIsActionsOpen(false)}>
										<Icon
											icon={Eye}
											className="h-4 w-4"
										/>
										<span className="ty-sm-semibold">
											{t("docs.dropdownMenu.cards.rowActions.items.view")}
										</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setIsActionsOpen(false)}>
										<Icon
											icon={Pencil}
											className="h-4 w-4"
										/>
										<span className="ty-sm-semibold">
											{t("docs.dropdownMenu.cards.rowActions.items.edit")}
										</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => setIsActionsOpen(false)}>
										<Icon
											icon={Archive}
											className="h-4 w-4"
										/>
										<span className="ty-sm-semibold">
											{t("docs.dropdownMenu.cards.rowActions.items.archive")}
										</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-[color:var(--twc-danger)]"
										onClick={() => setIsActionsOpen(false)}
									>
										<Icon
											icon={Trash2}
											className="h-4 w-4"
										/>
										<span className="ty-sm-semibold">
											{t("docs.dropdownMenu.cards.rowActions.items.delete")}
										</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</CardContent>
					</Card>

					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>
								{t("docs.dropdownMenu.cards.grouped.title")}
							</CardTitle>
							<CardDescription>
								{t("docs.dropdownMenu.cards.grouped.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button
										usage="secondary"
										variant="flat"
										trailingIcon={
											<Icon
												icon={Ellipsis}
												className="h-4 w-4"
											/>
										}
									>
										{t("docs.dropdownMenu.cards.grouped.trigger")}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="min-w-60"
								>
									<DropdownMenuLabel>
										{t("docs.dropdownMenu.cards.grouped.sections.primary")}
									</DropdownMenuLabel>
									{(["overview", "members"] as const).map(key => (
										<DropdownMenuItem key={key}>
											<span className="ty-sm-semibold">
												{t(`docs.dropdownMenu.cards.grouped.items.${key}`)}
											</span>
										</DropdownMenuItem>
									))}
									<DropdownMenuSeparator />
									<DropdownMenuLabel>
										{t("docs.dropdownMenu.cards.grouped.sections.secondary")}
									</DropdownMenuLabel>
									{(["archive", "transfer"] as const).map(key => (
										<DropdownMenuItem key={key}>
											<span className="ty-sm-semibold">
												{t(`docs.dropdownMenu.cards.grouped.items.${key}`)}
											</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
