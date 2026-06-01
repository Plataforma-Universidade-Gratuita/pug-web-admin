"use client";

import { useMemo, useState } from "react";

import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Footer,
	toast,
} from "@/components";
import {
	useCreateAreaOfExpertiseMutation,
	useUpdateAreaOfExpertiseMutation,
} from "@/features/academic/areas-of-expertise/mutations";
import {
	useAreaOfExpertiseDetailQuery,
} from "@/features/academic/areas-of-expertise/queries";
import {
	AreaOfExpertiseEditorForm,
} from "@/features/academic/areas-of-expertise/AreaOfExpertiseEditorForm";
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
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	AreaOfExpertiseEditorDrawerProps,
	AreaOfExpertiseEditorFormValues,
} from "@/types";

export function AreaOfExpertiseEditorDrawer({
	areaOfExpertiseId,
	mode,
	onOpenChange,
	open,
}: AreaOfExpertiseEditorDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
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
			? buildAreaOfExpertiseDuplicateFormValues(
					areaOfExpertiseDetailQuery.data,
				)
			: buildAreaOfExpertiseUpdateFormValues(
					areaOfExpertiseDetailQuery.data,
				);
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
			? "academic.schoolPage.create.overhead"
			: isDuplicateMode
				? "academic.schoolPage.duplicate.overhead"
				: "academic.schoolPage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "academic.schoolPage.create.titleFallback"
			: isDuplicateMode
				? "academic.schoolPage.duplicate.titleFallback"
				: "academic.schoolPage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "academic.schoolPage.create.actions.save"
			: isDuplicateMode
				? "academic.schoolPage.duplicate.actions.save"
				: "academic.schoolPage.update.actions.save",
	);
	const savePendingLabel = t(
		isCreateMode
			? "academic.schoolPage.create.actions.savePending"
			: isDuplicateMode
				? "academic.schoolPage.duplicate.actions.savePending"
				: "academic.schoolPage.update.actions.savePending",
	);

	useQueryErrorToasts([
		{
			key: "area-of-expertise-editor-detail",
			error: areaOfExpertiseDetailQuery.error,
			errorUpdatedAt: areaOfExpertiseDetailQuery.errorUpdatedAt,
			getContent: error =>
				getAreaOfExpertiseDetailErrorToastContent(t, error),
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

	function onSubmit(values: AreaOfExpertiseEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					body: toAreaOfExpertiseCreateRequest(values),
				},
				{
					onSuccess: areaOfExpertise => {
						toast.success(
							t(
								isCreateMode
									? "academic.schoolPage.create.feedback.success.title"
									: "academic.schoolPage.duplicate.feedback.success.title",
							),
							{
								description: t(
									isCreateMode
										? "academic.schoolPage.create.feedback.success.description"
										: "academic.schoolPage.duplicate.feedback.success.description",
									{
										name: areaOfExpertise.name,
									},
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
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
					toast.success(
						t("academic.schoolPage.update.feedback.success.title"),
						{
							description: t(
								"academic.schoolPage.update.feedback.success.description",
								{
									name: areaOfExpertise.name,
								},
							),
						},
					);
					closeDrawer();
				},
				onError: error => {
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
				loadingLabel={t("academic.schoolPage.editor.loading")}
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
							onClick={() => setIsResetConfirmOpen(true)}
						>
							{t("academic.schoolPage.editor.actions.reset")}
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
							{t("academic.schoolPage.editor.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("academic.schoolPage.editor.resetConfirm.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("academic.schoolPage.editor.actions.reset")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
