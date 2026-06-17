import type { ServicePageSizeOption } from "@/types/client/components/composite/features/service-pages/index";

export interface AppShellStoreState {
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
	toggleCollapsed: () => void;
}

export interface ServicePagePaginationEntry {
	page: number;
	size: ServicePageSizeOption;
}

export interface PaginationStoreState {
	entries: Record<string, ServicePagePaginationEntry>;
	setEntry: (key: string, entry: ServicePagePaginationEntry) => void;
	clearEntry: (key: string) => void;
}
