"use client";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import { toast } from "@/components";
import {
	useRemoveStaffMutation,
	useSetStaffActiveMutation,
} from "@/features/partner/staff/mutations";
import {
	getStaffDeleteErrorToastContent,
	getStaffSetActiveErrorToastContent,
} from "@/features/partner/staff/utils";
import { useDeferredUndoAction } from "@/hooks";
import type { StaffSearchResponse } from "@/types";
import type { UseStaffPageActionsProps } from "@/types";

export function useStaffPageActions({
	currentEditorId,
	currentSelectedId,
	onClearEditor,
	onClearSelection,
}: UseStaffPageActionsProps) {
	const { t } = useTranslation();
	const [pendingStatusStaff, setPendingStatusStaff] = useState<{
		active: boolean;
		staff: StaffSearchResponse;
	} | null>(null);
	const [pendingDeleteStaff, setPendingDeleteStaff] =
		useState<StaffSearchResponse | null>(null);
	const setStaffActiveMutation = useSetStaffActiveMutation();
	const removeStaffMutation = useRemoveStaffMutation();
	const { schedule } = useDeferredUndoAction();

	function confirmStatusChange() {
		if (!pendingStatusStaff) {
			return;
		}

		const { active, staff } = pendingStatusStaff;

		setStaffActiveMutation.mutate(
			{
				id: staff.account.id,
				active,
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							active
								? "partner.staffPage.reactivate.feedback.success.title"
								: "partner.staffPage.deactivate.feedback.success.title",
						),
						{
							description: t(
								active
									? "partner.staffPage.reactivate.feedback.success.description"
									: "partner.staffPage.deactivate.feedback.success.description",
								{
									name: staff.account.user.name,
								},
							),
						},
					);
					setPendingStatusStaff(null);
				},
				onError: error => {
					const { title, description } = getStaffSetActiveErrorToastContent(
						t,
						error,
						active,
					);
					toast.danger(title, { description });
					setPendingStatusStaff(null);
				},
			},
		);
	}

	function confirmDelete() {
		if (!pendingDeleteStaff) {
			return;
		}

		const staff = pendingDeleteStaff;
		setPendingDeleteStaff(null);

		schedule({
			key: staff.account.id,
			title: t("partner.staffPage.delete.undo.title"),
			description: t("partner.staffPage.delete.undo.description", {
				name: staff.account.user.name,
			}),
			undoLabel: t("common.actions.undo"),
			onCommit: () => {
				removeStaffMutation.mutate(
					{
						accountId: staff.account.id,
						userId: staff.account.user.id,
					},
					{
						onSuccess: () => {
							toast.success(
								t("partner.staffPage.delete.feedback.success.title"),
								{
									description: t(
										"partner.staffPage.delete.feedback.success.description",
										{
											name: staff.account.user.name,
										},
									),
								},
							);

							if (currentSelectedId === staff.account.id) {
								onClearSelection();
							}

							if (currentEditorId === staff.account.id) {
								onClearEditor();
							}
						},
						onError: error => {
							const { title, description } = getStaffDeleteErrorToastContent(
								t,
								error,
							);
							toast.danger(title, { description });
						},
					},
				);
			},
		});
	}

	return {
		confirmDelete,
		confirmStatusChange,
		pendingDeleteStaff,
		pendingStatusStaff,
		setPendingDeleteStaff,
		setPendingStatusStaff,
	};
}
