import { z } from "zod";

import { entities } from "@/api";
import {
	CityResponseSchema,
	EntityCreateRequestSchema,
	EntityResponseSchema,
	EntityUpdateRequestSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";
import {
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
	routeWithAuthRetry,
} from "@/utils/route";

export async function GET(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const searchParams = new URL(request.url).searchParams;
		const q = searchParams.get("q") ?? undefined;
		const cityId = searchParams.get("cityId") ?? undefined;
		return routeWithAuthRetry(
			token => entities.list(token, q, cityId),
			z.array(EntityResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "cities") {
		return routeWithAuthRetry(
			token => entities.listCities(token),
			z.array(CityResponseSchema),
		);
	}
	if (slug.length === 2 && slug[0] === "by-cnpj") {
		return routeWithAuthRetry(
			token => entities.getByCnpj(slug[1]!, token),
			EntityResponseSchema,
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => entities.get(slug[0]!, token),
			EntityResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(request: Request) {
	const body = await parseRouteBody(request, EntityCreateRequestSchema);
	return routeWithAuthRetry(
		token => entities.create(body, token),
		EntityResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, EntityUpdateRequestSchema);
	return routeWithAuthRetry(
		token => entities.update(slug[0]!, body, token),
		EntityResponseSchema,
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => entities.remove(slug[0]!, token));
}