"use client";

import { useEffect, useRef } from "react";

import { toast } from "@/components";
import type { QueryErrorToastProps } from "@/types/client";

export function useQueryErrorToast({
	error,
	errorUpdatedAt,
	getContent,
	isError,
}: QueryErrorToastProps) {
	const shownAtRef = useRef(0);

	useEffect(() => {
		if (!isError || errorUpdatedAt === 0) {
			return;
		}

		if (shownAtRef.current === errorUpdatedAt) {
			return;
		}

		shownAtRef.current = errorUpdatedAt;
		const { title, description } = getContent(error);
		toast.danger(title, { description });
	}, [error, errorUpdatedAt, getContent, isError]);
}
