import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/primitives";
import type { ServicePageConfirmDialogProps } from "@/types/client";

export function ServicePageConfirmDialog({
	actionLabel,
	cancelLabel,
	description,
	onAction,
	onOpenChange,
	open,
	title,
	variant = "warning",
}: ServicePageConfirmDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<AlertDialogContent variant={variant}>
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
