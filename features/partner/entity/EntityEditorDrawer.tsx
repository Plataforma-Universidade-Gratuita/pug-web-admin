"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Save } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Combobox,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Footer,
	Input,
	Label,
	NotFoundState,
	SomeErrorState,
	toast,
} from "@/components";
import {
	useCreateEntityMutation,
	useUpdateEntityMutation,
} from "@/features/partner/entity/mutations";
import {
	useEntityCitiesQuery,
	useEntityDetailQuery,
} from "@/features/partner/entity/queries";
import {
	buildEntityCityOptions,
	buildEntityDuplicateFormValues,
	buildEntityUpdateFormValues,
	createEntityEditorFormSchema,
	getEmptyEntityEditorFormValues,
	getEntityCreateErrorToastContent,
	getEntityDetailErrorToastContent,
	getEntityDuplicateErrorToastContent,
	getEntityUpdateErrorToastContent,
	toEntityCreateRequest,
	toEntityUpdateRequest,
} from "@/features/partner/entity/utils";
import { useLocalizedZodForm } from "@/hooks";
import type {
	EntityEditorDrawerProps,
	EntityEditorFormValues,
} from "@/types/client/partner";
import { WebApiError } from "@/utils/web-api";

export function EntityEditorDrawer({
	entityId,
	mode,
	open,
	onOpenChange,
}: EntityEditorDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const entityDetailQuery = useEntityDetailQuery(entityId);
	const citiesQuery = useEntityCitiesQuery();
	const createMutation = useCreateEntityMutation();
	const updateMutation = useUpdateEntityMutation();
	const detailErrorToastAtRef = useRef(0);
	const lastHydratedKeyRef = useRef<string | null>(null);
	const cityOptions = useMemo(
		() => buildEntityCityOptions(citiesQuery.data ?? []),
		[citiesQuery.data],
	);
	const emptyValues = useMemo(() => getEmptyEntityEditorFormValues(), []);
	const form = useLocalizedZodForm<EntityEditorFormValues>({
		schemaFactory: translated => createEntityEditorFormSchema(translated, mode),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!entityDetailQuery.data) {
			return null;
		}

		return isDuplicateMode
			? buildEntityDuplicateFormValues(entityDetailQuery.data)
			: buildEntityUpdateFormValues(entityDetailQuery.data);
	}, [emptyValues, entityDetailQuery.data, isCreateMode, isDuplicateMode]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !entityDetailQuery.data) {
			return null;
		}

		return [
			mode,
			entityDetailQuery.data.id,
			loadedFormValues.cnpj,
			loadedFormValues.name,
			loadedFormValues.cityId,
			loadedFormValues.address,
		].join("|");
	}, [entityDetailQuery.data, isCreateMode, loadedFormValues, mode]);
	const canRenderForm = isCreateMode ? true : Boolean(entityDetailQuery.data);
	const isDrawerLoading =
		open &&
		(citiesQuery.isLoading || (!isCreateMode && entityDetailQuery.isLoading));
	const isSubmitPending = createMutation.isPending || updateMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "partner.entityPage.create.overhead"
			: isDuplicateMode
				? "partner.entityPage.duplicate.overhead"
				: "partner.entityPage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "partner.entityPage.create.titleFallback"
			: isDuplicateMode
				? "partner.entityPage.duplicate.titleFallback"
				: "partner.entityPage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "partner.entityPage.create.actions.save"
			: isDuplicateMode
				? "partner.entityPage.duplicate.actions.save"
				: "partner.entityPage.update.actions.save",
	);
	const savePendingLabel = t(
		isCreateMode
			? "partner.entityPage.create.actions.savePending"
			: isDuplicateMode
				? "partner.entityPage.duplicate.actions.savePending"
				: "partner.entityPage.update.actions.savePending",
	);

	useEffect(() => {
		if (!entityDetailQuery.isError || entityDetailQuery.errorUpdatedAt === 0) {
			return;
		}

		if (detailErrorToastAtRef.current === entityDetailQuery.errorUpdatedAt) {
			return;
		}

		detailErrorToastAtRef.current = entityDetailQuery.errorUpdatedAt;
		const { title, description } = getEntityDetailErrorToastContent(
			t,
			entityDetailQuery.error,
		);
		toast.danger(title, { description });
	}, [
		entityDetailQuery.error,
		entityDetailQuery.errorUpdatedAt,
		entityDetailQuery.isError,
		t,
	]);

	useEffect(() => {
		if (!open) {
			lastHydratedKeyRef.current = null;
			form.reset(emptyValues);
		}
	}, [emptyValues, form, open]);

	useEffect(() => {
		if (!open || !loadedFormValues || !hydrationKey) {
			return;
		}

		if (lastHydratedKeyRef.current === hydrationKey) {
			return;
		}

		form.reset(loadedFormValues);
		lastHydratedKeyRef.current = hydrationKey;
	}, [form, hydrationKey, loadedFormValues, open]);

	function closeDrawer() {
		onOpenChange(false);
	}

	function handleDrawerOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			setIsResetConfirmOpen(false);
		}

		onOpenChange(nextOpen);
	}

	function resetForm() {
		form.reset(loadedFormValues ?? emptyValues);
		setIsResetConfirmOpen(false);
	}

	function onSubmit(values: EntityEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					body: toEntityCreateRequest(values),
				},
				{
					onSuccess: entity => {
						toast.success(
							t(
								isCreateMode
									? "partner.entityPage.create.feedback.success.title"
									: "partner.entityPage.duplicate.feedback.success.title",
							),
							{
								description: t(
									isCreateMode
										? "partner.entityPage.create.feedback.success.description"
										: "partner.entityPage.duplicate.feedback.success.description",
									{
										name: entity.name,
									},
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = isCreateMode
							? getEntityCreateErrorToastContent(t, error)
							: getEntityDuplicateErrorToastContent(t, error);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		if (!entityId) {
			return;
		}

		updateMutation.mutate(
			{
				id: entityId,
				body: toEntityUpdateRequest(values),
			},
			{
				onSuccess: entity => {
					toast.success(t("partner.entityPage.update.feedback.success.title"), {
						description: t(
							"partner.entityPage.update.feedback.success.description",
							{
								name: entity.name,
							},
						),
					});
					closeDrawer();
				},
				onError: error => {
					const { title, description } = getEntityUpdateErrorToastContent(
						t,
						error,
					);
					toast.danger(title, { description });
				},
			},
		);
	}

	function renderDrawerContent() {
		if (!isCreateMode && entityDetailQuery.isError) {
			if (
				entityDetailQuery.error instanceof WebApiError &&
				entityDetailQuery.error.status === 404
			) {
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
					onRefresh={() => {
						void entityDetailQuery.refetch();
					}}
				/>
			);
		}

		if (citiesQuery.isError) {
			return (
				<SomeErrorState
					title={t("partner.entityPage.editor.cityLoadError.title")}
					description={t("partner.entityPage.editor.cityLoadError.description")}
					onRefresh={() => {
						void citiesQuery.refetch();
					}}
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
							{entityDetailQuery.data?.cnpjFormatted ?? form.getValues("cnpj")}
						</p>
					</div>
				) : (
					<div className="grid gap-2">
						<Label htmlFor="entity-cnpj">
							{t("partner.entityPage.editor.fields.cnpj")}
						</Label>
						<Input
							id="entity-cnpj"
							inputMode="numeric"
							{...form.register("cnpj")}
							aria-describedby={
								form.formState.errors.cnpj ? "entity-cnpj-error" : undefined
							}
							aria-invalid={form.formState.errors.cnpj ? "true" : "false"}
							placeholder={t(
								"partner.entityPage.editor.fields.cnpjPlaceholder",
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
						<p className="field-error">
							{form.formState.errors.cityId.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="entity-address">
						{t("partner.entityPage.editor.fields.address")}
					</Label>
					<Input
						id="entity-address"
						{...form.register("address")}
						placeholder={t(
							"partner.entityPage.editor.fields.addressPlaceholder",
						)}
					/>
				</div>

				{!isCreateMode && entityDetailQuery.data ? (
					<div className="grid gap-4 pt-2 sm:grid-cols-3">
						<div className="grid gap-1">
							<p className="ty-helper">
								{t("partner.entityPage.dialog.fields.id")}
							</p>
							<p className="ty-sm-semibold">{entityDetailQuery.data.id}</p>
						</div>
						<div className="grid gap-1">
							<p className="ty-helper">
								{t("partner.entityPage.dialog.fields.createdAt")}
							</p>
							<p className="ty-sm-semibold">
								{entityDetailQuery.data.auditInfo.createdAtFormatted}
							</p>
						</div>
						<div className="grid gap-1">
							<p className="ty-helper">
								{t("partner.entityPage.dialog.fields.updatedAt")}
							</p>
							<p className="ty-sm-semibold">
								{entityDetailQuery.data.auditInfo.updatedAtFormatted}
							</p>
						</div>
					</div>
				) : null}
			</div>
		);
	}

	return (
		<>
			<Drawer
				open={open}
				onOpenChange={handleDrawerOpenChange}
				isLoading={isDrawerLoading}
				loadingLabel={t("partner.entityPage.editor.loading")}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{entityDetailQuery.data?.name ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						{renderDrawerContent()}
					</DrawerBody>

					<Footer className="drawer-footer">
						<Button
							variant="secondary"
							usage="danger"
							disabled={!form.formState.isDirty || isSubmitPending}
							onClick={() => setIsResetConfirmOpen(true)}
						>
							{t("partner.entityPage.editor.actions.reset")}
						</Button>
						<Button
							usage="success"
							isLoading={isSubmitPending}
							loadingText={savePendingLabel}
							leadingIcon={<Save className="h-4 w-4" />}
							disabled={!form.formState.isDirty}
							onClick={() => {
								void form.handleSubmit(onSubmit)();
							}}
						>
							{saveLabel}
						</Button>
					</Footer>
				</DrawerContent>
			</Drawer>

			<AlertDialog
				open={isResetConfirmOpen}
				onOpenChange={setIsResetConfirmOpen}
			>
				<AlertDialogContent variant="danger">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("partner.entityPage.editor.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("partner.entityPage.editor.resetConfirm.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("partner.entityPage.editor.actions.reset")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
