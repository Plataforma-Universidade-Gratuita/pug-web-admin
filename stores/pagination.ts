"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PAGINATION_STORAGE_KEY } from "@/constants";
import type { PaginationStoreState } from "@/types";

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
