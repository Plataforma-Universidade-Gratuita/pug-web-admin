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
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Footer,
	toast,
} from "@/components";
import { useFormerStudentsQuery } from "@/features/academic/former-students/queries";
import { useAccountsQuery } from "@/features/identity/accounts/queries";
import { useUsersQuery } from "@/features/identity/users/queries";
import { AttendancesCreateForm } from "@/features/project/attendances/AttendancesCreateForm";
import { useCreateAttendanceMutation } from "@/features/project/attendances/mutations";
import {
	buildAttendanceFormerStudentOptions,
	buildAttendanceProjectOptions,
	createAttendanceFormSchema,
	getAttendanceCreateErrorToastContent,
	getAttendanceProjectsErrorToastContent,
	getAttendanceStudentsErrorToastContent,
	getEmptyAttendanceCreateFormValues,
	toAttendanceCreateRequest,
} from "@/features/project/attendances/utils";
import { useProjectsQuery } from "@/features/project/projects/queries";
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	AttendancesCreateDrawerProps,
	AttendanceCreateFormValues,
} from "@/types";

export function AttendancesCreateDrawer({
	open,
	onOpenChange,
}: AttendancesCreateDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const projectsQuery = useProjectsQuery();
	const formerStudentsQuery = useFormerStudentsQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const createMutation = useCreateAttendanceMutation();
	const projectOptions = useMemo(
		() => buildAttendanceProjectOptions(projectsQuery.data ?? []),
		[projectsQuery.data],
	);
	const accountById = useMemo(
		() => new Map((accountsQuery.data ?? []).map(account => [account.id, account])),
		[accountsQuery.data],
	);
	const userById = useMemo(
		() => new Map((usersQuery.data ?? []).map(user => [user.id, user])),
		[usersQuery.data],
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
	const emptyValues = useMemo(() => getEmptyAttendanceCreateFormValues(), []);
	const form = useLocalizedZodForm<AttendanceCreateFormValues>({
		schemaFactory: translated => createAttendanceFormSchema(translated),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const isDrawerLoading =
		open &&
		(projectsQuery.isLoading ||
			formerStudentsQuery.isLoading ||
			accountsQuery.isLoading ||
			usersQuery.isLoading);
	const isSubmitPending = createMutation.isPending;
	const canRenderForm =
		(projectsQuery.data?.length ?? 0) > 0 &&
		(formerStudentsQuery.data?.length ?? 0) > 0;

	useQueryErrorToasts([
		{
			key: "attendance-create-projects",
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getAttendanceProjectsErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: "attendance-create-students",
			error: formerStudentsQuery.error,
			errorUpdatedAt: formerStudentsQuery.errorUpdatedAt,
			getContent: error => getAttendanceStudentsErrorToastContent(t, error),
			isError: formerStudentsQuery.isError,
		},
	]);

	useHydratedFormOnOpen({
		emptyValues,
		form,
		hydrationKey: "create",
		loadedValues: emptyValues,
		open,
	});

	function handleDrawerOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			setIsResetConfirmOpen(false);
		}

		onOpenChange(nextOpen);
	}

	function resetForm() {
		form.reset(emptyValues);
		setIsResetConfirmOpen(false);
	}

	function onSubmit(values: AttendanceCreateFormValues) {
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
								{
									id: attendance.id,
								},
							),
						},
					);
					onOpenChange(false);
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
	}

	return (
		<>
			<Drawer
				open={open}
				onOpenChange={handleDrawerOpenChange}
				isLoading={isDrawerLoading}
				loadingLabel={t("project.attendancePage.editor.loading")}
			>
				<DrawerContent>
					<DrawerHeader overhead={t("project.attendancePage.create.overhead")}>
						<DrawerTitle>
							{t("project.attendancePage.create.titleFallback")}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<AttendancesCreateForm
							canRenderForm={canRenderForm}
							form={form}
							onRefreshProjects={() => {
								void projectsQuery.refetch();
							}}
							onRefreshFormerStudents={() => {
								void formerStudentsQuery.refetch();
							}}
							projectOptions={projectOptions}
							projectsError={projectsQuery.isError ? projectsQuery.error : null}
							formerStudentOptions={formerStudentOptions}
							formerStudentsError={
								formerStudentsQuery.isError ? formerStudentsQuery.error : null
							}
						/>
					</DrawerBody>

					<Footer className="drawer-footer">
						<Button
							variant="secondary"
							usage="danger"
							disabled={!form.formState.isDirty || isSubmitPending}
							onClick={() => setIsResetConfirmOpen(true)}
						>
							{t("project.attendancePage.editor.actions.reset")}
						</Button>
						<Button
							usage="success"
							isLoading={isSubmitPending}
							loadingText={t(
								"project.attendancePage.create.actions.savePending",
							)}
							leadingIcon={<Save className="h-4 w-4" />}
							disabled={!form.formState.isDirty || !canRenderForm}
							onClick={() => {
								void form.handleSubmit(onSubmit)();
							}}
						>
							{t("project.attendancePage.create.actions.save")}
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
							{t("project.attendancePage.editor.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("project.attendancePage.editor.resetConfirm.description")}
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
