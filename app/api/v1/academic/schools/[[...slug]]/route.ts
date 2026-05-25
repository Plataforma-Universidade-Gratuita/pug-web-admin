import { z } from "zod";

import { schools } from "@/api";
import {
	SchoolCreateRequestSchema,
	SchoolResponseSchema,
	SchoolUpdateRequestSchema,
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
		const q = new URL(request.url).searchParams.get("q") ?? undefined;
		return routeWithAuthRetry(
			token => schools.list(token, q),
			z.array(SchoolResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => schools.get(slug[0]!, token),
			SchoolResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(request: Request) {
	const body = await parseRouteBody(request, SchoolCreateRequestSchema);
	return routeWithAuthRetry(
		token => schools.create(body, token),
		SchoolResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, SchoolUpdateRequestSchema);
	return routeWithAuthRetry(
		token => schools.update(slug[0]!, body, token),
		SchoolResponseSchema,
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => schools.remove(slug[0]!, token));
}