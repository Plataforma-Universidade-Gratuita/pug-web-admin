import { ServicePageConfirmDialog } from "@/components/composite";
import type { RecordActionDialogsProps } from "@/types/client";

export function RecordActionDialogs({
	cancelLabel,
	deleteDialog,
	statusDialog,
}: RecordActionDialogsProps) {
	const statusDialogProps = statusDialog
		? {
				actionLabel: statusDialog.actionLabel,
				cancelLabel,
				description: statusDialog.description,
				onAction: statusDialog.onAction,
				onOpenChange: statusDialog.onOpenChange,
				open: statusDialog.open,
				title: statusDialog.title,
				...(statusDialog.variant !== undefined
					? { variant: statusDialog.variant }
					: {}),
			}
		: null;
	const deleteDialogProps = deleteDialog
		? {
				actionLabel: deleteDialog.actionLabel,
				cancelLabel,
				description: deleteDialog.description,
				onAction: deleteDialog.onAction,
				onOpenChange: deleteDialog.onOpenChange,
				open: deleteDialog.open,
				title: deleteDialog.title,
				...(deleteDialog.variant !== undefined
					? { variant: deleteDialog.variant }
					: {}),
			}
		: null;

	return (
		<>
			{statusDialogProps ? (
				<ServicePageConfirmDialog {...statusDialogProps} />
			) : null}

			{deleteDialogProps ? (
				<ServicePageConfirmDialog {...deleteDialogProps} />
			) : null}
		</>
	);
}
