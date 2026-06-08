"use client";

import { useMemo } from "react";

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
import { ProjectsEditorForm } from "@/features/project/projects/ProjectsEditorForm";
import {
	buildProjectAreaOfExpertiseOptions,
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
import { getCrudSuccessToastContent } from "@/features/utils";
import {
	useDrawerResetConfirm,
	useHydratedFormOnOpen,
	useLocalizedZodForm,
	useQueryErrorToasts,
} from "@/hooks";
import type {
	ProjectsEditorDrawerProps,
	ProjectEditorFormValues,
} from "@/types/client";

const { areasOfExpertise: areasOfExpertiseApi } = web.academic;
const { entities: entitiesApi } = web.partner;
const { projects: projectsApi } = web.project;
const { useAreasOfExpertiseQuery } = areasOfExpertiseApi;
const { useEntitiesQuery } = entitiesApi;
const {
	useCreateProjectMutation,
	useSetProjectAreasOfExpertiseMutation,
	useUpdateProjectMutation,
	useProjectAreasOfExpertiseQuery,
	useProjectDetailQuery,
} = projectsApi;

export function ProjectsEditorDrawer({
	mode,
	open,
	onOpenChange,
	projectId,
}: ProjectsEditorDrawerProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";
	const isDuplicateMode = mode === "duplicate";
	const isUpdateMode = mode === "update";
	const {
		handleDrawerOpenChange,
		isResetConfirmOpen,
		openResetConfirm,
		setIsResetConfirmOpen,
	} = useDrawerResetConfirm({
		onDrawerOpenChange: onOpenChange,
	});
	const areasOfExpertiseQuery = useAreasOfExpertiseQuery();
	const entitiesQuery = useEntitiesQuery();
	const projectDetailQuery = useProjectDetailQuery(projectId);
	const projectAreasOfExpertiseQuery = useProjectAreasOfExpertiseQuery(
		isCreateMode ? null : projectId,
	);
	const createMutation = useCreateProjectMutation();
	const setProjectAreasOfExpertiseMutation =
		useSetProjectAreasOfExpertiseMutation();
	const updateMutation = useUpdateProjectMutation();
	const areaOfExpertiseOptions = useMemo(
		() => buildProjectAreaOfExpertiseOptions(areasOfExpertiseQuery.data ?? []),
		[areasOfExpertiseQuery.data],
	);
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
			? buildProjectDuplicateFormValues(
					projectDetailQuery.data,
					projectAreasOfExpertiseQuery.data?.map(
						areaOfExpertise => areaOfExpertise.id,
					) ?? [],
				)
			: buildProjectUpdateFormValues(
					projectDetailQuery.data,
					projectAreasOfExpertiseQuery.data?.map(
						areaOfExpertise => areaOfExpertise.id,
					) ?? [],
				);
	}, [
		emptyValues,
		isCreateMode,
		isDuplicateMode,
		projectAreasOfExpertiseQuery.data,
		projectDetailQuery.data,
	]);
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
			loadedFormValues.areaOfExpertiseIds.join(","),
			loadedFormValues.offeredHours,
			loadedFormValues.maxParticipants,
			loadedFormValues.description,
		].join("|");
	}, [isCreateMode, loadedFormValues, mode, projectDetailQuery.data]);
	const canRenderForm = isCreateMode ? true : Boolean(projectDetailQuery.data);
	const isDrawerLoading =
		open &&
		(areasOfExpertiseQuery.isLoading ||
			(!isUpdateMode && entitiesQuery.isLoading) ||
			(!isCreateMode &&
				(projectDetailQuery.isLoading ||
					projectAreasOfExpertiseQuery.isLoading)));
	const isSubmitPending =
		createMutation.isPending ||
		updateMutation.isPending ||
		setProjectAreasOfExpertiseMutation.isPending;
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
				? "common.actions.createDuplicate"
				: "common.actions.saveChanges",
	);
	const savePendingLabel = t(
		isCreateMode
			? "project.projectPage.create.actions.savePending"
			: isDuplicateMode
				? "common.actions.createDuplicatePending"
				: "common.actions.saveChangesPending",
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
		{
			key: "project-editor-areas-of-expertise",
			error: areasOfExpertiseQuery.error,
			errorUpdatedAt: areasOfExpertiseQuery.errorUpdatedAt,
			getContent: error => getProjectEntitiesErrorToastContent(t, error),
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
						const finishSuccess = () => {
							const { title, description } = getCrudSuccessToastContent(
								t,
								isCreateMode ? "create" : "duplicate",
								project.name,
							);
							toast.success(title, { description });
							closeDrawer();
						};

						if (values.areaOfExpertiseIds.length === 0) {
							finishSuccess();
							return;
						}

						setProjectAreasOfExpertiseMutation.mutate(
							{
								projectId: project.id,
								areaOfExpertiseIds: values.areaOfExpertiseIds,
							},
							{
								onSuccess: finishSuccess,
								onError: error => {
									const { title, description } = isCreateMode
										? getProjectCreateErrorToastContent(t, error)
										: getProjectDuplicateErrorToastContent(t, error);
									toast.danger(title, { description });
								},
							},
						);
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
					setProjectAreasOfExpertiseMutation.mutate(
						{
							projectId,
							areaOfExpertiseIds: values.areaOfExpertiseIds,
						},
						{
							onSuccess: () => {
								const { title, description } = getCrudSuccessToastContent(
									t,
									"update",
									project.name,
								);
								toast.success(title, { description });
								closeDrawer();
							},
							onError: error => {
								const { title, description } =
									getProjectUpdateErrorToastContent(t, error);
								toast.danger(title, { description });
							},
						},
					);
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
				loadingLabel={t("common.editor.loading", {
					object: t("common.objects.project"),
				})}
			>
				<DrawerContent>
					<DrawerHeader overhead={drawerOverhead}>
						<DrawerTitle>
							{projectDetailQuery.data?.name ?? drawerTitleFallback}
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody className="grid gap-6">
						<ProjectsEditorForm
							areaOfExpertiseOptions={areaOfExpertiseOptions}
							areasOfExpertiseError={
								areasOfExpertiseQuery.isError
									? areasOfExpertiseQuery.error
									: null
							}
							canRenderForm={canRenderForm}
							entitiesError={entitiesQuery.isError ? entitiesQuery.error : null}
							entityOptions={entityOptions}
							form={form}
							mode={mode}
							onRefreshAreasOfExpertise={() => {
								void areasOfExpertiseQuery.refetch();
							}}
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
					object: t("common.objects.project"),
				})}
				description={t("common.resetConfirm.description")}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.actions.resetChanges")}
				onAction={resetForm}
			/>
		</>
	);
}
