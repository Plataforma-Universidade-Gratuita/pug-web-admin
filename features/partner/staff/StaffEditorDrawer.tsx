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
import { StaffEditorForm } from "@/features/partner/staff/StaffEditorForm";
import {
	buildStaffDuplicateFormValues,
	buildStaffEntityOptions,
	buildStaffUpdateFormValues,
	createStaffEditorFormSchema,
	findStaffExistingUserByCpf,
	getEmptyStaffEditorFormValues,
	getLinkedStaffUserErrorToastContent,
	getStaffCreateErrorToastContent,
	getStaffDetailErrorToastContent,
	getStaffDuplicateErrorToastContent,
	getStaffEntitiesErrorToastContent,
	getStaffUpdateErrorToastContent,
	toStaffCreateRequest,
	toStaffUpdateRequest,
} from "@/features/partner/staff/utils";
import {
	useDrawerResetConfirm,
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	StaffEditorDrawerProps,
	StaffEditorFormValues,
} from "@/types/client";

const { users: usersApi } = web.identity;
const { staff: staffApi } = web.partner;
const { useUsersQuery } = usersApi;
const {
	useCreateStaffMutation,
	useUpdateStaffMutation,
	useLinkedStaffUserQuery,
	useStaffDetailQuery,
	useStaffEntitiesQuery,
} = staffApi;

export function StaffEditorDrawer({
	staffId,
	mode,
	open,
	onOpenChange,
}: StaffEditorDrawerProps) {
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
	const existingUsersQuery = useUsersQuery(open && !isUpdateMode(mode));
	const staffDetailQuery = useStaffDetailQuery(staffId);
	const linkedUserQuery = useLinkedStaffUserQuery(
		staffDetailQuery.data?.account.userId ?? null,
	);
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

		if (!staffDetailQuery.data || !linkedUserQuery.data) {
			return null;
		}

		return isDuplicateMode
			? buildStaffDuplicateFormValues(staffDetailQuery.data)
			: buildStaffUpdateFormValues(staffDetailQuery.data, linkedUserQuery.data);
	}, [
		emptyValues,
		isCreateMode,
		isDuplicateMode,
		linkedUserQuery.data,
		staffDetailQuery.data,
	]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !staffDetailQuery.data || !linkedUserQuery.data) {
			return null;
		}

		return [
			mode,
			staffDetailQuery.data.account.id,
			loadedFormValues.cpf,
			loadedFormValues.name,
			loadedFormValues.email,
			loadedFormValues.entityId,
		].join("|");
	}, [
		isCreateMode,
		linkedUserQuery.data,
		loadedFormValues,
		mode,
		staffDetailQuery.data,
	]);
	const canRenderForm = isCreateMode
		? true
		: Boolean(staffDetailQuery.data && linkedUserQuery.data);
	const isDrawerLoading =
		open &&
		(entitiesQuery.isLoading ||
			(!isCreateMode &&
				(staffDetailQuery.isLoading || linkedUserQuery.isLoading)));
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
				? "common.actions.createDuplicate"
				: "common.actions.saveChanges",
	);
	const savePendingLabel = t(
		isCreateMode
			? "partner.staffPage.create.actions.savePending"
			: isDuplicateMode
				? "common.actions.createDuplicatePending"
				: "common.actions.saveChangesPending",
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
			key: "staff-editor-linked-user",
			error: linkedUserQuery.error,
			errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
			getContent: error => getLinkedStaffUserErrorToastContent(t, error),
			isError: linkedUserQuery.isError,
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

	function resetForm() {
		form.reset(loadedFormValues ?? emptyValues);
		setIsResetConfirmOpen(false);
	}

	function onSubmit(values: StaffEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			const existingUser = findStaffExistingUserByCpf(
				existingUsersQuery.data ?? [],
				values.cpf,
			);

			createMutation.mutate(
				{
					body: toStaffCreateRequest(values, existingUser),
				},
				{
					onSuccess: () => {
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
										name: values.name.trim(),
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
				onSuccess: () => {
					toast.success(t("partner.staffPage.update.feedback.success.title"), {
						description: t(
							"partner.staffPage.update.feedback.success.description",
							{
								name: values.name.trim(),
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
							{linkedUserQuery.data?.name ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<StaffEditorForm
							canRenderForm={canRenderForm}
							entityById={entityById}
							entityOptions={entityOptions}
							entitiesError={entitiesQuery.isError ? entitiesQuery.error : null}
							existingUsers={existingUsersQuery.data ?? []}
							form={form}
							linkedAccount={staffDetailQuery.data?.account}
							mode={mode}
							onRefreshEntities={() => {
								void entitiesQuery.refetch();
							}}
							onRefreshStaff={() => {
								void staffDetailQuery.refetch();
							}}
							onRefreshUser={() => {
								void linkedUserQuery.refetch();
							}}
							staff={staffDetailQuery.data}
							staffError={
								staffDetailQuery.isError ? staffDetailQuery.error : null
							}
							userError={linkedUserQuery.isError ? linkedUserQuery.error : null}
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
				title={t("partner.staffPage.editor.resetConfirm.title")}
				description={t("partner.staffPage.editor.resetConfirm.description")}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.actions.resetChanges")}
				onAction={resetForm}
			/>
		</>
	);
}

function isUpdateMode(mode: StaffEditorDrawerProps["mode"]) {
	return mode === "update";
}
