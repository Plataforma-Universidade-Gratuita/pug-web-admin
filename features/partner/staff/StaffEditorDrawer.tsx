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
import { StaffEditorForm } from "@/features/partner/staff/StaffEditorForm";
import {
	useCreateStaffMutation,
	useUpdateStaffMutation,
} from "@/features/partner/staff/mutations";
import {
	useStaffDetailQuery,
	useStaffEntitiesQuery,
} from "@/features/partner/staff/queries";
import {
	buildStaffDuplicateFormValues,
	buildStaffEntityOptions,
	buildStaffUpdateFormValues,
	createStaffEditorFormSchema,
	getEmptyStaffEditorFormValues,
	getStaffCreateErrorToastContent,
	getStaffDetailErrorToastContent,
	getStaffDuplicateErrorToastContent,
	getStaffEntitiesErrorToastContent,
	getStaffUpdateErrorToastContent,
	toStaffCreateRequest,
	toStaffUpdateRequest,
} from "@/features/partner/staff/utils";
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type { StaffEditorDrawerProps, StaffEditorFormValues } from "@/types";

export function StaffEditorDrawer({
	staffId,
	mode,
	open,
	onOpenChange,
}: StaffEditorDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const staffDetailQuery = useStaffDetailQuery(staffId);
	const entitiesQuery = useStaffEntitiesQuery();
	const createMutation = useCreateStaffMutation();
	const updateMutation = useUpdateStaffMutation();
	const entityOptions = useMemo(
		() => buildStaffEntityOptions(entitiesQuery.data ?? []),
		[entitiesQuery.data],
	);
	const entityById = useMemo(
		() =>
			new Map((entitiesQuery.data ?? []).map(entity => [entity.id, entity])),
		[entitiesQuery.data],
	);
	const emptyValues = useMemo(() => getEmptyStaffEditorFormValues(), []);
	const form = useLocalizedZodForm<StaffEditorFormValues>({
		schemaFactory: translated => createStaffEditorFormSchema(translated, mode),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!staffDetailQuery.data) {
			return null;
		}

		return isDuplicateMode
			? buildStaffDuplicateFormValues(staffDetailQuery.data)
			: buildStaffUpdateFormValues(staffDetailQuery.data);
	}, [emptyValues, isCreateMode, isDuplicateMode, staffDetailQuery.data]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !staffDetailQuery.data) {
			return null;
		}

		return [
			mode,
			staffDetailQuery.data.accountId,
			loadedFormValues.cpf,
			loadedFormValues.name,
			loadedFormValues.email,
			loadedFormValues.entityId,
		].join("|");
	}, [isCreateMode, loadedFormValues, mode, staffDetailQuery.data]);
	const canRenderForm = isCreateMode ? true : Boolean(staffDetailQuery.data);
	const isDrawerLoading =
		open &&
		(entitiesQuery.isLoading || (!isCreateMode && staffDetailQuery.isLoading));
	const isSubmitPending = createMutation.isPending || updateMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "partner.staffPage.create.overhead"
			: isDuplicateMode
				? "partner.staffPage.duplicate.overhead"
				: "partner.staffPage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "partner.staffPage.create.titleFallback"
			: isDuplicateMode
				? "partner.staffPage.duplicate.titleFallback"
				: "partner.staffPage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "partner.staffPage.create.actions.save"
			: isDuplicateMode
				? "partner.staffPage.duplicate.actions.save"
				: "partner.staffPage.update.actions.save",
	);
	const savePendingLabel = t(
		isCreateMode
			? "partner.staffPage.create.actions.savePending"
			: isDuplicateMode
				? "partner.staffPage.duplicate.actions.savePending"
				: "partner.staffPage.update.actions.savePending",
	);

	useQueryErrorToasts([
		{
			key: "staff-editor-detail",
			error: staffDetailQuery.error,
			errorUpdatedAt: staffDetailQuery.errorUpdatedAt,
			getContent: error => getStaffDetailErrorToastContent(t, error),
			isError: staffDetailQuery.isError,
		},
		{
			key: "staff-editor-entities",
			error: entitiesQuery.error,
			errorUpdatedAt: entitiesQuery.errorUpdatedAt,
			getContent: error => getStaffEntitiesErrorToastContent(t, error),
			isError: entitiesQuery.isError,
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

	function onSubmit(values: StaffEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					body: toStaffCreateRequest(values),
				},
				{
					onSuccess: staff => {
						toast.success(
							t(
								isCreateMode
									? "partner.staffPage.create.feedback.success.title"
									: "partner.staffPage.duplicate.feedback.success.title",
							),
							{
								description: t(
									isCreateMode
										? "partner.staffPage.create.feedback.success.description"
										: "partner.staffPage.duplicate.feedback.success.description",
									{
										name: staff.userName,
									},
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = isCreateMode
							? getStaffCreateErrorToastContent(t, error)
							: getStaffDuplicateErrorToastContent(t, error);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		if (!staffId) {
			return;
		}

		updateMutation.mutate(
			{
				id: staffId,
				body: toStaffUpdateRequest(values),
			},
			{
				onSuccess: staff => {
					toast.success(t("partner.staffPage.update.feedback.success.title"), {
						description: t(
							"partner.staffPage.update.feedback.success.description",
							{
								name: staff.userName,
							},
						),
					});
					closeDrawer();
				},
				onError: error => {
					const { title, description } = getStaffUpdateErrorToastContent(
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
				loadingLabel={t("partner.staffPage.editor.loading")}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{staffDetailQuery.data?.userName ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<StaffEditorForm
							canRenderForm={canRenderForm}
							entityById={entityById}
							entityOptions={entityOptions}
							entitiesError={entitiesQuery.isError ? entitiesQuery.error : null}
							form={form}
							mode={mode}
							onRefreshEntities={() => {
								void entitiesQuery.refetch();
							}}
							onRefreshStaff={() => {
								void staffDetailQuery.refetch();
							}}
							staff={staffDetailQuery.data}
							staffError={
								staffDetailQuery.isError ? staffDetailQuery.error : null
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
							{t("partner.staffPage.editor.actions.reset")}
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
							{t("partner.staffPage.editor.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("partner.staffPage.editor.resetConfirm.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("partner.staffPage.editor.actions.reset")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
