"use client";

import { useState } from "react";

import { ArrowRight, PanelsTopLeft, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	Icon,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function DrawerParticle() {
	const { t } = useTranslation();
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.drawer.title")}
			description={t("docs.drawer.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.drawer.patternNotes.items.context") },
				{ description: t("docs.drawer.patternNotes.items.side") },
				{ description: t("docs.drawer.patternNotes.items.footer") },
				{ description: t("docs.drawer.patternNotes.items.escalation") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.drawer.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.drawer.sections.examples.title")}
				description={t("docs.drawer.sections.examples.description")}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.drawer.cards.details.title")}</CardTitle>
							<CardDescription>
								{t("docs.drawer.cards.details.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								usage="primary"
								variant="flat"
								leadingIcon={
									<Icon
										icon={PanelsTopLeft}
										className="h-4 w-4"
									/>
								}
								onClick={() => setIsDetailsOpen(true)}
							>
								{t("docs.drawer.cards.details.trigger")}
							</Button>
						</CardContent>
					</Card>

					<Card className="flex min-h-44 flex-col justify-between p-4">
						<CardHeader>
							<CardTitle>{t("docs.drawer.cards.filters.title")}</CardTitle>
							<CardDescription>
								{t("docs.drawer.cards.filters.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								usage="secondary"
								variant="ghost"
								leadingIcon={
									<Icon
										icon={SlidersHorizontal}
										className="h-4 w-4"
									/>
								}
								onClick={() => setIsFiltersOpen(true)}
							>
								{t("docs.drawer.cards.filters.trigger")}
							</Button>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>

			<Drawer
				open={isDetailsOpen}
				onOpenChange={setIsDetailsOpen}
			>
				<DrawerContent side="right">
					<DrawerHeader className="border-default-2 border-b">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							{t("docs.drawer.examples.details.eyebrow")}
						</p>
						<DrawerTitle>{t("docs.drawer.examples.details.title")}</DrawerTitle>
						<DrawerDescription className="ty-helper">
							{t("docs.drawer.examples.details.description")}
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex-1 space-y-4 overflow-y-auto p-6">
						{(["owner", "status", "updated"] as const).map(key => (
							<div
								key={key}
								className="border-default-2 rounded-[var(--twc-radius-lg)] border p-4"
							>
								<p className="ty-sm-semibold">
									{t(`docs.drawer.examples.details.items.${key}.title`)}
								</p>
								<p className="ty-helper mt-1">
									{t(`docs.drawer.examples.details.items.${key}.description`)}
								</p>
							</div>
						))}
					</div>

					<DrawerFooter>
						<DrawerClose>
							<Button
								usage="secondary"
								variant="ghost"
							>
								{t("docs.drawer.examples.details.footer.secondary")}
							</Button>
						</DrawerClose>
						<DrawerClose>
							<Button
								usage="primary"
								variant="flat"
								trailingIcon={
									<Icon
										icon={ArrowRight}
										className="h-4 w-4"
									/>
								}
							>
								{t("docs.drawer.examples.details.footer.primary")}
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

			<Drawer
				open={isFiltersOpen}
				onOpenChange={setIsFiltersOpen}
			>
				<DrawerContent side="left">
					<DrawerHeader className="border-default-2 border-b">
						<p className="ty-sm-semibold tracking-[0.12em] text-[color:var(--twc-muted)] uppercase">
							{t("docs.drawer.examples.filters.eyebrow")}
						</p>
						<DrawerTitle>{t("docs.drawer.examples.filters.title")}</DrawerTitle>
						<DrawerDescription className="ty-helper">
							{t("docs.drawer.examples.filters.description")}
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex-1 space-y-3 overflow-y-auto p-6">
						{(["status", "owner", "period"] as const).map(key => (
							<div
								key={key}
								className="border-default-2 rounded-[var(--twc-radius-lg)] border p-4"
							>
								<p className="ty-sm-semibold">
									{t(`docs.drawer.examples.filters.items.${key}.title`)}
								</p>
								<p className="ty-helper mt-1">
									{t(`docs.drawer.examples.filters.items.${key}.description`)}
								</p>
							</div>
						))}
					</div>

					<DrawerFooter>
						<DrawerClose>
							<Button
								usage="secondary"
								variant="ghost"
							>
								{t("docs.drawer.examples.filters.footer.secondary")}
							</Button>
						</DrawerClose>
						<DrawerClose>
							<Button
								usage="info"
								variant="flat"
							>
								{t("docs.drawer.examples.filters.footer.primary")}
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</ParticleContainer>
	);
}
