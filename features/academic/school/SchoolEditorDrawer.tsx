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
import { SchoolEditorForm } from "@/features/academic/school/SchoolEditorForm";
import {
	useCreateSchoolMutation,
	useUpdateSchoolMutation,
} from "@/features/academic/school/mutations";
import { useSchoolDetailQuery } from "@/features/academic/school/queries";
import {
	buildSchoolDuplicateFormValues,
	buildSchoolUpdateFormValues,
	createSchoolEditorFormSchema,
	getEmptySchoolEditorFormValues,
	getSchoolCreateErrorToastContent,
	getSchoolDetailErrorToastContent,
	getSchoolDuplicateErrorToastContent,
	getSchoolUpdateErrorToastContent,
	toSchoolCreateRequest,
	toSchoolUpdateRequest,
} from "@/features/academic/school/utils";
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type { SchoolEditorDrawerProps, SchoolEditorFormValues } from "@/types";

export function SchoolEditorDrawer({
	mode,
	onOpenChange,
	open,
	schoolId,
}: SchoolEditorDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const schoolDetailQuery = useSchoolDetailQuery(schoolId);
	const createMutation = useCreateSchoolMutation();
	const updateMutation = useUpdateSchoolMutation();
	const emptyValues = useMemo(() => getEmptySchoolEditorFormValues(), []);
	const form = useLocalizedZodForm<SchoolEditorFormValues>({
		schemaFactory: translated => createSchoolEditorFormSchema(translated),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!schoolDetailQuery.data) {
			return null;
		}

		return isDuplicateMode
			? buildSchoolDuplicateFormValues(schoolDetailQuery.data)
			: buildSchoolUpdateFormValues(schoolDetailQuery.data);
	}, [emptyValues, isCreateMode, isDuplicateMode, schoolDetailQuery.data]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !schoolDetailQuery.data) {
			return null;
		}

		return [mode, schoolDetailQuery.data.id, loadedFormValues.name].join("|");
	}, [isCreateMode, loadedFormValues, mode, schoolDetailQuery.data]);
	const canRenderForm = isCreateMode ? true : Boolean(schoolDetailQuery.data);
	const isDrawerLoading = open && !isCreateMode && schoolDetailQuery.isLoading;
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
			key: "school-editor-detail",
			error: schoolDetailQuery.error,
			errorUpdatedAt: schoolDetailQuery.errorUpdatedAt,
			getContent: error => getSchoolDetailErrorToastContent(t, error),
			isError: schoolDetailQuery.isError,
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

	function onSubmit(values: SchoolEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					body: toSchoolCreateRequest(values),
				},
				{
					onSuccess: school => {
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
										name: school.name,
									},
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = isCreateMode
							? getSchoolCreateErrorToastContent(t, error)
							: getSchoolDuplicateErrorToastContent(t, error);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		if (!schoolId) {
			return;
		}

		updateMutation.mutate(
			{
				id: schoolId,
				body: toSchoolUpdateRequest(values),
			},
			{
				onSuccess: school => {
					toast.success(
						t("academic.schoolPage.update.feedback.success.title"),
						{
							description: t(
								"academic.schoolPage.update.feedback.success.description",
								{
									name: school.name,
								},
							),
						},
					);
					closeDrawer();
				},
				onError: error => {
					const { title, description } = getSchoolUpdateErrorToastContent(
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
				loadingLabel={t("academic.schoolPage.editor.loading")}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{schoolDetailQuery.data?.name ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<SchoolEditorForm
							canRenderForm={canRenderForm}
							form={form}
							mode={mode}
							onRefreshSchool={() => {
								void schoolDetailQuery.refetch();
							}}
							school={schoolDetailQuery.data}
							schoolError={
								schoolDetailQuery.isError ? schoolDetailQuery.error : null
							}
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
