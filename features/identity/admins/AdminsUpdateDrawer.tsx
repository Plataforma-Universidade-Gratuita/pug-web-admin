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
	Footer,
	TabsList,
	TabsTrigger,
	toast,
} from "@/components";
import { AdminEditorContent } from "@/features/identity/admins/AdminEditorContent";
import {
	useCreateAdminMutation,
	useUpdateAdminMutation,
} from "@/features/identity/admins/mutations";
import {
	useAdminDetailQuery,
	useLinkedAdminAccountQuery,
	useLinkedAdminUserQuery,
} from "@/features/identity/admins/queries";
import { useUsersQuery } from "@/features/identity/users/queries";
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
import { ServicePageEditorDrawer } from "@/features/shared/service-pages";
import type { AdminEditorFormValues, AdminsUpdateDrawerProps } from "@/types";

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

		return buildAdminUpdateFormValues(adminDetailQuery.data);
	}, [
		adminDetailQuery.data,
		emptyValues,
		isCreateMode,
		linkedAccountQuery.data,
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
			: "identity.adminPage.update.actions.save",
	);
	const savePendingLabel = t(
		isCreateMode
			? "identity.adminPage.create.actions.savePending"
			: "identity.adminPage.update.actions.savePending",
	);
	const editorTabs =
		canRenderForm &&
		!adminDetailQuery.isError &&
		!linkedAccountQuery.isError
			? {
					defaultValue: "profile" as const,
					list: (
						<TabsList>
							<TabsTrigger value="profile">
								{t("identity.adminPage.update.tabs.profile")}
							</TabsTrigger>
							<TabsTrigger value="access">
								{t("identity.adminPage.update.tabs.access")}
							</TabsTrigger>
							{!isCreateMode ? (
								<TabsTrigger value="user">
									{t("identity.adminPage.update.tabs.user")}
								</TabsTrigger>
							) : null}
						</TabsList>
					),
				}
			: undefined;

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
					onSuccess: ({ admin }) => {
						toast.success(
							t("identity.adminPage.create.feedback.success.title"),
							{
								description: t(
									"identity.adminPage.create.feedback.success.description",
									{
										name: admin.userName,
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
			<ServicePageEditorDrawer
				open={open}
				onOpenChange={handleDrawerOpenChange}
				isLoading={isDrawerLoading}
				loadingLabel={t("identity.adminPage.update.loading")}
				overhead={drawerOverhead}
				title={adminDetailQuery.data?.userName ?? drawerTitleFallback}
				tabs={editorTabs}
				bodyClassName="grid gap-6"
				footer={
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
				}
			>
				<AdminEditorContent
					admin={adminDetailQuery.data}
					adminError={
						adminDetailQuery.isError ? adminDetailQuery.error : null
					}
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
						actionLabel={t("identity.adminPage.update.actions.reset")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
