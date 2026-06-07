"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SIDEBAR_STORAGE_KEY } from "@/constants";
import type { AppShellStoreState } from "@/types/client";

export const useAppShellStore = create<AppShellStoreState>()(
	persist(
		set => ({
			collapsed: true,
			setCollapsed: collapsed => set({ collapsed }),
			toggleCollapsed: () =>
				set(state => ({
					collapsed: !state.collapsed,
				})),
		}),
		{
			name: SIDEBAR_STORAGE_KEY,
			partialize: state => ({
				collapsed: state.collapsed,
			}),
		},
	),
);
