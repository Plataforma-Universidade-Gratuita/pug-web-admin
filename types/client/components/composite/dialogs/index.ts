/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ReactNode } from "react";

export interface ServicePageConfirmDialogProps {
	actionLabel: ReactNode;
	cancelLabel: ReactNode;
	description: ReactNode;
	onAction: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	title: ReactNode;
	variant?: "danger" | "success" | "warning";
}

export interface RecordActionDialogConfig {
	actionLabel: ReactNode;
	description: ReactNode;
	onAction: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	title: ReactNode;
	variant?: "danger" | "success" | "warning";
}

export interface RecordActionDialogsProps {
	cancelLabel: ReactNode;
	deleteDialog?: RecordActionDialogConfig;
	statusDialog?: RecordActionDialogConfig;
}

export interface ResetChangesDialogProps {
	actionLabel: ReactNode;
	cancelLabel: ReactNode;
	description: ReactNode;
	onAction: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	title: ReactNode;
}
