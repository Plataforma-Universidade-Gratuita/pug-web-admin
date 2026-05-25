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
import { AdminEditorContent } from "@/features/identity/admin/AdminEditorContent";
import {
	useCreateAdminMutation,
	useUpdateAdminMutation,
} from "@/features/identity/admin/mutations";
import {
	useAdminDetailQuery,
	useLinkedAdminAccountQuery,
	useLinkedAdminUserQuery,
} from "@/features/identity/admin/queries";
import {
	buildAdminDuplicateFormValues,
	buildAdminUpdateFormValues,
	createAdminEditorFormSchema,
	getAdminCampusOptions,
	getAdminCreateErrorToastContent,
	getAdminDetailErrorToastContent,
	getAdminDuplicateErrorToastContent,
	getAdminUpdateErrorToastContent,
	getEmptyAdminEditorFormValues,
	getLinkedAdminAccountErrorToastContent,
	getLinkedAdminUserErrorToastContent,
	toAdminCreateRequest,
	toAdminUpdateRequest,
} from "@/features/identity/admin/utils";
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type { AdminEditorFormValues, AdminUpdateDrawerProps } from "@/types";

export function AdminUpdateDrawer({
	adminId,
	mode,
	open,
	onOpenChange,
}: AdminUpdateDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const adminDetailQuery = useAdminDetailQuery(adminId);
	const linkedAccountQuery = useLinkedAdminAccountQuery(
		adminDetailQuery.data?.accountId ?? null,
	);
	const linkedUserQuery = useLinkedAdminUserQuery(
		adminDetailQuery.data?.userId ?? null,
	);
	const updateMutation = useUpdateAdminMutation();
	const createMutation = useCreateAdminMutation();
	const campusOptions = useMemo(() => getAdminCampusOptions(t), [t]);
	const emptyValues = useMemo(() => getEmptyAdminEditorFormValues(), []);
	const form = useLocalizedZodForm<AdminEditorFormValues>({
		schemaFactory: translated => createAdminEditorFormSchema(translated, mode),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!adminDetailQuery.data || !linkedAccountQuery.data) {
			return null;
		}

		return isDuplicateMode
			? buildAdminDuplicateFormValues(
					adminDetailQuery.data,
					linkedUserQuery.data ?? null,
				)
			: buildAdminUpdateFormValues(adminDetailQuery.data);
	}, [
		adminDetailQuery.data,
		emptyValues,
		isDuplicateMode,
		isCreateMode,
		linkedAccountQuery.data,
		linkedUserQuery.data,
	]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (
			!loadedFormValues ||
			!adminDetailQuery.data ||
			!linkedAccountQuery.data
		) {
			return null;
		}

		return [
			mode,
			adminDetailQuery.data.accountId,
			loadedFormValues.cpf,
			loadedFormValues.name,
			loadedFormValues.email,
			loadedFormValues.campus,
			loadedFormValues.active ? "active" : "inactive",
		].join("|");
	}, [
		adminDetailQuery.data,
		isCreateMode,
		linkedAccountQuery.data,
		loadedFormValues,
		mode,
	]);
	const canRenderForm = isCreateMode
		? true
		: Boolean(adminDetailQuery.data && linkedAccountQuery.data);
	const isDrawerLoading =
		!isCreateMode &&
		open &&
		(adminDetailQuery.isLoading ||
			(Boolean(adminDetailQuery.data) && linkedAccountQuery.isLoading) ||
			(isDuplicateMode &&
				Boolean(adminDetailQuery.data) &&
				linkedUserQuery.isLoading));
	const isSubmitPending = updateMutation.isPending || createMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "identity.adminPage.create.overhead"
			: isDuplicateMode
				? "identity.adminPage.duplicate.overhead"
				: "identity.adminPage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "identity.adminPage.create.titleFallback"
			: isDuplicateMode
				? "identity.adminPage.duplicate.titleFallback"
				: "identity.adminPage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "identity.adminPage.create.actions.save"
			: isDuplicateMode
				? "identity.adminPage.duplicate.actions.save"
				: "identity.adminPage.update.actions.save",
	);
	const savePendingLabel = t(
		isCreateMode
			? "identity.adminPage.create.actions.savePending"
			: isDuplicateMode
				? "identity.adminPage.duplicate.actions.savePending"
				: "identity.adminPage.update.actions.savePending",
	);

	useQueryErrorToasts([
		{
			key: "admin-editor-detail",
			error: adminDetailQuery.error,
			errorUpdatedAt: adminDetailQuery.errorUpdatedAt,
			getContent: error => getAdminDetailErrorToastContent(t, error),
			isError: adminDetailQuery.isError,
		},
		{
			key: "admin-editor-linked-account",
			error: linkedAccountQuery.error,
			errorUpdatedAt: linkedAccountQuery.errorUpdatedAt,
			getContent: error => getLinkedAdminAccountErrorToastContent(t, error),
			isError: linkedAccountQuery.isError,
		},
		{
			key: "admin-editor-linked-user",
			error: linkedUserQuery.error,
			errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
			getContent: error => getLinkedAdminUserErrorToastContent(t, error),
			isError: linkedUserQuery.isError,
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

	function onSubmit(values: AdminEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					active: values.active,
					body: toAdminCreateRequest(values),
				},
				{
					onSuccess: ({ admin }) => {
						toast.success(
							t(
								isCreateMode
									? "identity.adminPage.create.feedback.success.title"
									: "identity.adminPage.duplicate.feedback.success.title",
							),
							{
								description: t(
									isCreateMode
										? "identity.adminPage.create.feedback.success.description"
										: "identity.adminPage.duplicate.feedback.success.description",
									{
										name: admin.userName,
									},
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = isCreateMode
							? getAdminCreateErrorToastContent(t, error)
							: getAdminDuplicateErrorToastContent(t, error);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		if (!adminId) {
			return;
		}

		updateMutation.mutate(
			{
				id: adminId,
				body: toAdminUpdateRequest(values),
			},
			{
				onSuccess: admin => {
					toast.success(t("identity.adminPage.update.feedback.success.title"), {
						description: t(
							"identity.adminPage.update.feedback.success.description",
							{
								name: admin.userName,
							},
						),
					});
					closeDrawer();
				},
				onError: error => {
					const { title, description } = getAdminUpdateErrorToastContent(
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
				loadingLabel={t("identity.adminPage.update.loading")}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{adminDetailQuery.data?.userName ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<AdminEditorContent
							admin={adminDetailQuery.data}
							adminError={
								adminDetailQuery.isError ? adminDetailQuery.error : null
							}
							canRenderForm={canRenderForm}
							campusOptions={campusOptions}
							form={form}
							linkedAccount={linkedAccountQuery.data}
							linkedAccountError={
								linkedAccountQuery.isError ? linkedAccountQuery.error : null
							}
							linkedUser={linkedUserQuery.data}
							linkedUserError={
								linkedUserQuery.isError ? linkedUserQuery.error : null
							}
							mode={mode}
							onRefreshAccount={() => {
								void linkedAccountQuery.refetch();
							}}
							onRefreshAdmin={() => {
								void adminDetailQuery.refetch();
							}}
							onRefreshUser={() => {
								void linkedUserQuery.refetch();
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
							{t("identity.adminPage.update.actions.reset")}
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
							{t("identity.adminPage.update.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("identity.adminPage.update.resetConfirm.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("identity.adminPage.update.actions.reset")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
