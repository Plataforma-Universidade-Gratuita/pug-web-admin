"use client";

import {
	ArrowRight,
	CheckCircle2,
	Download,
	Info,
	OctagonAlert,
	Plus,
	ShieldAlert,
	Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
} from "../../../components";
import { ParticleContainer } from "./components/ParticleContainer";
import { ParticleSection } from "./components/ParticleSection";

export default function ButtonParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.button.title")}
			description={t("docs.button.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.button.patternNotes.items.usage") },
				{ description: t("docs.button.patternNotes.items.flat") },
				{ description: t("docs.button.patternNotes.items.ghost") },
				{ description: t("docs.button.patternNotes.items.icon") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.button.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.button.sections.usage.title")}
				description={t("docs.button.sections.usage.description")}
			>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{[
						{
							key: "primary",
							usage: "primary" as const,
							icon: (
								<Icon
									icon={ArrowRight}
									className="h-4 w-4"
								/>
							),
						},
						{
							key: "secondary",
							usage: "secondary" as const,
							icon: (
								<Icon
									icon={Download}
									className="h-4 w-4"
								/>
							),
						},
						{
							key: "success",
							usage: "success" as const,
							icon: (
								<Icon
									icon={CheckCircle2}
									className="h-4 w-4"
								/>
							),
						},
						{
							key: "info",
							usage: "info" as const,
							icon: (
								<Icon
									icon={Info}
									className="h-4 w-4"
								/>
							),
						},
						{
							key: "warning",
							usage: "warning" as const,
							icon: (
								<Icon
									icon={OctagonAlert}
									className="h-4 w-4"
								/>
							),
						},
						{
							key: "danger",
							usage: "danger" as const,
							icon: (
								<Icon
									icon={ShieldAlert}
									className="h-4 w-4"
								/>
							),
						},
					].map(item => (
						<Card
							key={item.key}
							className="flex min-h-40 flex-col justify-between p-4"
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
								<Button
									usage={item.usage}
									trailingIcon={item.icon}
								>
									{t(`docs.button.usageCards.${item.key}.label`)}
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.variant.title")}
				description={t("docs.button.sections.variant.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					{[
						{ key: "flat", variant: "flat" as const },
						{ key: "ghost", variant: "ghost" as const },
					].map(item => (
						<Card
							key={item.key}
							className="flex min-h-40 flex-col justify-between p-4"
						>
							<CardHeader>
								<CardTitle>
									{t(`docs.button.variantCards.${item.key}.name`)}
								</CardTitle>
								<CardDescription>
									{t(`docs.button.variantCards.${item.key}.description`)}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									usage="primary"
									variant={item.variant}
									leadingIcon={
										<Icon
											icon={Zap}
											className="h-4 w-4"
										/>
									}
								>
									{t("docs.button.variantCards.label")}
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.scale.title")}
				description={t("docs.button.sections.scale.description")}
			>
				<Card className="p-4">
					<CardContent className="flex flex-wrap items-center gap-3">
						{[
							{ key: "small", size: "sm" as const },
							{ key: "medium", size: "md" as const },
							{ key: "large", size: "lg" as const },
						].map(item => (
							<Button
								key={item.key}
								size={item.size}
								usage="secondary"
								variant="flat"
								leadingIcon={
									<Icon
										icon={Plus}
										className="h-4 w-4"
									/>
								}
							>
								{t(`docs.button.sizes.${item.key}`)}
							</Button>
						))}
						<Button
							size="icon"
							usage="secondary"
							variant="ghost"
							title={t("docs.button.sizes.iconTitle")}
							leadingIcon={
								<Icon
									icon={Plus}
									className="h-4 w-4"
								/>
							}
						/>
					</CardContent>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.states.title")}
				description={t("docs.button.sections.states.description")}
			>
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="space-y-3 p-4">
						<CardTitle>{t("docs.button.statesCards.loading.title")}</CardTitle>
						<CardContent>
							<Button
								isLoading
								loadingText={t("docs.button.statesCards.loading.loadingText")}
								usage="primary"
							>
								{t("docs.button.statesCards.loading.button")}
							</Button>
						</CardContent>
					</Card>
					<Card className="space-y-3 p-4">
						<CardTitle>{t("docs.button.statesCards.disabled.title")}</CardTitle>
						<CardContent>
							<Button
								usage="secondary"
								variant="flat"
								disabled
							>
								{t("docs.button.statesCards.disabled.button")}
							</Button>
						</CardContent>
					</Card>
					<Card className="space-y-3 p-4">
						<CardTitle>
							{t("docs.button.statesCards.fullWidth.title")}
						</CardTitle>
						<CardContent>
							<Button
								className="w-full"
								usage="info"
								variant="flat"
								trailingIcon={
									<Icon
										icon={ArrowRight}
										className="h-4 w-4"
									/>
								}
							>
								{t("docs.button.statesCards.fullWidth.button")}
							</Button>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
