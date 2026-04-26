"use client";

import {
	Breadcrumb,
	BreadcrumbCurrent,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "components";
import { useTranslation } from "react-i18next";

import { ParticleContainer } from "../ParticleContainer";
import { ParticleSection } from "../ParticleSection";

export default function BreadcrumbParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.breadcrumb.title")}
			description={t("docs.breadcrumb.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.breadcrumb.patternNotes.items.location") },
				{ description: t("docs.breadcrumb.patternNotes.items.depth") },
				{ description: t("docs.breadcrumb.patternNotes.items.current") },
				{ description: t("docs.breadcrumb.patternNotes.items.mobile") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.breadcrumb.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.breadcrumb.sections.examples.title")}
				description={t("docs.breadcrumb.sections.examples.description")}
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.breadcrumb.cards.standard.title")}</CardTitle>
							<CardDescription>
								{t("docs.breadcrumb.cards.standard.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink href="#">
											{t("docs.breadcrumb.cards.standard.items.home")}
										</BreadcrumbLink>
										<BreadcrumbSeparator />
									</BreadcrumbItem>
									<BreadcrumbItem>
										<BreadcrumbLink href="#">
											{t("docs.breadcrumb.cards.standard.items.projects")}
										</BreadcrumbLink>
										<BreadcrumbSeparator />
									</BreadcrumbItem>
									<BreadcrumbItem>
										<BreadcrumbCurrent>
											{t("docs.breadcrumb.cards.standard.items.detail")}
										</BreadcrumbCurrent>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</CardContent>
					</Card>

					<Card className="p-4">
						<CardHeader>
							<CardTitle>{t("docs.breadcrumb.cards.dense.title")}</CardTitle>
							<CardDescription>
								{t("docs.breadcrumb.cards.dense.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink href="#">
											{t("docs.breadcrumb.cards.dense.items.admin")}
										</BreadcrumbLink>
										<BreadcrumbSeparator />
									</BreadcrumbItem>
									<BreadcrumbItem>
										<BreadcrumbLink href="#">
											{t("docs.breadcrumb.cards.dense.items.partners")}
										</BreadcrumbLink>
										<BreadcrumbSeparator />
									</BreadcrumbItem>
									<BreadcrumbItem>
										<BreadcrumbLink href="#">
											{t("docs.breadcrumb.cards.dense.items.entity")}
										</BreadcrumbLink>
										<BreadcrumbSeparator />
									</BreadcrumbItem>
									<BreadcrumbItem>
										<BreadcrumbCurrent>
											{t("docs.breadcrumb.cards.dense.items.settings")}
										</BreadcrumbCurrent>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</CardContent>
					</Card>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
