"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { toast } from "@/components";

export function useQueryErrorToast({
	error,
	errorUpdatedAt,
	getContent,
	isError,
}: {
	error: unknown;
	errorUpdatedAt: number;
	getContent: (error: unknown) => {
		description?: ReactNode;
		title: ReactNode;
	};
	isError: boolean;
}) {
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
