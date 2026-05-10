"use client";

import {
	AlertCircle,
	Bell,
	CheckCircle2,
	Info,
	LoaderCircle,
	TriangleAlert,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button, Icon, toast } from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";
import { wait } from "@/features/docs/primitives/overlays/utils";

export default function ToastParticle() {
	const { t } = useTranslation();

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.toast.title")}
			description={t("docs.toast.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.toast.patternNotes.items.neutral") },
				{ description: t("docs.toast.patternNotes.items.description") },
				{ description: t("docs.toast.patternNotes.items.promise") },
				{ description: t("docs.toast.patternNotes.items.scope") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.toast.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.toast.sections.variants.title")}
				description={t("docs.toast.sections.variants.description")}
				defaultExpanded
			>
				<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
					<Button
						usage="secondary"
						variant="secondary"
						leadingIcon={
							<Icon
								icon={Bell}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast(t("docs.toast.variants.neutral.title"), {
								description: t("docs.toast.variants.neutral.description"),
							})
						}
					>
						{t("docs.toast.variants.neutral.button")}
					</Button>
					<Button
						usage="info"
						variant="secondary"
						leadingIcon={
							<Icon
								icon={Info}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.info(t("docs.toast.variants.info.title"), {
								description: t("docs.toast.variants.info.description"),
							})
						}
					>
						{t("docs.toast.variants.info.button")}
					</Button>
					<Button
						usage="success"
						variant="secondary"
						leadingIcon={
							<Icon
								icon={CheckCircle2}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.success(t("docs.toast.variants.success.title"), {
								description: t("docs.toast.variants.success.description"),
							})
						}
					>
						{t("docs.toast.variants.success.button")}
					</Button>
					<Button
						usage="warning"
						variant="secondary"
						leadingIcon={
							<Icon
								icon={TriangleAlert}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.warning(t("docs.toast.variants.warning.title"), {
								description: t("docs.toast.variants.warning.description"),
							})
						}
					>
						{t("docs.toast.variants.warning.button")}
					</Button>
					<Button
						usage="danger"
						variant="secondary"
						leadingIcon={
							<Icon
								icon={TriangleAlert}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.danger(t("docs.toast.variants.danger.title"), {
								description: t("docs.toast.variants.danger.description"),
							})
						}
					>
						{t("docs.toast.variants.danger.button")}
					</Button>
				</div>
			</ParticleSection>

			<ParticleSection
				title={t("docs.toast.sections.async.title")}
				description={t("docs.toast.sections.async.description")}
				defaultExpanded
			>
				<div className="grid gap-3 md:grid-cols-3">
					<Button
						usage="primary"
						leadingIcon={
							<Icon
								icon={LoaderCircle}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.promise(
								wait(1200).then(() => "Notification preferences"),
								{
									loading: t("docs.toast.async.promise.loading"),
									success: value =>
										t("docs.toast.async.promise.success", { value }),
									error: t("docs.toast.async.promise.error"),
									description: value =>
										t("docs.toast.async.promise.description", { value }),
								},
							)
						}
					>
						{t("docs.toast.async.promise.button")}
					</Button>
					<Button
						usage="secondary"
						variant="secondary"
						leadingIcon={
							<Icon
								icon={Bell}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.undo(t("docs.toast.async.undo.title"), {
								onUndo: () => alert("Undo action"),
							})
						}
					>
						{t("docs.toast.async.undo.button")}
					</Button>
					<Button
						usage="danger"
						variant="secondary"
						leadingIcon={
							<Icon
								icon={AlertCircle}
								className="h-4 w-4"
							/>
						}
						onClick={() =>
							toast.danger(t("docs.toast.async.apiError.title"), {
								description: t("docs.toast.async.apiError.description"),
							})
						}
					>
						{t("docs.toast.async.apiError.button")}
					</Button>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
