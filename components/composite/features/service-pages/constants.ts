import type { ServicePageSizeOption } from "@/types/client";

export const SERVICE_PAGE_SIZE_OPTIONS: readonly ServicePageSizeOption[] = [
	25,
	50,
	100,
	"all",
] as const;
