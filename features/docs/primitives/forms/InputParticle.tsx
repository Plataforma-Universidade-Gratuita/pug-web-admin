"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	Input,
	Label,
} from "@/components";
import { Mail, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function InputParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.input.title")}
			description={t("docs.input.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.input.patternNotes.items.base") },
				{ description: t("docs.input.patternNotes.items.password") },
				{ description: t("docs.input.patternNotes.items.icons") },
				{ description: t("docs.input.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.input.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.input.sections.fields.title")}
				description={t("docs.input.sections.fields.description")}
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.input.cards.email.title")}</CardTitle>
							<CardDescription>
								{t("docs.input.cards.email.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-input-email">
								{t("docs.input.cards.email.label")}
							</Label>
							<Input
								id="docs-input-email"
								type="email"
								placeholder={t("docs.input.cards.email.placeholder")}
								leadingIcon={
									<Icon
										icon={Mail}
										className="h-4 w-4"
									/>
								}
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.input.cards.password.title")}</CardTitle>
							<CardDescription>
								{t("docs.input.cards.password.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-input-password">
								{t("docs.input.cards.password.label")}
							</Label>
							<Input
								id="docs-input-password"
								type="password"
								showPasswordToggle
								placeholder={t("docs.input.cards.password.placeholder")}
							/>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.input.sections.search.title")}
				description={t("docs.input.sections.search.description")}
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card className="p-4">
						<CardContent className="space-y-2">
							<Label htmlFor="docs-input-search">
								{t("docs.input.search.label")}
							</Label>
							<Input
								id="docs-input-search"
								type="search"
								defaultValue={t("docs.input.search.value")}
								placeholder={t("docs.input.search.placeholder")}
								leadingIcon={
									<Icon
										icon={Search}
										className="h-4 w-4"
									/>
								}
							/>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.input.cards.disabled.title")}</CardTitle>
							<CardDescription>
								{t("docs.input.cards.disabled.description")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<Label htmlFor="docs-input-disabled">
								{t("docs.input.cards.disabled.label")}
							</Label>
							<Input
								id="docs-input-disabled"
								disabled
								value={t("docs.input.cards.disabled.value")}
								readOnly
							/>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
