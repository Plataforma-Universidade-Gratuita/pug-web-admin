"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PAGINATION_STORAGE_KEY } from "@/stores/constants";
import type { PaginationStoreState } from "@/types/client";

export const usePaginationStore = create<PaginationStoreState>()(
	persist(
		set => ({
			entries: {},
			setEntry: (key, entry) =>
				set(state => ({
					entries: {
						...state.entries,
						[key]: entry,
					},
				})),
			clearEntry: key =>
				set(state => {
					const entries = { ...state.entries };
					delete entries[key];
					return { entries };
				}),
		}),
		{
			name: PAGINATION_STORAGE_KEY,
			partialize: state => ({
				entries: state.entries,
			}),
		},
	),
);
