/* --- Shared Data --- */
export * from "./data/duplicate";
export * from "./data/search-date";

/* --- Error Helpers --- */
export * from "./http/api-errors";

/* --- Compatibility Re-exports --- */
export {
	compareNormalizedText,
	coerceLang,
	isAppLang,
	normalizeDigits,
	normalizeTextForSearch,
} from "@/contexts/utils";
export { WebApiError } from "@/api/web/utils";
