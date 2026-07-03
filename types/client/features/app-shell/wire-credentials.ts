/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */

export interface WireCredentialsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onWired: () => void;
}
