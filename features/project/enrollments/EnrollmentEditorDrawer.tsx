"use client";

import { useMemo } from "react";

import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { ResetChangesDialog } from "@/components/composite";
import { ServicePageEditorDrawer } from "@/components/composite";
import { Button, Footer, toast } from "@/components/primitives";
import { EnrollmentEditorForm } from "@/features/project/enrollments/EnrollmentEditorForm";
import {
	buildEnrollmentFormerStudentOptions,
	buildEnrollmentProjectOptions,
	buildEnrollmentUpdateFormValues,
	createEnrollmentEditorFormSchema,
	getEmptyEnrollmentEditorFormValues,
	getEnrollmentCreateErrorToastContent,
	getEnrollmentDetailErrorToastContent,
	getEnrollmentDialogTitle,
	getEnrollmentProjectsErrorToastContent,
	getEnrollmentStudentsErrorToastContent,
	getEnrollmentUpdateErrorToastContent,
	parseEnrollmentCompositeKey,
	resolveEnrollmentStatusAction,
} from "@/features/project/enrollments/utils";
import {
	useDrawerResetConfirm,
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	EnrollmentEditorDrawerProps,
	EnrollmentEditorFormValues,
} from "@/types/client";

const { formerStudents: formerStudentsApi } = web.academic;
const { accounts: accountsApi, users: usersApi } = web.identity;
const { enrollments: enrollmentsApi, projects: projectsApi } = web.project;
const { useFormerStudentsQuery } = formerStudentsApi;
const { useAccountsQuery } = accountsApi;
const { useUsersQuery } = usersApi;
const {
	useCreateEnrollmentMutation,
	useEnrollmentStatusMutation,
	useEnrollmentDetailQuery,
} = enrollmentsApi;
const { useProjectsQuery, useProjectDetailQuery } = projectsApi;

