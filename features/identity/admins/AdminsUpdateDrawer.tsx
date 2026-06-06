"use client";

import { useMemo, useState } from "react";

import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { web } from "@/api";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Footer,
	toast,
} from "@/components";
import { ServicePageEditorDrawer } from "@/components";
import { AdminEditorContent } from "@/features/identity/admins/AdminEditorContent";
import {
	buildAdminUpdateFormValues,
	createAdminEditorFormSchema,
	findAdminExistingUserByCpf,
	getAdminCampusOptions,
	getAdminCreateErrorToastContent,
	getAdminDetailErrorToastContent,
	getAdminUpdateErrorToastContent,
	getEmptyAdminEditorFormValues,
	getLinkedAdminAccountErrorToastContent,
	getLinkedAdminUserErrorToastContent,
	toAdminCreateRequest,
	toAdminUpdateRequest,
} from "@/features/identity/admins/utils";
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type { AdminEditorFormValues, AdminsUpdateDrawerProps } from "@/types";

const { admins: adminsApi, users: usersApi } = web.identity;
const {
	useCreateAdminMutation,
	useUpdateAdminMutation,
	useAdminDetailQuery,
	useLinkedAdminAccountQuery,
	useLinkedAdminUserQuery,
} = adminsApi;
const { useUsersQuery } = usersApi;

export function AdminsUpdateDrawer({
	adminId,
	mode,
	open,
	onOpenChange,
}: AdminsUpdateDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const existingUsersQuery = useUsersQuery(open && isCreateMode);
	const adminDetailQuery = useAdminDetailQuery(adminId);
	const linkedAccountQuery = useLinkedAdminAccountQuery(
		adminDetailQuery.data?.accountResponse.id ?? null,
	);
	const linkedUserQuery = useLinkedAdminUserQuery(
		adminDetailQuery.data?.accountResponse.userId ?? null,
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

		if (
			!adminDetailQuery.data ||
			!linkedAccountQuery.data ||
			!linkedUserQuery.data
		) {
			return null;
		}

		return buildAdminUpdateFormValues(
			adminDetailQuery.data,
			linkedUserQuery.data,
		);
	}, [
		adminDetailQuery.data,
		emptyValues,
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
			!linkedAccountQuery.data ||
			!linkedUserQuery.data
		) {
			return null;
		}

		return [
			mode,
			adminDetailQuery.data.accountResponse.id,
			loadedFormValues.cpf,
			loadedFormValues.name,
			loadedFormValues.email,
			loadedFormValues.campus,
		].join("|");
	}, [
		adminDetailQuery.data,
		isCreateMode,
		linkedAccountQuery.data,
		linkedUserQuery.data,
		loadedFormValues,
		mode,
	]);
	const canRenderForm = isCreateMode
		? true
		: Boolean(
				adminDetailQuery.data &&
				linkedAccountQuery.data &&
				linkedUserQuery.data,
			);
	const isDrawerLoading =
		!isCreateMode &&
		open &&
		(adminDetailQuery.isLoading ||
			(Boolean(adminDetailQuery.data) && linkedAccountQuery.isLoading));
	const isSubmitPending = updateMutation.isPending || createMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "identity.adminPage.create.overhead"
			: "identity.adminPage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "identity.adminPage.create.titleFallback"
			: "identity.adminPage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "identity.adminPage.create.actions.save"
			: "common.actions.saveChanges",
	);
	const savePendingLabel = t(
		isCreateMode
			? "identity.adminPage.create.actions.savePending"
			: "common.actions.saveChangesPending",
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
		if (isCreateMode) {
			const existingUser = findAdminExistingUserByCpf(
				existingUsersQuery.data ?? [],
				values.cpf,
			);

			createMutation.mutate(
				{
					body: toAdminCreateRequest(values, existingUser),
				},
				{
					onSuccess: () => {
						toast.success(
							t("identity.adminPage.create.feedback.success.title"),
							{
								description: t(
									"identity.adminPage.create.feedback.success.description",
									{
										name: values.name.trim(),
									},
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = getAdminCreateErrorToastContent(
							t,
							error,
						);
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
				onSuccess: () => {
					toast.success(t("identity.adminPage.update.feedback.success.title"), {
						description: t(
							"identity.adminPage.update.feedback.success.description",
							{
								name: values.name.trim(),
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
			<ServicePageEditorDrawer
				open={open}
				onOpenChange={handleDrawerOpenChange}
				isLoading={isDrawerLoading}
				loadingLabel={t("identity.adminPage.update.loading")}
				overhead={drawerOverhead}
				title={linkedUserQuery.data?.name ?? drawerTitleFallback}
				bodyClassName="grid gap-6"
				footer={
					<Footer className="drawer-footer">
						<Button
							variant="secondary"
							usage="danger"
							disabled={!form.formState.isDirty || isSubmitPending}
							onClick={() => setIsResetConfirmOpen(true)}
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
				}
			>
				<AdminEditorContent
					admin={adminDetailQuery.data}
					adminError={adminDetailQuery.isError ? adminDetailQuery.error : null}
					canRenderForm={canRenderForm}
					campusOptions={campusOptions}
					existingUsers={existingUsersQuery.data ?? []}
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
			</ServicePageEditorDrawer>

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
						actionLabel={t("common.actions.resetChanges")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
