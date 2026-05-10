"use client";

import {
	ArrowRight,
	CheckCircle2,
	Download,
	Info,
	OctagonAlert,
	Plus,
	ShieldAlert,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Icon,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

const USAGE_ITEMS = [
	{ key: "primary", icon: ArrowRight },
	{ key: "secondary", icon: Download },
	{ key: "success", icon: CheckCircle2 },
	{ key: "info", icon: Info },
	{ key: "warning", icon: OctagonAlert },
	{ key: "danger", icon: ShieldAlert },
] as const;

export default function ButtonParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.button.title")}
			description={t("docs.button.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.button.patternNotes.items.default") },
				{ description: t("docs.button.patternNotes.items.primaryVariant") },
				{ description: t("docs.button.patternNotes.items.secondaryVariant") },
				{ description: t("docs.button.patternNotes.items.actionOrder") },
				{ description: t("docs.button.patternNotes.items.icon") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.button.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.button.sections.default.title")}
				description={t("docs.button.sections.default.description")}
				defaultExpanded
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.button.defaultCard.title")}</CardTitle>
						<CardDescription>
							{t("docs.button.defaultCard.description")}
						</CardDescription>
					</CardHeader>
					<CardFooter className="flex flex-wrap items-center gap-3">
						<Button>{t("docs.button.defaultCard.primary")}</Button>
						<Button
							variant="primary"
							usage="primary"
							size="md"
							trailingIcon={
								<Icon
									icon={ArrowRight}
									className="h-4 w-4"
								/>
							}
						>
							{t("docs.button.defaultCard.explicit")}
						</Button>
						<Button variant="secondary">
							{t("docs.button.defaultCard.secondary")}
						</Button>
					</CardFooter>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.primaryVariant.title")}
				description={t("docs.button.sections.primaryVariant.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.button.variantCards.primary.name")}</CardTitle>
						<CardDescription>
							{t("docs.button.variantCards.primary.description")}
						</CardDescription>
					</CardHeader>
					<CardFooter className="flex flex-wrap items-center gap-3">
						{USAGE_ITEMS.map(item => (
							<Button
								key={item.key}
								variant="primary"
								usage={item.key}
								trailingIcon={
									<Icon
										icon={item.icon}
										className="h-4 w-4"
									/>
								}
							>
								{t(`docs.button.usageCards.${item.key}.label`)}
							</Button>
						))}
					</CardFooter>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.secondaryVariant.title")}
				description={t("docs.button.sections.secondaryVariant.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>
							{t("docs.button.variantCards.secondary.name")}
						</CardTitle>
						<CardDescription>
							{t("docs.button.variantCards.secondary.description")}
						</CardDescription>
					</CardHeader>
					<CardFooter className="flex flex-wrap items-center gap-3">
						{USAGE_ITEMS.map(item => (
							<Button
								key={item.key}
								variant="secondary"
								usage={item.key}
								trailingIcon={
									<Icon
										icon={item.icon}
										className="h-4 w-4"
									/>
								}
							>
								{t(`docs.button.usageCards.${item.key}.label`)}
							</Button>
						))}
					</CardFooter>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.scale.title")}
				description={t("docs.button.sections.scale.description")}
			>
				<Card className="p-4">
					<CardFooter className="flex flex-wrap items-center gap-3">
						{[
							{ key: "small", size: "sm" as const },
							{ key: "medium", size: "md" as const },
							{ key: "large", size: "lg" as const },
						].map(item => (
							<Button
								key={item.key}
								size={item.size}
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
							variant="secondary"
							title={t("docs.button.sizes.iconTitle")}
							leadingIcon={
								<Icon
									icon={Plus}
									className="h-4 w-4"
								/>
							}
						/>
					</CardFooter>
				</Card>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.states.title")}
				description={t("docs.button.sections.states.description")}
			>
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="space-y-3 p-4">
						<CardTitle>{t("docs.button.statesCards.loading.title")}</CardTitle>
						<CardFooter>
							<Button
								isLoading
								loadingText={t("docs.button.statesCards.loading.loadingText")}
							>
								{t("docs.button.statesCards.loading.button")}
							</Button>
						</CardFooter>
					</Card>
					<Card className="space-y-3 p-4">
						<CardTitle>{t("docs.button.statesCards.disabled.title")}</CardTitle>
						<CardFooter>
							<Button
								variant="secondary"
								disabled
							>
								{t("docs.button.statesCards.disabled.button")}
							</Button>
						</CardFooter>
					</Card>
					<Card className="space-y-3 p-4">
						<CardTitle>
							{t("docs.button.statesCards.fullWidth.title")}
						</CardTitle>
						<CardFooter>
							<Button
								className="w-full"
								usage="info"
								trailingIcon={
									<Icon
										icon={ArrowRight}
										className="h-4 w-4"
									/>
								}
							>
								{t("docs.button.statesCards.fullWidth.button")}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.button.sections.actionOrder.title")}
				description={t("docs.button.sections.actionOrder.description")}
			>
				<Card className="p-4">
					<CardHeader>
						<CardTitle>{t("docs.button.actionOrderCard.title")}</CardTitle>
						<CardDescription>
							{t("docs.button.actionOrderCard.description")}
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<div className="flex flex-wrap items-center justify-end gap-3">
							<Button
								variant="secondary"
								usage="danger"
							>
								{t("docs.button.actionOrderCard.left")}
							</Button>
							<Button variant="secondary">
								{t("docs.button.actionOrderCard.middle")}
							</Button>
							<Button
								trailingIcon={
									<Icon
										icon={ArrowRight}
										className="h-4 w-4"
									/>
								}
							>
								{t("docs.button.actionOrderCard.right")}
							</Button>
						</div>
					</CardFooter>
				</Card>
			</ParticleSection>
		</ParticleContainer>
	);
}
