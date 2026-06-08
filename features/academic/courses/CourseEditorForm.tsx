"use client";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WebApiError } from "@/api/web";
import {
	AreaOfExpertiseDetailsContent,
	CourseOwnDetailsContent,
} from "@/components/composite";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Combobox,
	Input,
	Label,
	NotFoundState,
	SomeErrorState,
} from "@/components/primitives";
import type { CourseEditorFormProps } from "@/types/client";

export function CourseEditorForm({
	areaOfExpertiseOptions,
	areasOfExpertiseError,
	canRenderForm,
	course,
	courseError,
	form,
	onRefreshAreasOfExpertise,
	onRefreshCourse,
}: CourseEditorFormProps) {
	const { t } = useTranslation();

	if (courseError) {
		if (courseError instanceof WebApiError && courseError.status === 404) {
			return (
				<NotFoundState
					title={t("common.notFound.title")}
					description={t("common.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("common.errors.editorLoad.title", {
					object: t("common.objects.course"),
				})}
				description={t("common.errors.editorLoad.description", {
					object: t("common.objects.course"),
				})}
				onRefresh={onRefreshCourse}
			/>
		);
	}

	if (areasOfExpertiseError) {
		return (
			<SomeErrorState
				title={t("common.loadErrors.areasOfExpertise.title")}
				description={t("common.loadErrors.areasOfExpertise.description")}
				onRefresh={onRefreshAreasOfExpertise}
			/>
		);
	}

	if (!canRenderForm) {
		return <NotFoundState title={t("common.notFound.title")} />;
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="course-name">
					{t("academic.coursePage.editor.fields.name")}
				</Label>
				<Input
					id="course-name"
					{...form.register("name")}
					aria-describedby={
						form.formState.errors.name ? "course-name-error" : undefined
					}
					aria-invalid={form.formState.errors.name ? "true" : "false"}
					placeholder={t("academic.coursePage.editor.fields.namePlaceholder")}
				/>
				{form.formState.errors.name ? (
					<p
						id="course-name-error"
						className="field-error"
					>
						{form.formState.errors.name.message}
					</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="course-area-of-expertise">
					{t("common.fields.areaOfExpertise")}
				</Label>
				<Controller
					control={form.control}
					name="areaOfExpertiseId"
					render={({ field }) => (
						<Combobox
							id="course-area-of-expertise"
							options={areaOfExpertiseOptions}
							value={field.value}
							onValueChange={field.onChange}
							placeholder={t("common.placeholders.select")}
							searchPlaceholder={t("common.placeholders.search")}
							emptyMessage={t("common.placeholders.noResults")}
						/>
					)}
				/>
				{form.formState.errors.areaOfExpertiseId ? (
					<p className="field-error">
						{form.formState.errors.areaOfExpertiseId.message}
					</p>
				) : null}
			</div>

			{course ? (
				<>
					<CourseOwnDetailsContent
						course={course}
						columns={2}
					/>
					<Accordion
						type="single"
						collapsible
						className="pt-2"
						defaultValue="linked-area-of-expertise"
					>
						<AccordionItem value="linked-area-of-expertise">
							<AccordionTrigger>
								{t("academic.coursePage.dialog.linkedAreaOfExpertise.overhead")}
							</AccordionTrigger>
							<AccordionContent>
								<AreaOfExpertiseDetailsContent
									areaOfExpertise={course.areaOfExpertise}
									columns={2}
									includeName={false}
								/>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</>
			) : null}
		</div>
	);
}
