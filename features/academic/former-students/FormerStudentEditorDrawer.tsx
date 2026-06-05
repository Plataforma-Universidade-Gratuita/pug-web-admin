"use client";

import { useMemo, useState } from "react";

import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useCoursesQuery } from "@/api/web/academic/courses";
import {
	useCreateFormerStudentMutation,
	useUpdateFormerStudentMutation,
} from "@/api/web/academic/former-students";
import { useFormerStudentDetailQuery } from "@/api/web/academic/former-students";
import { useAccountDetailQuery } from "@/api/web/identity/accounts";
import { useUserDetailQuery, useUsersQuery } from "@/api/web/identity/users";
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
import { FormerStudentEditorForm } from "@/features/academic/former-students/FormerStudentEditorForm";
import {
	buildFormerStudentCourseOptions,
	buildFormerStudentFormValues,
	createFormerStudentEditorFormSchema,
	getEmptyFormerStudentEditorFormValues,
	getStudentCoursesErrorToastContent,
	getStudentCreateErrorToastContent,
	getStudentDetailErrorToastContent,
	getStudentDuplicateErrorToastContent,
	getStudentUpdateErrorToastContent,
	toFormerStudentCreateRequest,
	toFormerStudentUpdateRequest,
} from "@/features/academic/former-students/utils";
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	FormerStudentEditorDrawerProps,
	FormerStudentEditorFormValues,
} from "@/types";

