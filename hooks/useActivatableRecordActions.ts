"use client";

import { useState } from "react";

import { toast } from "@/components";
import { useDeferredUndoAction } from "@/hooks";
import type {
	ActivatableRecordPendingStatus,
	UseActivatableRecordActionsOptions,
	UseActivatableRecordActionsResult,
} from "@/types";

export function useActivatableRecordActions<
	TRecord,
	TStatusVariables,
	TDeleteVariables,
>({
	deleteMutation,
	getDeleteErrorToastContent,
	getDeleteSuccessToastContent,
	getDeleteUndoToastContent,
	getDeleteVariables,
	getStatusErrorToastContent,
	getStatusSuccessToastContent,
	getStatusVariables,
	onDeleteSuccess,
	statusMutation,
}: UseActivatableRecordActionsOptions<
	TRecord,
	TStatusVariables,
	TDeleteVariables
>): UseActivatableRecordActionsResult<TRecord> {
	const [pendingStatusRecord, setPendingStatusRecord] =
		useState<ActivatableRecordPendingStatus<TRecord> | null>(null);
	const [pendingDeleteRecord, setPendingDeleteRecord] =
		useState<TRecord | null>(null);
	const { schedule } = useDeferredUndoAction();

	function confirmStatusChange() {
		if (!pendingStatusRecord) {
			return;
		}

		const { active, record } = pendingStatusRecord;

		statusMutation.mutate(getStatusVariables(record, active), {
			onSuccess: () => {
				const { title, description } = getStatusSuccessToastContent(
					record,
					active,
				);
				toast.success(title, { description });
				setPendingStatusRecord(null);
			},
			onError: error => {
				const { title, description } = getStatusErrorToastContent(
					error,
					record,
					active,
				);
				toast.danger(title, { description });
				setPendingStatusRecord(null);
			},
		});
	}

	function confirmDelete() {
		if (!pendingDeleteRecord) {
			return;
		}

		const record = pendingDeleteRecord;
		setPendingDeleteRecord(null);

		const undoToast = getDeleteUndoToastContent(record);

		schedule({
			key: undoToast.key,
			title: undoToast.title,
			description: undoToast.description,
			undoLabel: undoToast.undoLabel,
			onCommit: () => {
				deleteMutation.mutate(getDeleteVariables(record), {
					onSuccess: () => {
						const { title, description } = getDeleteSuccessToastContent(record);
						toast.success(title, { description });
						onDeleteSuccess?.(record);
					},
					onError: error => {
						const { title, description } = getDeleteErrorToastContent(
							error,
							record,
						);
						toast.danger(title, { description });
					},
				});
			},
		});
	}

	return {
		confirmDelete,
		confirmStatusChange,
		pendingDeleteRecord,
		pendingStatusRecord,
		setPendingDeleteRecord,
		setPendingStatusRecord,
	};
}
