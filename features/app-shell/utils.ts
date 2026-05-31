"use client";

import { useState, useSyncExternalStore } from "react";

import { PASSWORD_WIRED_COOKIE } from "@/constants";

function readPasswordWiredCookie() {
	if (typeof document === "undefined") {
		return true;
	}

	const cookie = document.cookie
		.split("; ")
		.find(entry => entry.startsWith(`${PASSWORD_WIRED_COOKIE}=`));

	return cookie?.split("=")[1] !== "false";
}

export function writePasswordWiredCookie(value: boolean) {
	if (typeof document === "undefined") {
		return;
	}

	document.cookie = `${PASSWORD_WIRED_COOKIE}=${String(value)}; path=/; samesite=lax`;
}

function subscribeToPasswordWiring() {
	return () => undefined;
}

export function usePasswordWiringState() {
	const cookieRequiresPasswordWiring = useSyncExternalStore(
		subscribeToPasswordWiring,
		() => !readPasswordWiredCookie(),
		() => false,
	);
	const [isWiredOverride, setIsWiredOverride] = useState<boolean | null>(null);
	const [dialogState, setDialogState] = useState<"auto" | "open" | "closed">(
		"auto",
	);
	const requiresPasswordWiring =
		isWiredOverride == null ? cookieRequiresPasswordWiring : !isWiredOverride;
	const isDialogOpen =
		requiresPasswordWiring &&
		(dialogState === "auto" || dialogState === "open");

	function setIsDialogOpen(open: boolean) {
		setDialogState(open ? "open" : "closed");
	}

	function handleWired() {
		setIsWiredOverride(true);
		setDialogState("closed");
	}

	return {
		requiresPasswordWiring,
		isDialogOpen,
		setIsDialogOpen,
		handleWired,
	};
}
