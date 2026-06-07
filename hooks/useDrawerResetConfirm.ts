"use client";

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
