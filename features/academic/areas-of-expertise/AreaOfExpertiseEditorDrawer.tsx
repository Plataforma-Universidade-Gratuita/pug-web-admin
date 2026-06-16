"use client";

import { useMemo } from "react";

import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { ResetChangesDialog } from "@/components/composite";
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Footer,
	toast,
} from "@/components/primitives";
import { AreaOfExpertiseEditorForm } from "@/features/academic/areas-of-expertise/AreaOfExpertiseEditorForm";
import {
	buildAreaOfExpertiseDuplicateFormValues,
	buildAreaOfExpertiseUpdateFormValues,
	createAreaOfExpertiseEditorFormSchema,
	getAreaOfExpertiseCreateErrorToastContent,
	getAreaOfExpertiseDetailErrorToastContent,
	getAreaOfExpertiseDuplicateErrorToastContent,
	getAreaOfExpertiseUpdateErrorToastContent,
	getEmptyAreaOfExpertiseEditorFormValues,
	toAreaOfExpertiseCreateRequest,
	toAreaOfExpertiseUpdateRequest,
} from "@/features/academic/areas-of-expertise/utils";
import {
	applyApiFieldErrors,
	getCrudSuccessToastContent,
} from "@/features/utils";
import {
	useDrawerResetConfirm,
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	AreaOfExpertiseEditorDrawerProps,
	AreaOfExpertiseEditorFormValues,
} from "@/types/client";

const { areasOfExpertise: areasOfExpertiseApi } = web.academic;
const {
	useCreateAreaOfExpertiseMutation,
	useUpdateAreaOfExpertiseMutation,
	useAreaOfExpertiseDetailQuery,
} = areasOfExpertiseApi;

export function AreaOfExpertiseEditorDrawer({
	areaOfExpertiseId,
	mode,
	onOpenChange,
	open,
}: AreaOfExpertiseEditorDrawerProps) {
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
	const areaOfExpertiseDetailQuery =
		useAreaOfExpertiseDetailQuery(areaOfExpertiseId);
	const createMutation = useCreateAreaOfExpertiseMutation();
	const updateMutation = useUpdateAreaOfExpertiseMutation();
	const emptyValues = useMemo(
		() => getEmptyAreaOfExpertiseEditorFormValues(),
		[],
	);
	const form = useLocalizedZodForm<AreaOfExpertiseEditorFormValues>({
		schemaFactory: translated =>
			createAreaOfExpertiseEditorFormSchema(translated),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!areaOfExpertiseDetailQuery.data) {
			return null;
		}

		return isDuplicateMode
			? buildAreaOfExpertiseDuplicateFormValues(areaOfExpertiseDetailQuery.data)
			: buildAreaOfExpertiseUpdateFormValues(areaOfExpertiseDetailQuery.data);
	}, [
		areaOfExpertiseDetailQuery.data,
		emptyValues,
		isCreateMode,
		isDuplicateMode,
	]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !areaOfExpertiseDetailQuery.data) {
			return null;
		}

		return [
			mode,
			areaOfExpertiseDetailQuery.data.id,
			loadedFormValues.name,
		].join("|");
	}, [areaOfExpertiseDetailQuery.data, isCreateMode, loadedFormValues, mode]);
	const canRenderForm = isCreateMode
		? true
		: Boolean(areaOfExpertiseDetailQuery.data);
	const isDrawerLoading =
		open && !isCreateMode && areaOfExpertiseDetailQuery.isLoading;
	const isSubmitPending = createMutation.isPending || updateMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "academic.areaOfExpertisePage.create.overhead"
			: isDuplicateMode
				? "academic.areaOfExpertisePage.duplicate.overhead"
				: "academic.areaOfExpertisePage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "academic.areaOfExpertisePage.create.titleFallback"
			: isDuplicateMode
				? "academic.areaOfExpertisePage.duplicate.titleFallback"
				: "academic.areaOfExpertisePage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "academic.areaOfExpertisePage.create.actions.save"
			: isDuplicateMode
				? "academic.areaOfExpertisePage.duplicate.actions.save"
				: "academic.areaOfExpertisePage.update.actions.save",
	);
	const savePendingLabel = t(
		isCreateMode
			? "academic.areaOfExpertisePage.create.actions.savePending"
			: isDuplicateMode
				? "academic.areaOfExpertisePage.duplicate.actions.savePending"
				: "academic.areaOfExpertisePage.update.actions.savePending",
	);

	useQueryErrorToasts([
		{
			key: "area-of-expertise-editor-detail",
			error: areaOfExpertiseDetailQuery.error,
			errorUpdatedAt: areaOfExpertiseDetailQuery.errorUpdatedAt,
			getContent: error => getAreaOfExpertiseDetailErrorToastContent(t, error),
			isError: areaOfExpertiseDetailQuery.isError,
		},
	]);
	useHydratedFormOnOpen({
		emptyValues,
		form,
		hydrationKey,
		loadedValues: loadedFormValues,
		open,
	});

	function closeDrawer() {
		onOpenChange(false);
	}

	function resetForm() {
		form.reset(loadedFormValues ?? emptyValues);
		setIsResetConfirmOpen(false);
	}

	function onSubmit(values: AreaOfExpertiseEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					body: toAreaOfExpertiseCreateRequest(values),
				},
				{
					onSuccess: areaOfExpertise => {
						const { title, description } = getCrudSuccessToastContent(
							t,
							isCreateMode ? "create" : "duplicate",
							areaOfExpertise.name,
						);
						toast.success(title, { description });
						closeDrawer();
					},
					onError: error => {
						applyApiFieldErrors(form, error);
						const { title, description } = isCreateMode
							? getAreaOfExpertiseCreateErrorToastContent(t, error)
							: getAreaOfExpertiseDuplicateErrorToastContent(t, error);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		if (!areaOfExpertiseId) {
			return;
		}

		updateMutation.mutate(
			{
				id: areaOfExpertiseId,
				body: toAreaOfExpertiseUpdateRequest(values),
			},
			{
				onSuccess: areaOfExpertise => {
					const { title, description } = getCrudSuccessToastContent(
						t,
						"update",
						areaOfExpertise.name,
					);
					toast.success(title, { description });
					closeDrawer();
				},
				onError: error => {
					applyApiFieldErrors(form, error);
					const { title, description } =
						getAreaOfExpertiseUpdateErrorToastContent(t, error);
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
				loadingLabel={t("common.editor.loading", {
					object: t("common.objects.areaOfExpertise"),
				})}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{areaOfExpertiseDetailQuery.data?.name ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<AreaOfExpertiseEditorForm
							areaOfExpertise={areaOfExpertiseDetailQuery.data}
							areaOfExpertiseError={
								areaOfExpertiseDetailQuery.isError
									? areaOfExpertiseDetailQuery.error
									: null
							}
							canRenderForm={canRenderForm}
							form={form}
							mode={mode}
							onRefreshAreaOfExpertise={() => {
								void areaOfExpertiseDetailQuery.refetch();
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
				title={t("common.resetConfirm.title", {
					object: t("common.objects.areaOfExpertise"),
				})}
				description={t("common.resetConfirm.description")}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.actions.resetChanges")}
				onAction={resetForm}
			/>
		</>
	);
}


