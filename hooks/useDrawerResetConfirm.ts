"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { useState } from "react";

import type { UseDrawerResetConfirmParams } from "@/types/client";

export function useDrawerResetConfirm({
	onDrawerOpenChange,
}: UseDrawerResetConfirmParams) {
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

	function handleDrawerOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			setIsResetConfirmOpen(false);
		}

		onDrawerOpenChange(nextOpen);
	}

	return {
		handleDrawerOpenChange,
		isResetConfirmOpen,
		openResetConfirm: () => setIsResetConfirmOpen(true),
		setIsResetConfirmOpen,
	};
}
