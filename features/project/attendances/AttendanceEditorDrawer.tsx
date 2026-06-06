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
import { AttendanceEditorForm } from "@/features/project/attendances/AttendanceEditorForm";
import {
	buildAttendanceFormerStudentOptions,
	buildAttendanceProjectOptions,
	buildAttendanceUpdateFormValues,
	createAttendanceEditorFormSchema,
	getAttendanceCreateErrorToastContent,
	getAttendanceDetailErrorToastContent,
	getAttendanceProjectsErrorToastContent,
	getAttendanceStudentsErrorToastContent,
	getAttendanceUpdateErrorToastContent,
	getEmptyAttendanceEditorFormValues,
	toAttendanceCreateRequest,
	toAttendanceValidateRequest,
} from "@/features/project/attendances/utils";
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	AttendanceEditorDrawerProps,
	AttendanceEditorFormValues,
} from "@/types";

const { formerStudents: formerStudentsApi } = web.academic;
const { accounts: accountsApi, users: usersApi } = web.identity;
const { attendances: attendancesApi, projects: projectsApi } = web.project;
const { useFormerStudentDetailQuery, useFormerStudentsQuery } =
	formerStudentsApi;
const { useAccountsQuery } = accountsApi;
const { useUsersQuery } = usersApi;
const {
	useCreateAttendanceMutation,
	useValidateAttendanceMutation,
	useAttendanceDetailQuery,
} = attendancesApi;
const { useProjectDetailQuery, useProjectsQuery } = projectsApi;

