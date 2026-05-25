import { ROUTE_FILE_RECOMMENDATIONS, ROUTE_PREVIEW_CARDS } from "@/constants";

export type RouteRecommendationRow =
	(typeof ROUTE_FILE_RECOMMENDATIONS)[number];
export type RoutePreviewRow = (typeof ROUTE_PREVIEW_CARDS)[number];
