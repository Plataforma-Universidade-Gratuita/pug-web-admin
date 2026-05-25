import { z } from "zod";

import { cities } from "@/api";
import { CityResponseSchema } from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import { routeError, routeWithAuthRetry } from "@/utils/route";

export async function GET(_request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		return routeWithAuthRetry(
			token => cities.list(token),
			z.array(CityResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => cities.get(slug[0]!, token),
			CityResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}
