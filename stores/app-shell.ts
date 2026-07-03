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

import { SIDEBAR_STORAGE_KEY } from "@/stores/constants";
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
