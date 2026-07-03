"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { useEffect, useRef } from "react";

import { toast } from "@/components/primitives";
import type { QueryErrorToastDescriptor } from "@/types/client";

export function useQueryErrorToasts(toasts: QueryErrorToastDescriptor[]) {
	const shownAtRef = useRef(new Map<string, number>());

	useEffect(() => {
		for (const descriptor of toasts) {
			if (!descriptor.isError || descriptor.errorUpdatedAt === 0) {
				continue;
			}

			const shownAt = shownAtRef.current.get(descriptor.key);
			if (shownAt === descriptor.errorUpdatedAt) {
				continue;
			}

			shownAtRef.current.set(descriptor.key, descriptor.errorUpdatedAt);
			const { title, description } = descriptor.getContent(descriptor.error);
			toast.danger(title, { description });
		}
	}, [toasts]);
}
