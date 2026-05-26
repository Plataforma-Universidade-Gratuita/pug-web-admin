import type { ServicePageSizeOption } from "@/types";

export const DEFAULT_SERVICE_PAGE = 1;
export const DEFAULT_SERVICE_PAGE_SIZE = 25;
export const PAGINATION_STORAGE_KEY = "pug.pagination";

export const SERVICE_PAGE_SIZE_OPTIONS: readonly ServicePageSizeOption[] = [
	25,
	50,
	100,
	"all",
] as const;
