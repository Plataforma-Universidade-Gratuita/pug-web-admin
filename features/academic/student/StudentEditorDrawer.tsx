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
import { useCoursesQuery } from "../courses/queries";
import { StudentEditorForm } from "@/features/academic/student/StudentEditorForm";
import {
	useCreateStudentMutation,
	useUpdateStudentMutation,
} from "@/features/academic/student/mutations";
import { useStudentDetailQuery } from "@/features/academic/student/queries";
import {
	buildStudentCourseOptions,
	buildStudentDuplicateFormValues,
	buildStudentUpdateFormValues,
	createStudentEditorFormSchema,
	getEmptyStudentEditorFormValues,
	getStudentCoursesErrorToastContent,
	getStudentCreateErrorToastContent,
	getStudentDetailErrorToastContent,
	getStudentDuplicateErrorToastContent,
	getStudentUpdateErrorToastContent,
	toStudentCreateRequest,
	toStudentUpdateRequest,
} from "@/features/academic/student/utils";
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	StudentEditorDrawerProps,
	StudentEditorFormValues,
} from "@/types";

export function StudentEditorDrawer({
	mode,
	onOpenChange,
	open,
	studentId,
}: StudentEditorDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const studentDetailQuery = useStudentDetailQuery(studentId);
	const coursesQuery = useCoursesQuery();
	const createMutation = useCreateStudentMutation();
	const updateMutation = useUpdateStudentMutation();
	const courseOptions = useMemo(
		() => buildStudentCourseOptions(coursesQuery.data ?? []),
		[coursesQuery.data],
	);
	const emptyValues = useMemo(() => getEmptyStudentEditorFormValues(), []);
	const form = useLocalizedZodForm<StudentEditorFormValues>({
		schemaFactory: translated =>
			createStudentEditorFormSchema(translated, mode),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!studentDetailQuery.data) {
			return null;
		}

		return isDuplicateMode
			? buildStudentDuplicateFormValues(studentDetailQuery.data)
			: buildStudentUpdateFormValues(studentDetailQuery.data);
	}, [emptyValues, isCreateMode, isDuplicateMode, studentDetailQuery.data]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !studentDetailQuery.data) {
			return null;
		}

		return [
			mode,
			studentDetailQuery.data.userId,
			loadedFormValues.name,
			loadedFormValues.email,
			loadedFormValues.academicRegistration,
			loadedFormValues.campus,
			loadedFormValues.courseId,
			loadedFormValues.requiredHours,
			loadedFormValues.startDate,
			loadedFormValues.dueDate,
		].join("|");
	}, [isCreateMode, loadedFormValues, mode, studentDetailQuery.data]);
	const canRenderForm = isCreateMode ? true : Boolean(studentDetailQuery.data);
	const isDrawerLoading =
		open &&
		(coursesQuery.isLoading || (!isCreateMode && studentDetailQuery.isLoading));
	const isSubmitPending = createMutation.isPending || updateMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "academic.studentPage.create.overhead"
			: isDuplicateMode
				? "academic.studentPage.duplicate.overhead"
				: "academic.studentPage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "academic.studentPage.create.titleFallback"
			: isDuplicateMode
				? "academic.studentPage.duplicate.titleFallback"
				: "academic.studentPage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "academic.studentPage.create.actions.save"
			: isDuplicateMode
				? "academic.studentPage.duplicate.actions.save"
				: "academic.studentPage.update.actions.save",
	);
	const savePendingLabel = t(
		isCreateMode
			? "academic.studentPage.create.actions.savePending"
			: isDuplicateMode
				? "academic.studentPage.duplicate.actions.savePending"
				: "academic.studentPage.update.actions.savePending",
	);

	useQueryErrorToasts([
		{
			key: "student-editor-detail",
			error: studentDetailQuery.error,
			errorUpdatedAt: studentDetailQuery.errorUpdatedAt,
			getContent: error => getStudentDetailErrorToastContent(t, error),
			isError: studentDetailQuery.isError,
		},
		{
			key: "student-editor-courses",
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

	function onSubmit(values: StudentEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					body: toStudentCreateRequest(values),
				},
				{
					onSuccess: student => {
						toast.success(
							t(
								isCreateMode
									? "academic.studentPage.create.feedback.success.title"
									: "academic.studentPage.duplicate.feedback.success.title",
							),
							{
								description: t(
									isCreateMode
										? "academic.studentPage.create.feedback.success.description"
										: "academic.studentPage.duplicate.feedback.success.description",
									{
										name: student.userName,
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

		if (!studentId) {
			return;
		}

		updateMutation.mutate(
			{
				id: studentId,
				body: toStudentUpdateRequest(values),
			},
			{
				onSuccess: student => {
					toast.success(
						t("academic.studentPage.update.feedback.success.title"),
						{
							description: t(
								"academic.studentPage.update.feedback.success.description",
								{
									name: student.userName,
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
				loadingLabel={t("academic.studentPage.editor.loading")}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{studentDetailQuery.data?.userName ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<StudentEditorForm
							canRenderForm={canRenderForm}
							courseOptions={courseOptions}
							coursesError={coursesQuery.isError ? coursesQuery.error : null}
							form={form}
							mode={mode}
							onRefreshCourses={() => {
								void coursesQuery.refetch();
							}}
							onRefreshStudent={() => {
								void studentDetailQuery.refetch();
							}}
							student={studentDetailQuery.data}
							studentError={
								studentDetailQuery.isError ? studentDetailQuery.error : null
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
							{t("academic.studentPage.editor.actions.reset")}
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
							{t("academic.studentPage.editor.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("academic.studentPage.editor.resetConfirm.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("academic.studentPage.editor.actions.reset")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
