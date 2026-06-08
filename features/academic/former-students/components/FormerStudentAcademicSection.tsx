"use client";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AccountSummaryBadges } from "@/components/composite";
import {
	Combobox,
	DatePicker,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/primitives";
import type { FormerStudentAcademicSectionProps } from "@/types/client";

export function FormerStudentAcademicSection({
	accountStatusLabel,
	accountStatusTone,
	accountTypeLabel,
	accountTypeTone,
	campusOptions,
	courseOptions,
	form,
}: FormerStudentAcademicSectionProps) {
	const { t } = useTranslation();

	return (
		<section className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-overhead">
					{t("academic.formerStudentPage.editor.sections.academic")}
				</p>
			</div>

			<div className="grid gap-2">
				<Label>{t("academic.formerStudentPage.editor.fields.campus")}</Label>
				<Controller
					control={form.control}
					name="campus"
					render={({ field }) => (
						<Select
							value={field.value}
							onValueChange={field.onChange}
						>
							<SelectTrigger
								className="w-full"
								placeholder={t(
									"academic.formerStudentPage.editor.fields.campusPlaceholder",
								)}
							/>
							<SelectContent>
								{campusOptions.map(option => (
									<SelectItem
										key={option.value}
										value={option.value}
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
				{form.formState.errors.campus ? (
					<p className="field-error">{form.formState.errors.campus.message}</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label>{t("academic.formerStudentPage.editor.fields.course")}</Label>
				<Controller
					control={form.control}
					name="courseId"
					render={({ field }) => (
						<Combobox
							options={courseOptions}
							value={field.value}
							onValueChange={field.onChange}
							placeholder={t("common.placeholders.select")}
							searchPlaceholder={t("common.placeholders.search")}
							emptyMessage={t("common.placeholders.noResults")}
						/>
					)}
				/>
				{form.formState.errors.courseId ? (
					<p className="field-error">
						{form.formState.errors.courseId.message}
					</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="former-student-required-hours">
					{t("academic.formerStudentPage.editor.fields.requiredHours")}
				</Label>
				<Input
					id="former-student-required-hours"
					type="number"
					min="0"
					{...form.register("requiredHours")}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.requiredHoursPlaceholder",
					)}
				/>
				{form.formState.errors.requiredHours ? (
					<p className="field-error">
						{form.formState.errors.requiredHours.message}
					</p>
				) : null}
			</div>

			<AccountSummaryBadges
				accountTypeFieldLabel={t("common.fields.accountType")}
				accountTypeLabel={accountTypeLabel}
				accountTypeTone={accountTypeTone}
				activeFieldLabel={t("common.fields.active")}
				activeLabel={accountStatusLabel}
				activeTone={accountStatusTone}
			/>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="grid gap-2">
					<Label>
						{t("academic.formerStudentPage.editor.fields.startDate")}
					</Label>
					<Controller
						control={form.control}
						name="startDate"
						render={({ field }) => (
							<DatePicker
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t(
									"academic.formerStudentPage.editor.fields.startDatePlaceholder",
								)}
							/>
						)}
					/>
					{form.formState.errors.startDate ? (
						<p className="field-error">
							{form.formState.errors.startDate.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label>{t("academic.formerStudentPage.editor.fields.dueDate")}</Label>
					<Controller
						control={form.control}
						name="dueDate"
						render={({ field }) => (
							<DatePicker
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t(
									"academic.formerStudentPage.editor.fields.dueDatePlaceholder",
								)}
							/>
						)}
					/>
					{form.formState.errors.dueDate ? (
						<p className="field-error">
							{form.formState.errors.dueDate.message}
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
}
