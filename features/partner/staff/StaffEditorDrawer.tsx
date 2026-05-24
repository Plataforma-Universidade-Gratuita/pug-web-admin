"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Save } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Combobox,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Footer,
	Input,
	Label,
	NotFoundState,
	SomeErrorState,
	toast,
} from "@/components";
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
import { useLocalizedZodForm } from "@/hooks";
import type {
	StaffEditorDrawerProps,
	StaffEditorFormValues,
} from "@/types/client/partner";
import { WebApiError } from "@/utils/web-api";

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
	const detailErrorToastAtRef = useRef(0);
	const entitiesErrorToastAtRef = useRef(0);
	const lastHydratedKeyRef = useRef<string | null>(null);
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

	useEffect(() => {
		if (!staffDetailQuery.isError || staffDetailQuery.errorUpdatedAt === 0) {
			return;
		}

		if (detailErrorToastAtRef.current === staffDetailQuery.errorUpdatedAt) {
			return;
		}

		detailErrorToastAtRef.current = staffDetailQuery.errorUpdatedAt;
		const { title, description } = getStaffDetailErrorToastContent(
			t,
			staffDetailQuery.error,
		);
		toast.danger(title, { description });
	}, [
		staffDetailQuery.error,
		staffDetailQuery.errorUpdatedAt,
		staffDetailQuery.isError,
		t,
	]);

	useEffect(() => {
		if (!entitiesQuery.isError || entitiesQuery.errorUpdatedAt === 0) {
			return;
		}

		if (entitiesErrorToastAtRef.current === entitiesQuery.errorUpdatedAt) {
			return;
		}

		entitiesErrorToastAtRef.current = entitiesQuery.errorUpdatedAt;
		const { title, description } = getStaffEntitiesErrorToastContent(
			t,
			entitiesQuery.error,
		);
		toast.danger(title, { description });
	}, [
		entitiesQuery.error,
		entitiesQuery.errorUpdatedAt,
		entitiesQuery.isError,
		t,
	]);

	useEffect(() => {
		if (!open) {
			lastHydratedKeyRef.current = null;
			form.reset(emptyValues);
		}
	}, [emptyValues, form, open]);

	useEffect(() => {
		if (!open || !loadedFormValues || !hydrationKey) {
			return;
		}

		if (lastHydratedKeyRef.current === hydrationKey) {
			return;
		}

		form.reset(loadedFormValues);
		lastHydratedKeyRef.current = hydrationKey;
	}, [form, hydrationKey, loadedFormValues, open]);

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

	function renderDrawerContent() {
		if (!isCreateMode && staffDetailQuery.isError) {
			if (
				staffDetailQuery.error instanceof WebApiError &&
				staffDetailQuery.error.status === 404
			) {
				return (
					<NotFoundState
						title={t("partner.staffPage.update.notFound.title")}
						description={t("partner.staffPage.update.notFound.description")}
					/>
				);
			}

			return (
				<SomeErrorState
					title={t("partner.staffPage.update.loadError.title")}
					description={t("partner.staffPage.update.loadError.description")}
					onRefresh={() => {
						void staffDetailQuery.refetch();
					}}
				/>
			);
		}

		if (entitiesQuery.isError) {
			return (
				<SomeErrorState
					title={t("partner.staffPage.editor.entityLoadError.title")}
					description={t(
						"partner.staffPage.editor.entityLoadError.description",
					)}
					onRefresh={() => {
						void entitiesQuery.refetch();
					}}
				/>
			);
		}

		if (!canRenderForm) {
			return (
				<NotFoundState title={t("partner.staffPage.update.notFound.title")} />
			);
		}

		return (
			<div className="grid gap-4">
				{mode === "update" ? (
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("partner.staffPage.editor.fields.entity")}
						</p>
						<p className="ty-sm-semibold">
							{staffDetailQuery.data?.entityName ??
								entityById.get(form.getValues("entityId"))?.name ??
								t("partner.staffPage.editor.fields.entityPlaceholder")}
						</p>
					</div>
				) : (
					<div className="grid gap-2">
						<Label htmlFor="staff-entity">
							{t("partner.staffPage.editor.fields.entity")}
						</Label>
						<Controller
							control={form.control}
							name="entityId"
							render={({ field }) => (
								<Combobox
									id="staff-entity"
									options={entityOptions}
									value={field.value}
									onValueChange={field.onChange}
									placeholder={t(
										"partner.staffPage.editor.fields.entityPlaceholder",
									)}
									searchPlaceholder={t(
										"partner.staffPage.editor.fields.entitySearchPlaceholder",
									)}
									emptyMessage={t(
										"partner.staffPage.editor.fields.entityEmptyMessage",
									)}
								/>
							)}
						/>
						{form.formState.errors.entityId ? (
							<p className="field-error">
								{form.formState.errors.entityId.message}
							</p>
						) : null}
					</div>
				)}

				{mode === "update" ? null : (
					<div className="grid gap-2">
						<Label htmlFor="staff-cpf">
							{t("partner.staffPage.editor.fields.cpf")}
						</Label>
						<Input
							id="staff-cpf"
							inputMode="numeric"
							{...form.register("cpf")}
							aria-describedby={
								form.formState.errors.cpf ? "staff-cpf-error" : undefined
							}
							aria-invalid={form.formState.errors.cpf ? "true" : "false"}
							placeholder={t("partner.staffPage.editor.fields.cpfPlaceholder")}
						/>
						{form.formState.errors.cpf ? (
							<p
								id="staff-cpf-error"
								className="field-error"
							>
								{form.formState.errors.cpf.message}
							</p>
						) : null}
					</div>
				)}

				<div className="grid gap-2">
					<Label htmlFor="staff-name">
						{t("partner.staffPage.editor.fields.name")}
					</Label>
					<Input
						id="staff-name"
						{...form.register("name")}
						aria-describedby={
							form.formState.errors.name ? "staff-name-error" : undefined
						}
						aria-invalid={form.formState.errors.name ? "true" : "false"}
						placeholder={t("partner.staffPage.editor.fields.name")}
					/>
					{form.formState.errors.name ? (
						<p
							id="staff-name-error"
							className="field-error"
						>
							{form.formState.errors.name.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="staff-email">
						{t("partner.staffPage.editor.fields.email")}
					</Label>
					<Input
						id="staff-email"
						type="email"
						{...form.register("email")}
						aria-describedby={
							form.formState.errors.email ? "staff-email-error" : undefined
						}
						aria-invalid={form.formState.errors.email ? "true" : "false"}
						placeholder={t("partner.staffPage.editor.fields.email")}
					/>
					{form.formState.errors.email ? (
						<p
							id="staff-email-error"
							className="field-error"
						>
							{form.formState.errors.email.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="staff-password">
						{t("partner.staffPage.editor.fields.password")}
					</Label>
					<Input
						id="staff-password"
						type="password"
						showPasswordToggle
						{...form.register("password")}
						aria-describedby={
							form.formState.errors.password
								? "staff-password-error"
								: undefined
						}
						aria-invalid={form.formState.errors.password ? "true" : "false"}
						placeholder={t(
							isCreateMode
								? "partner.staffPage.create.fields.passwordPlaceholder"
								: isDuplicateMode
									? "partner.staffPage.duplicate.fields.passwordPlaceholder"
									: "partner.staffPage.update.fields.passwordPlaceholder",
						)}
					/>
					{form.formState.errors.password ? (
						<p
							id="staff-password-error"
							className="field-error"
						>
							{form.formState.errors.password.message}
						</p>
					) : null}
				</div>
			</div>
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
						{renderDrawerContent()}
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
