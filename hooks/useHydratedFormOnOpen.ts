"use client";

import { useEffect, useRef } from "react";

import type { FieldValues } from "react-hook-form";

import type { HydratedFormOnOpenProps } from "@/types";

export function useHydratedFormOnOpen<TValues extends FieldValues>({
	emptyValues,
	form,
	hydrationKey,
	loadedValues,
	open,
}: HydratedFormOnOpenProps<TValues>) {
	const lastHydratedKeyRef = useRef<string | null>(null);

	useEffect(() => {
		if (!open) {
			lastHydratedKeyRef.current = null;
			form.reset(emptyValues);
		}
	}, [emptyValues, form, open]);

	useEffect(() => {
		if (!open || !loadedValues || !hydrationKey) {
			return;
		}

		if (lastHydratedKeyRef.current === hydrationKey) {
			return;
		}

		form.reset(loadedValues);
		lastHydratedKeyRef.current = hydrationKey;
	}, [form, hydrationKey, loadedValues, open]);
}
