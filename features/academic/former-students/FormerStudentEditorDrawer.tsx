"use client";

import { useEffect, useMemo } from "react";

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
import { FormerStudentEditorForm } from "@/features/academic/former-students/FormerStudentEditorForm";
import {
	buildFormerStudentCourseOptions,
	buildFormerStudentDuplicateFormValues,
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
	FormerStudentEditorDrawerProps,
	FormerStudentEditorFormValues,
} from "@/types/client";

const { courses: coursesApi, formerStudents: formerStudentsApi } = web.academic;
const { accounts: accountsApi, users: usersApi } = web.identity;
const { useCoursesQuery } = coursesApi;
const {
	useCreateFormerStudentMutation,
	useUpdateFormerStudentMutation,
	useFormerStudentDetailQuery,
} = formerStudentsApi;
const { useAccountDetailQuery } = accountsApi;
const { useUserDetailQuery, useUsersQuery } = usersApi;

export function FormerStudentEditorDrawer({
	mode,
	onOpenChange,
	open,
	formerStudentId,
}: FormerStudentEditorDrawerProps) {
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

		return isDuplicateMode
			? buildFormerStudentDuplicateFormValues(
					formerStudentDetailQuery.data,
					accountDetailQuery.data ?? null,
					userDetailQuery.data ?? null,
				)
			: buildFormerStudentFormValues(
					formerStudentDetailQuery.data,
					accountDetailQuery.data ?? null,
					userDetailQuery.data ?? null,
				);
	}, [
		accountDetailQuery.data,
		emptyValues,
		formerStudentDetailQuery.data,
		isDuplicateMode,
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

	useEffect(() => {
		if (!open || !isDuplicateMode || !loadedFormValues) {
			return;
		}

		void form.trigger("academicRegistration");
	}, [form, isDuplicateMode, loadedFormValues, open]);

	function closeDrawer() {
		onOpenChange(false);
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
						const { title, description } = getCrudSuccessToastContent(
							t,
							isCreateMode ? "create" : "duplicate",
							values.name,
						);
						toast.success(title, { description });
						closeDrawer();
					},
					onError: error => {
						applyApiFieldErrors(form, error);
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
					const { title, description } = getCrudSuccessToastContent(
						t,
						"update",
						values.name,
					);
					toast.success(title, { description });
					closeDrawer();
				},
				onError: error => {
					applyApiFieldErrors(form, error);
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
				loadingLabel={t("common.editor.loading", {
					object: t("common.objects.formerStudent"),
				})}
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
				title={t("common.resetConfirm.title", {
					object: t("common.objects.formerStudent"),
				})}
				description={t("common.resetConfirm.description")}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.actions.resetChanges")}
				onAction={resetForm}
			/>
		</>
	);
}


