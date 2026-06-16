"use client";

import { useMemo } from "react";

import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { ResetChangesDialog } from "@/components/composite";
import { ServicePageEditorDrawer } from "@/components/composite";
import { Button, Footer, toast } from "@/components/primitives";
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
	AdminEditorFormValues,
	AdminsUpdateDrawerProps,
} from "@/types/client";

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
	const isCreateMode = mode === "create";
	const {
		handleDrawerOpenChange,
		isResetConfirmOpen,
		openResetConfirm,
		setIsResetConfirmOpen,
	} = useDrawerResetConfirm({
		onDrawerOpenChange: onOpenChange,
	});
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
						const { title, description } = getCrudSuccessToastContent(
							t,
							"create",
							values.name.trim(),
						);
						toast.success(title, { description });
						closeDrawer();
					},
					onError: error => {
						applyApiFieldErrors(form, error);
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
					const { title, description } = getCrudSuccessToastContent(
						t,
						"update",
						values.name.trim(),
					);
					toast.success(title, { description });
					closeDrawer();
				},
				onError: error => {
					applyApiFieldErrors(form, error);
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
				loadingLabel={t("common.editor.loading", {
					object: t("common.objects.administrator"),
				})}
				overhead={drawerOverhead}
				title={linkedUserQuery.data?.name ?? drawerTitleFallback}
				bodyClassName="grid gap-6"
				footer={
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

			<ResetChangesDialog
				open={isResetConfirmOpen}
				onOpenChange={setIsResetConfirmOpen}
				title={t("common.resetConfirm.title", {
					object: t("common.objects.administrator"),
				})}
				description={t("common.resetConfirm.description")}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.actions.resetChanges")}
				onAction={resetForm}
			/>
		</>
	);
}
