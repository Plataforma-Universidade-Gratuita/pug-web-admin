import type { Campi } from "@/types";

export const ADMIN_CAMPI_VALUES = [
	"JARAGUA_DO_SUL",
	"JOINVILLE",
] as const satisfies readonly Campi[];

export const ACCOUNT_TYPE_VALUES = ["ADMIN", "PARTNER", "STUDENT"] as const;
