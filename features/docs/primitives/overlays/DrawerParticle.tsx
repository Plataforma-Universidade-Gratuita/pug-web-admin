"use client";

import { useState } from "react";

import {
	ArrowRight,
	PanelsTopLeft,
	Plus,
	SlidersHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	Icon,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

export default function DrawerParticle() {
	const { t } = useTranslation();
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [createTab, setCreateTab] = useState("general");

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.drawer.title")}
			description={t("docs.drawer.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.drawer.patternNotes.items.context") },
				{ description: t("docs.drawer.patternNotes.items.side") },
				{ description: t("docs.drawer.patternNotes.items.header") },
				{ description: t("docs.drawer.patternNotes.items.body") },
				{ description: t("docs.drawer.patternNotes.items.footer") },
				{ description: t("docs.drawer.patternNotes.items.clear") },
				{ description: t("docs.drawer.patternNotes.items.primary") },
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
							<CardTitle>{t("docs.drawer.cards.create.title")}</CardTitle>
							<CardDescription>
								{t("docs.drawer.cards.create.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								leadingIcon={
									<Icon
										icon={PanelsTopLeft}
										className="h-4 w-4"
									/>
								}
								onClick={() => setIsCreateOpen(true)}
							>
								{t("docs.drawer.cards.create.trigger")}
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
								variant="secondary"
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
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
			>
				<DrawerContent>
					<DrawerHeader overhead={t("docs.drawer.examples.create.eyebrow")}>
						<DrawerTitle>{t("docs.drawer.examples.create.title")}</DrawerTitle>
						<DrawerDescription className="ty-helper">
							{t("docs.drawer.examples.create.description")}
						</DrawerDescription>
					</DrawerHeader>

					<DrawerBody>
						<Tabs
							value={createTab}
							onValueChange={setCreateTab}
						>
							<TabsList>
								{(["general", "ownership", "review"] as const).map(key => (
									<TabsTrigger
										key={key}
										value={key}
									>
										{t(`docs.drawer.examples.create.sections.${key}.title`)}
									</TabsTrigger>
								))}
							</TabsList>
							{(["general", "ownership", "review"] as const).map(key => (
								<TabsContent
									key={key}
									value={key}
									className="border-default-2 mt-4 rounded-[var(--twc-radius-lg)] border p-4"
								>
									<p className="ty-sm-semibold">
										{t(`docs.drawer.examples.create.sections.${key}.title`)}
									</p>
									<p className="ty-helper mt-2">
										{t(
											`docs.drawer.examples.create.sections.${key}.description`,
										)}
									</p>
								</TabsContent>
							))}
						</Tabs>
					</DrawerBody>

					<DrawerFooter
						actionVariant="create"
						clearLabel={t("docs.drawer.examples.create.clear.action")}
						clearConfirmTitle={t("docs.drawer.examples.create.clear.title")}
						clearConfirmDescription={t(
							"docs.drawer.examples.create.clear.description",
						)}
						actionLabel={t("docs.drawer.examples.create.footer.action")}
						actionIcon={Plus}
						onAction={() => setIsCreateOpen(false)}
						onClear={() => setCreateTab("general")}
					/>
				</DrawerContent>
			</Drawer>

			<Drawer
				open={isFiltersOpen}
				onOpenChange={setIsFiltersOpen}
			>
				<DrawerContent>
					<DrawerHeader overhead={t("docs.drawer.examples.filters.eyebrow")}>
						<DrawerTitle>{t("docs.drawer.examples.filters.title")}</DrawerTitle>
						<DrawerDescription className="ty-helper">
							{t("docs.drawer.examples.filters.description")}
						</DrawerDescription>
					</DrawerHeader>

					<DrawerBody className="space-y-4">
						<Accordion
							type="multiple"
							defaultValue={["status"]}
						>
							{(["status", "campus", "advanced"] as const).map(key => (
								<AccordionItem
									key={key}
									value={key}
								>
									<AccordionTrigger>
										{t(`docs.drawer.examples.filters.groups.${key}.title`)}
									</AccordionTrigger>
									<AccordionContent>
										<p className="ty-body">
											{t(
												`docs.drawer.examples.filters.groups.${key}.description`,
											)}
										</p>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</DrawerBody>

					<DrawerFooter
						actionVariant="filters"
						clearLabel={t("docs.drawer.examples.filters.clear.action")}
						clearConfirmTitle={t("docs.drawer.examples.filters.clear.title")}
						clearConfirmDescription={t(
							"docs.drawer.examples.filters.clear.description",
						)}
						actionLabel={t("docs.drawer.examples.filters.footer.action")}
						actionIcon={ArrowRight}
						onAction={() => setIsFiltersOpen(false)}
						onClear={() => undefined}
					/>
				</DrawerContent>
			</Drawer>
		</ParticleContainer>
	);
}