export function AttendanceEditorDrawer({
	attendanceId,
	mode,
	open,
	onOpenChange,
}: AttendanceEditorDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const projectsQuery = useProjectsQuery();
	const formerStudentsQuery = useFormerStudentsQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const attendanceDetailQuery = useAttendanceDetailQuery(
		isCreateMode ? null : attendanceId,
	);
	const formerStudentDetailQuery = useFormerStudentDetailQuery(
		attendanceDetailQuery.data?.formerStudentId ?? null,
	);
	const projectDetailQuery = useProjectDetailQuery(
		attendanceDetailQuery.data?.projectId ?? null,
	);
	const createMutation = useCreateAttendanceMutation();
	const updateMutation = useValidateAttendanceMutation();

	const accountById = useMemo(
		() =>
			new Map((accountsQuery.data ?? []).map(account => [account.id, account])),
		[accountsQuery.data],
	);
	const userById = useMemo(
		() => new Map((usersQuery.data ?? []).map(user => [user.id, user])),
		[usersQuery.data],
	);
	const projectOptions = useMemo(
		() => buildAttendanceProjectOptions(projectsQuery.data ?? []),
		[projectsQuery.data],
	);
	const formerStudentOptions = useMemo(
		() =>
			buildAttendanceFormerStudentOptions(
				formerStudentsQuery.data ?? [],
				accountById,
				userById,
			),
		[accountById, formerStudentsQuery.data, userById],
	);
	const emptyValues = useMemo(() => getEmptyAttendanceEditorFormValues(), []);
	const form = useLocalizedZodForm<AttendanceEditorFormValues>({
		schemaFactory: translated =>
			createAttendanceEditorFormSchema(translated, mode),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!attendanceDetailQuery.data) {
			return null;
		}

		return buildAttendanceUpdateFormValues(attendanceDetailQuery.data);
	}, [attendanceDetailQuery.data, emptyValues, isCreateMode]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!attendanceDetailQuery.data || !loadedFormValues) {
			return null;
		}

		return [mode, attendanceDetailQuery.data.id, loadedFormValues.status].join(
			"|",
		);
	}, [attendanceDetailQuery.data, isCreateMode, loadedFormValues, mode]);
	const isDrawerLoading =
		open &&
		(projectsQuery.isLoading ||
			formerStudentsQuery.isLoading ||
			accountsQuery.isLoading ||
			usersQuery.isLoading ||
			(!isCreateMode &&
				(attendanceDetailQuery.isLoading ||
					formerStudentDetailQuery.isLoading ||
					projectDetailQuery.isLoading)));
	const isSubmitPending = createMutation.isPending || updateMutation.isPending;
	const canRenderForm = isCreateMode
		? true
		: Boolean(attendanceDetailQuery.data);
	const drawerOverhead = t(
		isCreateMode
			? "project.attendancePage.create.overhead"
			: "project.attendancePage.update.overhead",
	);
	const drawerTitle = isCreateMode
		? t("project.attendancePage.create.titleFallback")
		: (projectDetailQuery.data?.name ??
			formerStudentDetailQuery.data?.academicRegistration ??
			attendanceDetailQuery.data?.id ??
			t("project.attendancePage.update.titleFallback"));

	useQueryErrorToasts([
		{
			key: "attendance-editor-detail",
			error: attendanceDetailQuery.error,
			errorUpdatedAt: attendanceDetailQuery.errorUpdatedAt,
			getContent: error => getAttendanceDetailErrorToastContent(t, error),
			isError: attendanceDetailQuery.isError,
		},
		{
			key: "attendance-editor-projects",
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getAttendanceProjectsErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: "attendance-editor-students",
			error: formerStudentsQuery.error,
			errorUpdatedAt: formerStudentsQuery.errorUpdatedAt,
			getContent: error => getAttendanceStudentsErrorToastContent(t, error),
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

	function handleDrawerOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			setIsResetConfirmOpen(false);
		}

		onOpenChange(nextOpen);
	}

	function onSubmit(values: AttendanceEditorFormValues) {
		if (isCreateMode) {
			createMutation.mutate(
				{
					body: toAttendanceCreateRequest(values),
				},
				{
					onSuccess: attendance => {
						toast.success(
							t("project.attendancePage.create.feedback.success.title"),
							{
								description: t(
									"project.attendancePage.create.feedback.success.description",
									{ id: attendance.id },
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = getAttendanceCreateErrorToastContent(
							t,
							error,
						);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		if (!attendanceDetailQuery.data) {
			return;
		}

		updateMutation.mutate(
			{
				id: attendanceDetailQuery.data.id,
				body: toAttendanceValidateRequest(attendanceDetailQuery.data, values),
			},
			{
				onSuccess: () => {
					toast.success(
						t("project.attendancePage.update.feedback.success.title"),
						{
							description: t(
								"project.attendancePage.update.feedback.success.description",
								{ id: attendanceDetailQuery.data.id },
							),
						},
					);
					closeDrawer();
				},
				onError: error => {
					const { title, description } = getAttendanceUpdateErrorToastContent(
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
				loadingLabel={t("project.attendancePage.editor.loading")}
				overhead={drawerOverhead}
				title={drawerTitle}
				footer={
					<Footer className="drawer-footer">
						<Button
							variant="secondary"
							usage="danger"
							onClick={() => setIsResetConfirmOpen(true)}
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
											? "project.attendancePage.create.actions.savePending"
											: "common.actions.saveChangesPending",
									)
								: t(
										isCreateMode
											? "project.attendancePage.create.actions.save"
											: "common.actions.saveChanges",
									)}
						</Button>
					</Footer>
				}
			>
				<AttendanceEditorForm
					attendance={attendanceDetailQuery.data ?? null}
					attendanceError={
						attendanceDetailQuery.isError ? attendanceDetailQuery.error : null
					}
					canRenderForm={canRenderForm}
					form={form}
					formerStudent={formerStudentDetailQuery.data ?? null}
					formerStudentError={
						formerStudentDetailQuery.isError
							? formerStudentDetailQuery.error
							: null
					}
					formerStudentOptions={formerStudentOptions}
					mode={mode}
					onRefreshAttendance={() => {
						void attendanceDetailQuery.refetch();
					}}
					onRefreshFormerStudent={() => {
						void formerStudentDetailQuery.refetch();
					}}
					onRefreshProjects={() => {
						void projectsQuery.refetch();
						void projectDetailQuery.refetch();
					}}
					project={projectDetailQuery.data ?? null}
					projectError={
						projectDetailQuery.isError ? projectDetailQuery.error : null
					}
					projectOptions={projectOptions}
					projectsError={projectsQuery.isError ? projectsQuery.error : null}
				/>
			</ServicePageEditorDrawer>

			<AlertDialog
				open={isResetConfirmOpen}
				onOpenChange={setIsResetConfirmOpen}
			>
				<AlertDialogContent variant="danger">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("common.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("common.resetConfirm.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("project.attendancePage.editor.actions.reset")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
