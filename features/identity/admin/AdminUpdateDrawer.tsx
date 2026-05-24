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
	Badge,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Footer,
	Input,
	Label,
	NotFoundState,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SomeErrorState,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	toast,
} from "@/components";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/account/utils";
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
	getAdminCreateErrorToastContent,
	createAdminEditorFormSchema,
	getAdminCampusOptions,
	getAdminDetailErrorToastContent,
	getAdminDuplicateErrorToastContent,
	getAdminUpdateErrorToastContent,
	getEmptyAdminEditorFormValues,
	getLinkedAdminAccountErrorToastContent,
	getLinkedAdminUserErrorToastContent,
	toAdminCreateRequest,
	toAdminUpdateRequest,
} from "@/features/identity/admin/utils";
import { useLocalizedZodForm } from "@/hooks";
import type {
	AdminEditorFormValues,
	AdminUpdateDrawerProps,
} from "@/types/client/identity";
import { WebApiError } from "@/utils/web-api";

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
	const detailErrorToastAtRef = useRef(0);
	const linkedAccountErrorToastAtRef = useRef(0);
	const linkedUserErrorToastAtRef = useRef(0);
	const lastHydratedKeyRef = useRef<string | null>(null);
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

	useEffect(() => {
		if (!adminDetailQuery.isError || adminDetailQuery.errorUpdatedAt === 0) {
			return;
		}

		if (detailErrorToastAtRef.current === adminDetailQuery.errorUpdatedAt) {
			return;
		}

		detailErrorToastAtRef.current = adminDetailQuery.errorUpdatedAt;
		const { title, description } = getAdminDetailErrorToastContent(
			t,
			adminDetailQuery.error,
		);
		toast.danger(title, { description });
	}, [
		adminDetailQuery.error,
		adminDetailQuery.errorUpdatedAt,
		adminDetailQuery.isError,
		t,
	]);

	useEffect(() => {
		if (
			!linkedAccountQuery.isError ||
			linkedAccountQuery.errorUpdatedAt === 0
		) {
			return;
		}

		if (
			linkedAccountErrorToastAtRef.current === linkedAccountQuery.errorUpdatedAt
		) {
			return;
		}

		linkedAccountErrorToastAtRef.current = linkedAccountQuery.errorUpdatedAt;
		const { title, description } = getLinkedAdminAccountErrorToastContent(
			t,
			linkedAccountQuery.error,
		);
		toast.danger(title, { description });
	}, [
		linkedAccountQuery.error,
		linkedAccountQuery.errorUpdatedAt,
		linkedAccountQuery.isError,
		t,
	]);

	useEffect(() => {
		if (!linkedUserQuery.isError || linkedUserQuery.errorUpdatedAt === 0) {
			return;
		}

		if (linkedUserErrorToastAtRef.current === linkedUserQuery.errorUpdatedAt) {
			return;
		}

		linkedUserErrorToastAtRef.current = linkedUserQuery.errorUpdatedAt;
		const { title, description } = getLinkedAdminUserErrorToastContent(
			t,
			linkedUserQuery.error,
		);
		toast.danger(title, { description });
	}, [
		linkedUserQuery.error,
		linkedUserQuery.errorUpdatedAt,
		linkedUserQuery.isError,
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
				onSuccess: data => {
					toast.success(t("identity.adminPage.update.feedback.success.title"), {
						description: t(
							"identity.adminPage.update.feedback.success.description",
							{
								name: data.userName,
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

	function renderLinkedUserContent() {
		if (linkedUserQuery.isLoading) {
			return (
				<p className="ty-sm text-[color:var(--twc-muted)]">
					{t("identity.adminPage.dialog.linkedUser.loading")}
				</p>
			);
		}

		if (linkedUserQuery.isError) {
			return linkedUserQuery.error instanceof WebApiError &&
				linkedUserQuery.error.status === 404 ? (
				<NotFoundState
					title={t("identity.adminPage.dialog.linkedUser.notFound.title")}
					description={t(
						"identity.adminPage.dialog.linkedUser.notFound.description",
					)}
				/>
			) : (
				<SomeErrorState
					title={t("identity.adminPage.dialog.linkedUser.error.title")}
					description={t(
						"identity.adminPage.dialog.linkedUser.error.description",
					)}
					onRefresh={() => {
						void linkedUserQuery.refetch();
					}}
				/>
			);
		}

		if (!linkedUserQuery.data) {
			return (
				<NotFoundState
					title={t("identity.adminPage.dialog.linkedUser.notFound.title")}
				/>
			);
		}

		return (
			<>
				<div className="grid gap-1">
					<p className="ty-helper">
						{t("identity.adminPage.update.fields.userName")}
					</p>
					<p className="ty-sm-semibold">{linkedUserQuery.data.name}</p>
				</div>
				<div className="grid gap-1">
					<p className="ty-helper">
						{t("identity.adminPage.update.fields.cpf")}
					</p>
					<p className="ty-sm-semibold">{linkedUserQuery.data.cpfFormatted}</p>
				</div>
			</>
		);
	}

	function renderDrawerContent() {
		if (isCreateMode) {
			return renderEditorTabs();
		}

		if (adminDetailQuery.isError) {
			if (
				adminDetailQuery.error instanceof WebApiError &&
				adminDetailQuery.error.status === 404
			) {
				return (
					<NotFoundState
						title={t("identity.adminPage.update.notFound.title")}
						description={t("identity.adminPage.update.notFound.description")}
					/>
				);
			}

			return (
				<SomeErrorState
					title={t("identity.adminPage.update.loadError.title")}
					description={t("identity.adminPage.update.loadError.description")}
					onRefresh={() => {
						void adminDetailQuery.refetch();
					}}
				/>
			);
		}

		if (linkedAccountQuery.isError) {
			if (
				linkedAccountQuery.error instanceof WebApiError &&
				linkedAccountQuery.error.status === 404
			) {
				return (
					<NotFoundState
						title={t("identity.adminPage.update.accountNotFound.title")}
						description={t(
							"identity.adminPage.update.accountNotFound.description",
						)}
					/>
				);
			}

			return (
				<SomeErrorState
					title={t("identity.adminPage.update.accountLoadError.title")}
					description={t(
						"identity.adminPage.update.accountLoadError.description",
					)}
					onRefresh={() => {
						void linkedAccountQuery.refetch();
					}}
				/>
			);
		}

		if (!canRenderForm || !adminDetailQuery.data || !linkedAccountQuery.data) {
			return (
				<NotFoundState title={t("identity.adminPage.update.notFound.title")} />
			);
		}

		return renderEditorTabs();
	}

	function renderEditorTabs() {
		const accountTypeLabel = isCreateMode
			? getAccountTypeLabel(t, "ADMIN")
			: linkedAccountQuery.data
				? getAccountTypeLabel(t, linkedAccountQuery.data.accountType)
				: undefined;
		const accountTypeTone = isCreateMode
			? "warning"
			: linkedAccountQuery.data
				? getAccountTypeTone(linkedAccountQuery.data.accountType)
				: "warning";

		return (
			<Tabs defaultValue="profile">
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

				<TabsContent
					value="profile"
					className="grid gap-4 pt-4"
				>
					<div className="grid gap-2">
						<Label htmlFor="admin-name">
							{t("identity.adminPage.update.fields.name")}
						</Label>
						<Input
							id="admin-name"
							{...form.register("name")}
							aria-describedby={
								form.formState.errors.name ? "admin-name-error" : undefined
							}
							aria-invalid={form.formState.errors.name ? "true" : "false"}
							placeholder={t("identity.adminPage.update.fields.name")}
						/>
						{form.formState.errors.name ? (
							<p
								id="admin-name-error"
								className="field-error"
							>
								{form.formState.errors.name.message}
							</p>
						) : null}
					</div>

					<div className="grid gap-2">
						<Label htmlFor="admin-email">
							{t("identity.adminPage.update.fields.email")}
						</Label>
						<Input
							id="admin-email"
							type="email"
							{...form.register("email")}
							aria-describedby={
								form.formState.errors.email ? "admin-email-error" : undefined
							}
							aria-invalid={form.formState.errors.email ? "true" : "false"}
							placeholder={t("identity.adminPage.update.fields.email")}
						/>
						{form.formState.errors.email ? (
							<p
								id="admin-email-error"
								className="field-error"
							>
								{form.formState.errors.email.message}
							</p>
						) : null}
					</div>

					{isDuplicateMode ? (
						<div className="grid gap-2">
							<Label htmlFor="admin-cpf">
								{t("identity.adminPage.update.fields.cpf")}
							</Label>
							<Input
								id="admin-cpf"
								inputMode="numeric"
								{...form.register("cpf")}
								aria-describedby={
									form.formState.errors.cpf ? "admin-cpf-error" : undefined
								}
								aria-invalid={form.formState.errors.cpf ? "true" : "false"}
								placeholder={t("identity.adminPage.update.fields.cpf")}
							/>
							{form.formState.errors.cpf ? (
								<p
									id="admin-cpf-error"
									className="field-error"
								>
									{form.formState.errors.cpf.message}
								</p>
							) : null}
						</div>
					) : null}

					<div className="grid gap-2">
						<Label htmlFor="admin-password">
							{t("identity.adminPage.update.fields.password")}
						</Label>
						<Input
							id="admin-password"
							type="password"
							showPasswordToggle
							{...form.register("password")}
							aria-describedby={
								form.formState.errors.password
									? "admin-password-error"
									: undefined
							}
							aria-invalid={form.formState.errors.password ? "true" : "false"}
							placeholder={t(
								isCreateMode
									? "identity.adminPage.create.fields.passwordPlaceholder"
									: isDuplicateMode
										? "identity.adminPage.duplicate.fields.passwordPlaceholder"
										: "identity.adminPage.update.fields.passwordPlaceholder",
							)}
						/>
						{form.formState.errors.password ? (
							<p
								id="admin-password-error"
								className="field-error"
							>
								{form.formState.errors.password.message}
							</p>
						) : null}
					</div>
				</TabsContent>

				<TabsContent
					value="access"
					className="grid gap-4 pt-4"
				>
					<div className="grid gap-2">
						<Label htmlFor="admin-campus">
							{t("identity.adminPage.update.fields.campus")}
						</Label>
						<Controller
							control={form.control}
							name="campus"
							render={({ field }) => (
								<Select
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										className="w-full"
										placeholder={t(
											"identity.adminPage.filters.campus.placeholder",
										)}
									/>
									<SelectContent>
										{campusOptions.map(option => (
											<SelectItem
												key={option.value}
												value={option.value}
											>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						{form.formState.errors.campus ? (
							<p className="field-error">
								{form.formState.errors.campus.message}
							</p>
						) : null}
					</div>

					<div className="grid gap-2">
						<Label>{t("identity.adminPage.update.fields.accountType")}</Label>
						<div>
							<Badge
								className="min-h-5 px-2 py-0.5"
								tone={accountTypeTone}
								variant="primary"
							>
								{accountTypeLabel}
							</Badge>
						</div>
					</div>

					<Controller
						control={form.control}
						name="active"
						render={({ field }) => (
							<Switch
								checked={field.value}
								onCheckedChange={field.onChange}
								label={t("identity.adminPage.update.fields.active")}
								description={
									field.value
										? t("identity.adminPage.update.fields.activeValues.active")
										: t(
												"identity.adminPage.update.fields.activeValues.inactive",
											)
								}
							/>
						)}
					/>

					{!isCreateMode && adminDetailQuery.data ? (
						<div className="grid gap-1">
							<p className="ty-helper">
								{t("identity.adminPage.update.fields.grantedAt")}
							</p>
							<p className="ty-sm-semibold">
								{adminDetailQuery.data.grantedAtFormatted}
							</p>
						</div>
					) : null}
				</TabsContent>

				{!isCreateMode && adminDetailQuery.data ? (
					<TabsContent
						value="user"
						className="grid gap-4 pt-4"
					>
						<div className="grid gap-1">
							<p className="ty-helper">
								{t("identity.adminPage.update.fields.accountId")}
							</p>
							<p className="ty-sm-semibold">
								{adminDetailQuery.data.accountId}
							</p>
						</div>
						<div className="grid gap-1">
							<p className="ty-helper">
								{t("identity.adminPage.update.fields.userId")}
							</p>
							<p className="ty-sm-semibold">{adminDetailQuery.data.userId}</p>
						</div>
						{renderLinkedUserContent()}
					</TabsContent>
				) : null}
			</Tabs>
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
						{renderDrawerContent()}
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
