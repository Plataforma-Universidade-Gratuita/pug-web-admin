"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
	ServicePageEditorState,
	UseServicePageEditorStateOptions,
} from "@/types";

export function useServicePageEditorState<
	TMode extends string,
	TId extends string = string,
>({
	createMode,
	defaultMode,
}: UseServicePageEditorStateOptions<TMode>): ServicePageEditorState<
	TMode,
	TId
> {
	const [editorState, setEditorState] = useState<{
		id: TId | null;
		mode: TMode;
	} | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const closeEditor = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		setEditorState(null);
	}, []);

	const openCreate = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		setEditorState({
			id: null,
			mode: createMode,
		});
	}, [createMode]);

	const openEditor = useCallback((id: TId, mode: TMode) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			setEditorState({ id, mode });
			timeoutRef.current = null;
		}, 0);
	}, []);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open) {
				closeEditor();
			}
		},
		[closeEditor],
	);

	const clearIfMatches = useCallback((id: TId) => {
		setEditorState(current => (current?.id === id ? null : current));
	}, []);

	return {
		editorId: editorState?.id ?? null,
		editorMode: editorState?.mode ?? defaultMode,
		isOpen: editorState !== null,
		openCreate,
		openEditor,
		closeEditor,
		handleOpenChange,
		clearIfMatches,
	};
}
