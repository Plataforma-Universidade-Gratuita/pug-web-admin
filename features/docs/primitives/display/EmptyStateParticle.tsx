"use client";

import { Button, Card, EmptyState, Icon } from "@/components";
import { Inbox, Search, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function EmptyStateParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.emptyState.title")}
			description={t("docs.emptyState.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.emptyState.patternNotes.items.context") },
				{ description: t("docs.emptyState.patternNotes.items.message") },
				{ description: t("docs.emptyState.patternNotes.items.actions") },
				{ description: t("docs.emptyState.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.emptyState.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.emptyState.sections.firstUse.title")}
				description={t("docs.emptyState.sections.firstUse.description")}
			>
				<Card className="p-6">
					<EmptyState
						icon={
							<Icon
								icon={Inbox}
								className="h-5 w-5 text-[color:var(--color-brand)]"
							/>
						}
						title={t("docs.emptyState.firstUse.title")}
						description={t("docs.emptyState.firstUse.description")}
						actions={
							<>
								<Button
									usage="secondary"
									variant="ghost"
								>
									{t("docs.emptyState.firstUse.actions.secondary")}
								</Button>
								<Button
									usage="primary"
									variant="flat"
								>
									{t("docs.emptyState.firstUse.actions.primary")}
								</Button>
							</>
						}
					/>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.emptyState.sections.results.title")}
				description={t("docs.emptyState.sections.results.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="p-6">
						<EmptyState
							icon={
								<Icon
									icon={Search}
									className="h-5 w-5 text-[color:var(--twc-muted)]"
								/>
							}
							title={t("docs.emptyState.results.noResults.title")}
							description={t("docs.emptyState.results.noResults.description")}
							actions={
								<Button
									usage="secondary"
									variant="ghost"
								>
									{t("docs.emptyState.results.noResults.action")}
								</Button>
							}
						/>
					</Card>

					<Card className="p-6">
						<EmptyState
							icon={
								<Icon
									icon={ShieldAlert}
									className="h-5 w-5 text-[color:var(--color-warning)]"
								/>
							}
							title={t("docs.emptyState.results.noAccess.title")}
							description={t("docs.emptyState.results.noAccess.description")}
						/>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.emptyState.sections.compact.title")}
				description={t("docs.emptyState.sections.compact.description")}
			>
				<Card className="p-4">
					<EmptyState
						className="gap-4"
						icon={
							<Icon
								icon={Search}
								className="h-4 w-4 text-[color:var(--twc-muted)]"
							/>
						}
						title={t("docs.emptyState.compact.title")}
						description={t("docs.emptyState.compact.description")}
						actions={
							<Button
								usage="info"
								variant="ghost"
							>
								{t("docs.emptyState.compact.action")}
							</Button>
						}
					/>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
