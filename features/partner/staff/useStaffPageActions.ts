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
import type { StaffResponse } from "@/types";
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
		staff: StaffResponse;
	} | null>(null);
	const [pendingDeleteStaff, setPendingDeleteStaff] =
		useState<StaffResponse | null>(null);
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
				id: staff.accountId,
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
									name: staff.userName,
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
			key: staff.accountId,
			title: t("partner.staffPage.delete.undo.title"),
			description: t("partner.staffPage.delete.undo.description", {
				name: staff.userName,
			}),
			undoLabel: t("partner.staffPage.delete.undo.action"),
			onCommit: () => {
				removeStaffMutation.mutate(
					{
						accountId: staff.accountId,
						userId: staff.userId,
					},
					{
						onSuccess: () => {
							toast.success(
								t("partner.staffPage.delete.feedback.success.title"),
								{
									description: t(
										"partner.staffPage.delete.feedback.success.description",
										{
											name: staff.userName,
										},
									),
								},
							);

							if (currentSelectedId === staff.accountId) {
								onClearSelection();
							}

							if (currentEditorId === staff.accountId) {
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
