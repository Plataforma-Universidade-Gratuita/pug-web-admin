"use client";

import { useMemo, useState } from "react";

import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAreasOfExpertiseQuery } from "@/api/web/academic/areas-of-expertise";
import {
	useCreateCourseMutation,
	useUpdateCourseMutation,
} from "@/api/web/academic/courses";
import { useCourseDetailQuery } from "@/api/web/academic/courses";
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
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type { CourseEditorDrawerProps, CourseEditorFormValues } from "@/types";

import { CourseEditorForm } from "./CourseEditorForm";
import {
	buildCourseAreaOfExpertiseOptions,
	buildCourseDuplicateFormValues,
	buildCourseUpdateFormValues,
	createCourseEditorFormSchema,
	getCourseCreateErrorToastContent,
	getCourseDetailErrorToastContent,
	getCourseDuplicateErrorToastContent,
	getCourseSchoolsErrorToastContent,
	getCourseUpdateErrorToastContent,
	getEmptyCourseEditorFormValues,
	toCourseCreateRequest,
	toCourseUpdateRequest,
} from "./utils";

export function CourseEditorDrawer({
	courseId,
	mode,
	open,
	onOpenChange,
}: CourseEditorDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const courseDetailQuery = useCourseDetailQuery(courseId);
	const areasOfExpertiseQuery = useAreasOfExpertiseQuery();
	const createMutation = useCreateCourseMutation();
	const updateMutation = useUpdateCourseMutation();
	const areaOfExpertiseOptions = useMemo(
		() => buildCourseAreaOfExpertiseOptions(areasOfExpertiseQuery.data ?? []),
		[areasOfExpertiseQuery.data],
	);
	const emptyValues = useMemo(() => getEmptyCourseEditorFormValues(), []);
	const form = useLocalizedZodForm<CourseEditorFormValues>({
		schemaFactory: translated => createCourseEditorFormSchema(translated),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!courseDetailQuery.data) {
			return null;
		}

		return isDuplicateMode
			? buildCourseDuplicateFormValues(courseDetailQuery.data)
			: buildCourseUpdateFormValues(courseDetailQuery.data);
	}, [courseDetailQuery.data, emptyValues, isCreateMode, isDuplicateMode]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !courseDetailQuery.data) {
			return null;
		}

		return [
			mode,
			courseDetailQuery.data.id,
			loadedFormValues.name,
			loadedFormValues.areaOfExpertiseId,
		].join("|");
	}, [courseDetailQuery.data, isCreateMode, loadedFormValues, mode]);
	const canRenderForm = isCreateMode ? true : Boolean(courseDetailQuery.data);
	const isDrawerLoading =
		open &&
		(areasOfExpertiseQuery.isLoading ||
			(!isCreateMode && courseDetailQuery.isLoading));
	const isSubmitPending = createMutation.isPending || updateMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "academic.coursePage.create.overhead"
			: isDuplicateMode
				? "academic.coursePage.duplicate.overhead"
				: "academic.coursePage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "academic.coursePage.create.titleFallback"
			: isDuplicateMode
				? "academic.coursePage.duplicate.titleFallback"
				: "academic.coursePage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "academic.coursePage.create.actions.save"
			: isDuplicateMode
				? "common.actions.createDuplicate"
				: "common.actions.saveChanges",
	);
	const savePendingLabel = t(
		isCreateMode
			? "academic.coursePage.create.actions.savePending"
			: isDuplicateMode
				? "common.actions.createDuplicatePending"
				: "common.actions.saveChangesPending",
	);

	useQueryErrorToasts([
		{
			key: "course-editor-detail",
			error: courseDetailQuery.error,
			errorUpdatedAt: courseDetailQuery.errorUpdatedAt,
			getContent: error => getCourseDetailErrorToastContent(t, error),
			isError: courseDetailQuery.isError,
		},
		{
			key: "course-editor-areas-of-expertise",
			error: areasOfExpertiseQuery.error,
			errorUpdatedAt: areasOfExpertiseQuery.errorUpdatedAt,
			getContent: error => getCourseSchoolsErrorToastContent(t, error),
			isError: areasOfExpertiseQuery.isError,
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

	function onSubmit(values: CourseEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					body: toCourseCreateRequest(values),
				},
				{
					onSuccess: course => {
						toast.success(
							t(
								isCreateMode
									? "academic.coursePage.create.feedback.success.title"
									: "academic.coursePage.duplicate.feedback.success.title",
							),
							{
								description: t(
									isCreateMode
										? "academic.coursePage.create.feedback.success.description"
										: "academic.coursePage.duplicate.feedback.success.description",
									{
										name: course.name,
									},
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = isCreateMode
							? getCourseCreateErrorToastContent(t, error)
							: getCourseDuplicateErrorToastContent(t, error);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		if (!courseId) {
			return;
		}

		updateMutation.mutate(
			{
				id: courseId,
				body: toCourseUpdateRequest(values),
			},
			{
				onSuccess: course => {
					toast.success(
						t("academic.coursePage.update.feedback.success.title"),
						{
							description: t(
								"academic.coursePage.update.feedback.success.description",
								{
									name: course.name,
								},
							),
						},
					);
					closeDrawer();
				},
				onError: error => {
					const { title, description } = getCourseUpdateErrorToastContent(
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
				loadingLabel={t("academic.coursePage.editor.loading")}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{courseDetailQuery.data?.name ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<CourseEditorForm
							areaOfExpertiseOptions={areaOfExpertiseOptions}
							areasOfExpertiseError={
								areasOfExpertiseQuery.isError
									? areasOfExpertiseQuery.error
									: null
							}
							canRenderForm={canRenderForm}
							course={courseDetailQuery.data}
							courseError={
								courseDetailQuery.isError ? courseDetailQuery.error : null
							}
							form={form}
							mode={mode}
							onRefreshAreasOfExpertise={() => {
								void areasOfExpertiseQuery.refetch();
							}}
							onRefreshCourse={() => {
								void courseDetailQuery.refetch();
							}}
						/>
					</DrawerBody>

					<Footer className="drawer-footer">
						<Button
							variant="secondary"
							usage="danger"
							disabled={!form.formState.isDirty || isSubmitPending}
							onClick={() => setIsResetConfirmOpen(true)}
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

			<AlertDialog
				open={isResetConfirmOpen}
				onOpenChange={setIsResetConfirmOpen}
			>
				<AlertDialogContent variant="danger">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("academic.coursePage.editor.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("academic.coursePage.editor.resetConfirm.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("common.actions.resetChanges")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