export function EnrollmentEditorDrawer({
	enrollmentId,
	mode,
	open,
	onOpenChange,
}: EnrollmentEditorDrawerProps) {
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
	const enrollmentIdentifier = useMemo(
		() => parseEnrollmentCompositeKey(enrollmentId),
		[enrollmentId],
	);
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const projectsQuery = useProjectsQuery();
	const formerStudentsQuery = useFormerStudentsQuery();
	const enrollmentDetailQuery = useEnrollmentDetailQuery(
		enrollmentIdentifier?.projectId ?? null,
		enrollmentIdentifier?.formerStudentId ?? null,
	);
	const projectDetailQuery = useProjectDetailQuery(
		enrollmentDetailQuery.data?.projectId ?? null,
	);
	const createMutation = useCreateEnrollmentMutation();
	const updateMutation = useEnrollmentStatusMutation();
	const accountById = useMemo(
		() =>
			new Map((accountsQuery.data ?? []).map(account => [account.id, account])),
		[accountsQuery.data],
	);
	const userById = useMemo(
		() => new Map((usersQuery.data ?? []).map(user => [user.id, user])),
		[usersQuery.data],
	);
	const formerStudentById = useMemo(
		() =>
			new Map(
				(formerStudentsQuery.data ?? []).map(formerStudent => [
					formerStudent.accountId,
					formerStudent,
				]),
			),
		[formerStudentsQuery.data],
	);
	const projectOptions = useMemo(
		() => buildEnrollmentProjectOptions(projectsQuery.data ?? []),
		[projectsQuery.data],
	);
	const formerStudentOptions = useMemo(
		() =>
			buildEnrollmentFormerStudentOptions(
				formerStudentsQuery.data ?? [],
				accountById,
				userById,
			),
		[accountById, formerStudentsQuery.data, userById],
	);
	const emptyValues = useMemo(() => getEmptyEnrollmentEditorFormValues(), []);
	const form = useLocalizedZodForm<EnrollmentEditorFormValues>({
		schemaFactory: translated =>
			createEnrollmentEditorFormSchema(translated, mode),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!enrollmentDetailQuery.data) {
			return null;
		}

		return buildEnrollmentUpdateFormValues(enrollmentDetailQuery.data);
	}, [emptyValues, enrollmentDetailQuery.data, isCreateMode]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !enrollmentDetailQuery.data) {
			return null;
		}

		return [
			mode,
			enrollmentDetailQuery.data.projectId,
			enrollmentDetailQuery.data.formerStudentId,
			loadedFormValues.status,
		].join("|");
	}, [enrollmentDetailQuery.data, isCreateMode, loadedFormValues, mode]);
	const canRenderForm = isCreateMode
		? true
		: Boolean(enrollmentDetailQuery.data);
	const isDrawerLoading =
		open &&
		(projectsQuery.isLoading ||
			formerStudentsQuery.isLoading ||
			accountsQuery.isLoading ||
			usersQuery.isLoading ||
			(!isCreateMode &&
				(enrollmentDetailQuery.isLoading || projectDetailQuery.isLoading)));
	const isSubmitPending = createMutation.isPending || updateMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "project.enrollmentPage.create.overhead"
			: "project.enrollmentPage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "project.enrollmentPage.create.titleFallback"
			: "project.enrollmentPage.update.titleFallback",
	);
	const drawerTitle = isCreateMode
		? drawerTitleFallback
		: getEnrollmentDialogTitle(
				projectDetailQuery.data ?? null,
				enrollmentDetailQuery.data
					? (formerStudentById.get(
							enrollmentDetailQuery.data.formerStudentId,
						) ?? null)
					: null,
				accountById,
			) || drawerTitleFallback;

	useQueryErrorToasts([
		{
			key: "enrollment-editor-detail",
			error: enrollmentDetailQuery.error,
			errorUpdatedAt: enrollmentDetailQuery.errorUpdatedAt,
			getContent: error => getEnrollmentDetailErrorToastContent(t, error),
			isError: enrollmentDetailQuery.isError,
		},
		{
			key: "enrollment-editor-projects",
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentProjectsErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: "enrollment-editor-students",
			error: formerStudentsQuery.error,
			errorUpdatedAt: formerStudentsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentStudentsErrorToastContent(t, error),
			isError: formerStudentsQuery.isError,
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

	function onSubmit(values: EnrollmentEditorFormValues) {
		if (isCreateMode) {
			createMutation.mutate(
				{
					projectId: values.projectId,
					formerStudentId: values.formerStudentId,
				},
				{
					onSuccess: () => {
						toast.success(
							t("project.enrollmentPage.create.feedback.success.title"),
							{
								description: t(
									"project.enrollmentPage.create.feedback.success.description",
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = getEnrollmentCreateErrorToastContent(
							t,
							error,
						);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		const identifier = enrollmentIdentifier;
		const action = resolveEnrollmentStatusAction(values.status);
		if (!identifier || !action) {
			return;
		}

		updateMutation.mutate(
			{
				action,
				projectId: identifier.projectId,
				formerStudentId: identifier.formerStudentId,
			},
			{
				onSuccess: () => {
					toast.success(
						t("project.enrollmentPage.update.feedback.success.title"),
						{
							description: t(
								"project.enrollmentPage.update.feedback.success.description",
							),
						},
					);
					closeDrawer();
				},
				onError: error => {
					const { title, description } = getEnrollmentUpdateErrorToastContent(
						t,
						error,
						action,
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
				loadingLabel={t("project.enrollmentPage.editor.loading")}
				overhead={drawerOverhead}
				title={drawerTitle}
				footer={
					<Footer className="drawer-footer">
						<Button
							variant="secondary"
							usage="danger"
							onClick={openResetConfirm}
							disabled={isSubmitPending}
						>
							{t("common.reset")}
						</Button>

						<Button
							usage="success"
							leadingIcon={<Save className="h-4 w-4" />}
							onClick={form.handleSubmit(onSubmit)}
							disabled={!form.formState.isValid || isSubmitPending}
						>
							{isSubmitPending
								? t(
										isCreateMode
											? "project.enrollmentPage.create.actions.savePending"
											: "project.enrollmentPage.update.actions.savePending",
									)
								: t(
										isCreateMode
											? "project.enrollmentPage.create.actions.save"
											: "project.enrollmentPage.update.actions.save",
									)}
						</Button>
					</Footer>
				}
			>
				<EnrollmentEditorForm
					canRenderForm={canRenderForm}
					form={form}
					mode={mode}
					enrollment={enrollmentDetailQuery.data ?? null}
					enrollmentError={
						enrollmentDetailQuery.isError ? enrollmentDetailQuery.error : null
					}
					project={projectDetailQuery.data ?? null}
					projectError={
						projectDetailQuery.isError ? projectDetailQuery.error : null
					}
					projectOptions={projectOptions}
					projectsError={projectsQuery.isError ? projectsQuery.error : null}
					formerStudent={
						enrollmentDetailQuery.data
							? (formerStudentById.get(
									enrollmentDetailQuery.data.formerStudentId,
								) ?? null)
							: null
					}
					formerStudentError={
						formerStudentsQuery.isError ? formerStudentsQuery.error : null
					}
					formerStudentOptions={formerStudentOptions}
					onRefreshEnrollment={() => {
						void enrollmentDetailQuery.refetch();
					}}
					onRefreshProject={() => {
						void projectDetailQuery.refetch();
					}}
					onRefreshProjects={() => {
						void projectsQuery.refetch();
					}}
					onRefreshFormerStudent={() => {
						void formerStudentsQuery.refetch();
					}}
				/>
			</ServicePageEditorDrawer>

			<ResetChangesDialog
				open={isResetConfirmOpen}
				onOpenChange={setIsResetConfirmOpen}
				title={t("common.resetConfirm.title")}
				description={t("common.resetConfirm.description")}
				cancelLabel={t("common.cancel")}
				actionLabel={t("project.enrollmentPage.editor.actions.reset")}
				onAction={resetForm}
			/>
		</>
	);
}
