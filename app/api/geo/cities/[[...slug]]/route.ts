import { z } from "zod";

import { cities } from "@/api";
import { CityResponseSchema } from "@/schemas/api";
import { routeError, routeWithAuthRetry } from "@/utils/route";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const q = new URL(request.url).searchParams.get("q") ?? undefined;
		return routeWithAuthRetry(
			(token) => cities.list(token, q),
			z.array(CityResponseSchema),
		);
	}
	if (slug.length === 2 && slug[0] === "by-ibge") {
		return routeWithAuthRetry(
			(token) => cities.getByIbge(slug[1]!, token),
			CityResponseSchema,
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			(token) => cities.get(slug[0]!, token),
			CityResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}
