"use client";

import { useEffect, useMemo } from "react";

import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { web } from "@/api";
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Footer,
	ResetChangesDialog,
	toast,
} from "@/components";
import { EntityEditorForm } from "@/features/partner/entities/EntityEditorForm";
import {
	buildEntityCityOptions,
	buildEntityDuplicateFormValues,
	buildEntityUpdateFormValues,
	createEntityEditorFormSchema,
	getEntityCitiesErrorToastContent,
	getEmptyEntityEditorFormValues,
	getEntityCreateErrorToastContent,
	getEntityDetailErrorToastContent,
	getEntityDuplicateErrorToastContent,
	getEntityUpdateErrorToastContent,
	toEntityCreateRequest,
	toEntityUpdateRequest,
} from "@/features/partner/entities/utils";
import {
	useDrawerResetConfirm,
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type { EntityEditorDrawerProps, EntityEditorFormValues } from "@/types";

const { entities: entitiesApi } = web.partner;
const {
	useCreateEntityMutation,
	useUpdateEntityMutation,
	useEntityCitiesQuery,
	useEntityDetailQuery,
} = entitiesApi;

export function EntityEditorDrawer({
	entityId,
	mode,
	open,
	onOpenChange,
}: EntityEditorDrawerProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const {
		handleDrawerOpenChange,
		isResetConfirmOpen,
		openResetConfirm,
		setIsResetConfirmOpen,
	} = useDrawerResetConfirm({
		onDrawerOpenChange: onOpenChange,
	});
	const entityDetailQuery = useEntityDetailQuery(entityId);
	const citiesQuery = useEntityCitiesQuery();
	const createMutation = useCreateEntityMutation();
	const updateMutation = useUpdateEntityMutation();
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
				? "common.actions.createDuplicate"
				: "common.actions.saveChanges",
	);
	const savePendingLabel = t(
		isCreateMode
			? "partner.entityPage.create.actions.savePending"
			: isDuplicateMode
				? "common.actions.createDuplicatePending"
				: "common.actions.saveChangesPending",
	);

	useQueryErrorToasts([
		{
			key: "entity-editor-detail",
			error: entityDetailQuery.error,
			errorUpdatedAt: entityDetailQuery.errorUpdatedAt,
			getContent: error => getEntityDetailErrorToastContent(t, error),
			isError: entityDetailQuery.isError,
		},
		{
			key: "entity-editor-cities",
			error: citiesQuery.error,
			errorUpdatedAt: citiesQuery.errorUpdatedAt,
			getContent: error => getEntityCitiesErrorToastContent(t, error),
			isError: citiesQuery.isError,
		},
	]);
	useHydratedFormOnOpen({
		emptyValues,
		form,
		hydrationKey,
		loadedValues: loadedFormValues,
		open,
	});

	useEffect(() => {
		if (!open || !isDuplicateMode || !loadedFormValues) {
			return;
		}

		void form.trigger("cnpj");
	}, [form, isDuplicateMode, loadedFormValues, open]);

	function closeDrawer() {
		onOpenChange(false);
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
						<EntityEditorForm
							canRenderForm={canRenderForm}
							citiesError={citiesQuery.isError ? citiesQuery.error : null}
							cityOptions={cityOptions}
							entity={entityDetailQuery.data}
							entityError={
								entityDetailQuery.isError ? entityDetailQuery.error : null
							}
							form={form}
							mode={mode}
							onRefreshCities={() => {
								void citiesQuery.refetch();
							}}
							onRefreshEntity={() => {
								void entityDetailQuery.refetch();
							}}
						/>
					</DrawerBody>

					<Footer className="drawer-footer">
						<Button
							variant="secondary"
							usage="danger"
							disabled={!form.formState.isDirty || isSubmitPending}
							onClick={openResetConfirm}
						>
							{t("common.actions.resetChanges")}
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

			<ResetChangesDialog
				open={isResetConfirmOpen}
				onOpenChange={setIsResetConfirmOpen}
				title={t("partner.entityPage.editor.resetConfirm.title")}
				description={t("partner.entityPage.editor.resetConfirm.description")}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.actions.resetChanges")}
				onAction={resetForm}
			/>
		</>
	);
}
