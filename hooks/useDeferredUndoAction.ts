"use client";

import { useEffect, useRef } from "react";

import { toast } from "@/components";
import { DEFAULT_UNDO_DURATION } from "@/constants";
import type { DeferredUndoActionOptions } from "@/types";

export function useDeferredUndoAction() {
	const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

	useEffect(() => {
		const timers = timersRef.current;

		return () => {
			for (const timeoutId of timers.values()) {
				clearTimeout(timeoutId);
			}

			timers.clear();
		};
	}, []);

	function schedule({
		description,
		duration = DEFAULT_UNDO_DURATION,
		key,
		onCommit,
		title,
		undoLabel,
	}: DeferredUndoActionOptions) {
		const existingTimer = timersRef.current.get(key);

		if (existingTimer) {
			clearTimeout(existingTimer);
		}

		const timeoutId = setTimeout(() => {
			timersRef.current.delete(key);
			onCommit();
		}, duration);

		timersRef.current.set(key, timeoutId);

		toast.undo(title, {
			description,
			duration,
			onUndo: () => {
				const scheduledTimeout = timersRef.current.get(key);

				if (scheduledTimeout) {
					clearTimeout(scheduledTimeout);
					timersRef.current.delete(key);
				}
			},
			undoLabel,
		});
	}

	return { schedule };
}
