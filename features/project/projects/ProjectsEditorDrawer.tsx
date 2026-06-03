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
import { useEntitiesQuery } from "@/features/partner/entities/queries";
import { ProjectsEditorForm } from "@/features/project/projects/ProjectsEditorForm";
import {
	useCreateProjectMutation,
	useUpdateProjectMutation,
} from "@/features/project/projects/mutations";
import { useProjectDetailQuery } from "@/features/project/projects/queries";
import {
	buildProjectDuplicateFormValues,
	buildProjectEntityOptions,
	buildProjectUpdateFormValues,
	createProjectEditorFormSchema,
	getEmptyProjectEditorFormValues,
	getProjectCreateErrorToastContent,
	getProjectDetailErrorToastContent,
	getProjectDuplicateErrorToastContent,
	getProjectEntitiesErrorToastContent,
	getProjectUpdateErrorToastContent,
	toProjectCreateRequest,
	toProjectUpdateRequest,
} from "@/features/project/projects/utils";
import {
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	ProjectsEditorDrawerProps,
	ProjectEditorFormValues,
} from "@/types";

export function ProjectsEditorDrawer({
	mode,
	open,
	onOpenChange,
	projectId,
}: ProjectsEditorDrawerProps) {
	const { t } = useTranslation();
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const isUpdateMode = mode === "update";
	const entitiesQuery = useEntitiesQuery();
	const projectDetailQuery = useProjectDetailQuery(projectId);
	const createMutation = useCreateProjectMutation();
	const updateMutation = useUpdateProjectMutation();
	const entityOptions = useMemo(
		() => buildProjectEntityOptions(entitiesQuery.data ?? []),
		[entitiesQuery.data],
	);
	const emptyValues = useMemo(() => getEmptyProjectEditorFormValues(), []);
	const form = useLocalizedZodForm<ProjectEditorFormValues>({
		schemaFactory: translated =>
			createProjectEditorFormSchema(translated, mode),
		defaultValues: emptyValues,
		mode: "onChange",
	});
	const loadedFormValues = useMemo(() => {
		if (isCreateMode) {
			return emptyValues;
		}

		if (!projectDetailQuery.data) {
			return null;
		}

		return isDuplicateMode
			? buildProjectDuplicateFormValues(projectDetailQuery.data)
			: buildProjectUpdateFormValues(projectDetailQuery.data);
	}, [emptyValues, isCreateMode, isDuplicateMode, projectDetailQuery.data]);
	const hydrationKey = useMemo(() => {
		if (isCreateMode) {
			return "create";
		}

		if (!loadedFormValues || !projectDetailQuery.data) {
			return null;
		}

		return [
			mode,
			projectDetailQuery.data.id,
			loadedFormValues.name,
			loadedFormValues.entityId,
			loadedFormValues.offeredHours,
			loadedFormValues.maxParticipants,
			loadedFormValues.description,
		].join("|");
	}, [isCreateMode, loadedFormValues, mode, projectDetailQuery.data]);
	const canRenderForm = isCreateMode ? true : Boolean(projectDetailQuery.data);
	const isDrawerLoading =
		open &&
		((!isUpdateMode && entitiesQuery.isLoading) ||
			(!isCreateMode && projectDetailQuery.isLoading));
	const isSubmitPending = createMutation.isPending || updateMutation.isPending;
	const drawerOverhead = t(
		isCreateMode
			? "project.projectPage.create.overhead"
			: isDuplicateMode
				? "project.projectPage.duplicate.overhead"
				: "project.projectPage.update.overhead",
	);
	const drawerTitleFallback = t(
		isCreateMode
			? "project.projectPage.create.titleFallback"
			: isDuplicateMode
				? "project.projectPage.duplicate.titleFallback"
				: "project.projectPage.update.titleFallback",
	);
	const saveLabel = t(
		isCreateMode
			? "project.projectPage.create.actions.save"
			: isDuplicateMode
				? "project.projectPage.duplicate.actions.save"
				: "project.projectPage.update.actions.save",
	);
	const savePendingLabel = t(
		isCreateMode
			? "project.projectPage.create.actions.savePending"
			: isDuplicateMode
				? "project.projectPage.duplicate.actions.savePending"
				: "project.projectPage.update.actions.savePending",
	);

	useQueryErrorToasts([
		{
			key: "project-editor-detail",
			error: projectDetailQuery.error,
			errorUpdatedAt: projectDetailQuery.errorUpdatedAt,
			getContent: error => getProjectDetailErrorToastContent(t, error),
			isError: projectDetailQuery.isError,
		},
		{
			key: "project-editor-entities",
			error: entitiesQuery.error,
			errorUpdatedAt: entitiesQuery.errorUpdatedAt,
			getContent: error => getProjectEntitiesErrorToastContent(t, error),
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

	function onSubmit(values: ProjectEditorFormValues) {
		if (isCreateMode || isDuplicateMode) {
			createMutation.mutate(
				{
					body: toProjectCreateRequest(values),
				},
				{
					onSuccess: project => {
						toast.success(
							t(
								isCreateMode
									? "project.projectPage.create.feedback.success.title"
									: "project.projectPage.duplicate.feedback.success.title",
							),
							{
								description: t(
									isCreateMode
										? "project.projectPage.create.feedback.success.description"
										: "project.projectPage.duplicate.feedback.success.description",
									{
										name: project.name,
									},
								),
							},
						);
						closeDrawer();
					},
					onError: error => {
						const { title, description } = isCreateMode
							? getProjectCreateErrorToastContent(t, error)
							: getProjectDuplicateErrorToastContent(t, error);
						toast.danger(title, { description });
					},
				},
			);
			return;
		}

		if (!projectId) {
			return;
		}

		updateMutation.mutate(
			{
				body: toProjectUpdateRequest(values),
				id: projectId,
			},
			{
				onSuccess: project => {
					toast.success(
						t("project.projectPage.update.feedback.success.title"),
						{
							description: t(
								"project.projectPage.update.feedback.success.description",
								{
									name: project.name,
								},
							),
						},
					);
					closeDrawer();
				},
				onError: error => {
					const { title, description } = getProjectUpdateErrorToastContent(
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
				loadingLabel={t("project.projectPage.editor.loading")}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{projectDetailQuery.data?.name ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<ProjectsEditorForm
							canRenderForm={canRenderForm}
							entitiesError={entitiesQuery.isError ? entitiesQuery.error : null}
							entityOptions={entityOptions}
							form={form}
							mode={mode}
							onRefreshEntities={() => {
								void entitiesQuery.refetch();
							}}
							onRefreshProject={() => {
								void projectDetailQuery.refetch();
							}}
							project={projectDetailQuery.data}
							projectError={
								projectDetailQuery.isError ? projectDetailQuery.error : null
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
							{t("project.projectPage.editor.actions.reset")}
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
							{t("project.projectPage.editor.resetConfirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("project.projectPage.editor.resetConfirm.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("project.projectPage.editor.actions.reset")}
						onAction={resetForm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
