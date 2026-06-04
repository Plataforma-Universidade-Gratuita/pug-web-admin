"use client";

import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import {
	Button,
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Icon,
	toast,
} from "@/components";

interface AttendanceQrCodeDialogProps {
	hash: string | null;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function AttendanceQrCodeDialog({
	hash,
	onOpenChange,
	open,
}: AttendanceQrCodeDialogProps) {
	const { t } = useTranslation();

	async function handleCopyHash() {
		if (!hash) {
			return;
		}

		try {
			await navigator.clipboard.writeText(hash);
			toast.success(
				t(
					"project.attendancePage.dialog.qrCodeDialog.copy.feedback.success.title",
				),
				{
					description: t(
						"project.attendancePage.dialog.qrCodeDialog.copy.feedback.success.description",
					),
				},
			);
		} catch {
			toast.danger(
				t(
					"project.attendancePage.dialog.qrCodeDialog.copy.feedback.error.title",
				),
				{
					description: t(
						"project.attendancePage.dialog.qrCodeDialog.copy.feedback.error.description",
					),
				},
			);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-w-md">
				<DialogHeader
					overhead={t("project.attendancePage.dialog.qrCodeDialog.overhead")}
				>
					<DialogTitle>
						{t("project.attendancePage.dialog.qrCodeDialog.title")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid gap-4">
					<div className="border-border mx-auto flex w-fit items-center justify-center rounded-md border bg-white p-4 shadow-sm">
						{hash ? (
							<QRCode
								bgColor="#FFFFFF"
								fgColor="#111827"
								size={200}
								value={hash}
							/>
						) : null}
					</div>

					<div className="grid gap-2">
						<div className="flex items-center justify-between gap-3">
							<p className="field-label">
								{t("project.attendancePage.dialog.qrCodeDialog.hashLabel")}
							</p>
							<Button
								size="sm"
								variant="secondary"
								onClick={() => {
									void handleCopyHash();
								}}
								disabled={!hash}
							>
								<Icon
									icon={Copy}
									className="h-4 w-4"
								/>
								{t("project.attendancePage.dialog.qrCodeDialog.copy.action")}
							</Button>
						</div>
						<div className="border-border bg-surface-2 rounded-md border px-3 py-2 font-mono text-sm break-all">
							{hash ?? ""}
						</div>
					</div>
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
