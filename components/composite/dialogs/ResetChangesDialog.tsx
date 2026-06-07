"use client";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/primitives";
import type { ResetChangesDialogProps } from "@/types/client";

export function ResetChangesDialog({
	actionLabel,
	cancelLabel,
	description,
	onAction,
	onOpenChange,
	open,
	title,
}: ResetChangesDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<AlertDialogContent variant="danger">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter
					cancelLabel={cancelLabel}
					actionLabel={actionLabel}
					onAction={onAction}
				/>
			</AlertDialogContent>
		</AlertDialog>
	);
}
