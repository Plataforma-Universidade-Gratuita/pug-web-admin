"use client";

import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
	Combobox,
	Input,
	Label,
	NotFoundState,
	SomeErrorState,
} from "@/components";
import type { EntityEditorFormProps } from "@/types";
import { normalizeDigits } from "@/utils";
import { WebApiError } from "@/utils";

function formatCnpjValue(value: string) {
	const digits = normalizeDigits(value).slice(0, 14);

	if (digits.length <= 2) {
		return digits;
	}

	if (digits.length <= 5) {
		return `${digits.slice(0, 2)}.${digits.slice(2)}`;
	}

	if (digits.length <= 8) {
		return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
	}

	if (digits.length <= 12) {
		return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
	}

	return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function EntityEditorForm({
	canRenderForm,
	citiesError,
	cityOptions,
	entity,
	entityError,
	form,
	mode,
	onRefreshCities,
	onRefreshEntity,
}: EntityEditorFormProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";
	const watchedCnpj = useWatch({
		control: form.control,
		name: "cnpj",
	});
	const shouldWarnMissingDuplicateCnpj =
		mode === "duplicate" && !(watchedCnpj ?? "").trim();
	const hasCnpjError = Boolean(form.formState.errors.cnpj);

	if (!isCreateMode && entityError) {
		if (entityError instanceof WebApiError && entityError.status === 404) {
			return (
				<NotFoundState
					title={t("partner.entityPage.update.notFound.title")}
					description={t("partner.entityPage.update.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("partner.entityPage.update.loadError.title")}
				description={t("partner.entityPage.update.loadError.description")}
				onRefresh={onRefreshEntity}
			/>
		);
	}

	if (citiesError) {
		return (
			<SomeErrorState
				title={t("partner.entityPage.editor.cityLoadError.title")}
				description={t("partner.entityPage.editor.cityLoadError.description")}
				onRefresh={onRefreshCities}
			/>
		);
	}

	if (!canRenderForm) {
		return (
			<NotFoundState title={t("partner.entityPage.update.notFound.title")} />
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="entity-name">
					{t("partner.entityPage.editor.fields.name")}
				</Label>
				<Input
					id="entity-name"
					{...form.register("name")}
					aria-describedby={
						form.formState.errors.name ? "entity-name-error" : undefined
					}
					aria-invalid={form.formState.errors.name ? "true" : "false"}
					placeholder={t("partner.entityPage.editor.fields.name")}
				/>
				{form.formState.errors.name ? (
					<p
						id="entity-name-error"
						className="field-error"
					>
						{form.formState.errors.name.message}
					</p>
				) : null}
			</div>

			{mode === "update" ? (
				<div className="grid gap-1">
					<p className="ty-helper">
						{t("partner.entityPage.editor.fields.cnpj")}
					</p>
					<p className="ty-sm-semibold">
						{entity?.cnpjFormatted ?? form.getValues("cnpj")}
					</p>
				</div>
			) : (
				<div className="grid gap-2">
					<Label htmlFor="entity-cnpj">
						{t("partner.entityPage.editor.fields.cnpj")}
					</Label>
					<Controller
						control={form.control}
						name="cnpj"
						render={({ field }) => (
							<Input
								id="entity-cnpj"
								inputMode="numeric"
								maxLength={18}
								className={
									shouldWarnMissingDuplicateCnpj
										? "border-[color:var(--twc-warning)] ring-1 ring-inset ring-[color:var(--twc-warning)]"
										: undefined
								}
								value={field.value}
								onBlur={field.onBlur}
								name={field.name}
								ref={field.ref}
								onChange={event => {
									field.onChange(formatCnpjValue(event.target.value));
								}}
								aria-describedby={
									form.formState.errors.cnpj ? "entity-cnpj-error" : undefined
								}
								aria-invalid={
									hasCnpjError || shouldWarnMissingDuplicateCnpj ? "true" : "false"
								}
								placeholder={t("partner.entityPage.editor.fields.cnpjPlaceholder")}
							/>
						)}
					/>
					{form.formState.errors.cnpj ? (
						<p
							id="entity-cnpj-error"
							className="field-error"
						>
							{form.formState.errors.cnpj.message}
						</p>
					) : null}
				</div>
			)}

			<div className="grid gap-2">
				<Label htmlFor="entity-city">
					{t("partner.entityPage.editor.fields.city")}
				</Label>
				<Controller
					control={form.control}
					name="cityId"
					render={({ field }) => (
						<Combobox
							id="entity-city"
							options={cityOptions}
							value={field.value}
							onValueChange={field.onChange}
							placeholder={t(
								"partner.entityPage.editor.fields.cityPlaceholder",
							)}
							searchPlaceholder={t(
								"partner.entityPage.editor.fields.citySearchPlaceholder",
							)}
							emptyMessage={t(
								"partner.entityPage.editor.fields.cityEmptyMessage",
							)}
						/>
					)}
				/>
				{form.formState.errors.cityId ? (
					<p className="field-error">{form.formState.errors.cityId.message}</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="entity-address">
					{t("partner.entityPage.editor.fields.address")}
				</Label>
				<Input
					id="entity-address"
					{...form.register("address")}
					placeholder={t("partner.entityPage.editor.fields.addressPlaceholder")}
				/>
			</div>

			{!isCreateMode && entity ? (
				<div className="grid gap-4 pt-2 sm:grid-cols-3">
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("partner.entityPage.dialog.fields.id")}
						</p>
						<p className="ty-sm-semibold">{entity.id}</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("partner.entityPage.dialog.fields.createdAt")}
						</p>
						<p className="ty-sm-semibold">
							{entity.auditInfo.createdAtFormatted}
						</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("partner.entityPage.dialog.fields.updatedAt")}
						</p>
						<p className="ty-sm-semibold">
							{entity.auditInfo.updatedAtFormatted}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