export function FormerStudentEditorDrawer({
	mode,
	onOpenChange,
	open,
	formerStudentId,
}: FormerStudentEditorDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const existingUsersQuery = useUsersQuery(open && mode !== "update");
	const formerStudentDetailQuery = useFormerStudentDetailQuery(formerStudentId);
	const accountDetailQuery = useAccountDetailQuery(
		formerStudentDetailQuery.data?.accountId ?? null,
	);
	const userDetailQuery = useUserDetailQuery(
		accountDetailQuery.data?.userId ?? null,
	);
	const coursesQuery = useCoursesQuery();
	const createMutation = useCreateFormerStudentMutation();
	const updateMutation = useUpdateFormerStudentMutation();
	const courseOptions = useMemo(
		() => buildFormerStudentCourseOptions(coursesQuery.data ?? []),
		[coursesQuery.data],
	);
	const courseById = useMemo(
		() => new Map((coursesQuery.data ?? []).map(course => [course.id, course])),
		[coursesQuery.data],
	);
	const emptyValues = useMemo(
		() => getEmptyFormerStudentEditorFormValues(),
		[],
	);
	const form = useLocalizedZodForm<FormerStudentEditorFormValues>({
		schemaFactory: translated =>
			createFormerStudentEditorFormSchema(translated, mode),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!formerStudentDetailQuery.data) {
			return null;
		}

		return buildFormerStudentFormValues(
			formerStudentDetailQuery.data,
			accountDetailQuery.data ?? null,
			userDetailQuery.data ?? null,
		);
	}, [
		accountDetailQuery.data,
		emptyValues,
		formerStudentDetailQuery.data,
		isCreateMode,
		userDetailQuery.data,
	]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !formerStudentDetailQuery.data) {
			return null;
		}

		return [
			mode,
			formerStudentDetailQuery.data.accountId,
			loadedFormValues.cpf,
			loadedFormValues.name,
			loadedFormValues.email,
			loadedFormValues.academicRegistration,
			loadedFormValues.campus,
			loadedFormValues.courseId,
			loadedFormValues.requiredHours,
			loadedFormValues.startDate,
			loadedFormValues.dueDate,
		].join("|");
	}, [formerStudentDetailQuery.data, isCreateMode, loadedFormValues, mode]);
	const canRenderForm = isCreateMode
		? true
		: Boolean(
				formerStudentDetailQuery.data &&
				accountDetailQuery.data &&
				userDetailQuery.data,
			);
	const isDrawerLoading =
		open &&
		(coursesQuery.isLoading ||
			(!isCreateMode &&
				(formerStudentDetailQuery.isLoading ||
					accountDetailQuery.isLoading ||
					userDetailQuery.isLoading)));
	const isSubmitPending = createMutation.isPending || updateMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "academic.formerStudentPage.create.overhead"
			: isDuplicateMode
				? "academic.formerStudentPage.duplicate.overhead"
				: "academic.formerStudentPage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "academic.formerStudentPage.create.titleFallback"
			: isDuplicateMode
				? "academic.formerStudentPage.duplicate.titleFallback"
				: "academic.formerStudentPage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "academic.formerStudentPage.create.actions.save"
			: isDuplicateMode
				? "academic.formerStudentPage.duplicate.actions.save"
				: "academic.formerStudentPage.update.actions.save",
	);
	const savePendingLabel = t(
		isCreateMode
			? "academic.formerStudentPage.create.actions.savePending"
			: isDuplicateMode
				? "academic.formerStudentPage.duplicate.actions.savePending"
				: "academic.formerStudentPage.update.actions.savePending",
	);

	useQueryErrorToasts([
		{
			key: "former-student-editor-detail",
			error: formerStudentDetailQuery.error,
			errorUpdatedAt: formerStudentDetailQuery.errorUpdatedAt,
			getContent: error => getStudentDetailErrorToastContent(t, error),
			isError: formerStudentDetailQuery.isError,
		},
		{
			key: "former-student-editor-courses",
			error: coursesQuery.error,
			errorUpdatedAt: coursesQuery.errorUpdatedAt,
			getContent: error => getStudentCoursesErrorToastContent(t, error),
			isError: coursesQuery.isError,
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

	function onSubmit(values: FormerStudentEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					body: toFormerStudentCreateRequest(values),
				},
				{
					onSuccess: () => {
						toast.success(
							t(
								isCreateMode
									? "academic.formerStudentPage.create.feedback.success.title"
									: "academic.formerStudentPage.duplicate.feedback.success.title",
							),
							{
								description: t(
									isCreateMode
										? "academic.formerStudentPage.create.feedback.success.description"
										: "academic.formerStudentPage.duplicate.feedback.success.description",
									{
										name: values.name,
									},
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = isCreateMode
							? getStudentCreateErrorToastContent(t, error)
							: getStudentDuplicateErrorToastContent(t, error);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		if (!formerStudentId) {
			return;
		}

		updateMutation.mutate(
			{
				id: formerStudentId,
				body: toFormerStudentUpdateRequest(values),
			},
			{
				onSuccess: () => {
					toast.success(
						t("academic.formerStudentPage.update.feedback.success.title"),
						{
							description: t(
								"academic.formerStudentPage.update.feedback.success.description",
								{
									name: values.name,
								},
							),
						},
					);
					closeDrawer();
				},
				onError: error => {
					const { title, description } = getStudentUpdateErrorToastContent(
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
				loadingLabel={t("academic.formerStudentPage.editor.loading")}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{userDetailQuery.data?.name ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<FormerStudentEditorForm
							canRenderForm={canRenderForm}
							courseById={courseById}
							courseOptions={courseOptions}
							coursesError={coursesQuery.isError ? coursesQuery.error : null}
							existingUsers={existingUsersQuery.data ?? []}
							form={form}
							linkedAccount={accountDetailQuery.data ?? null}
							linkedAccountError={
								accountDetailQuery.isError ? accountDetailQuery.error : null
							}
							mode={mode}
							onRefreshCourses={() => {
								void coursesQuery.refetch();
							}}
							onRefreshFormerStudent={() => {
								void formerStudentDetailQuery.refetch();
							}}
							onRefreshUser={() => {
								void userDetailQuery.refetch();
							}}
							formerStudent={formerStudentDetailQuery.data}
							formerStudentError={
								formerStudentDetailQuery.isError
									? formerStudentDetailQuery.error
									: null
							}
							userError={userDetailQuery.isError ? userDetailQuery.error : null}
						/>
					</DrawerBody>

					<Footer className="drawer-footer">
						<Button
							variant="secondary"
							usage="danger"
							disabled={!form.formState.isDirty || isSubmitPending}
							onClick={() => setIsResetConfirmOpen(true)}
						>
							{t("academic.formerStudentPage.editor.actions.reset")}
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
							{t("academic.formerStudentPage.editor.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("academic.formerStudentPage.editor.resetConfirm.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("academic.formerStudentPage.editor.actions.reset")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
