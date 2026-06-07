import { z } from "zod";

import { areasOfExpertise, projectAreasOfExpertise } from "@/api/services";
import {
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
	routeWithAuthRetry,
} from "@/app/api/utils";
import {
	AreaOfExpertiseComplexSearchRequestSchema,
	AreaOfExpertiseComplexSearchResponseSchema,
	AreaOfExpertiseCreateRequestSchema,
	AreaOfExpertiseResponseSchema,
	AreaOfExpertiseUpdateRequestSchema,
	ProjectResponseSchema,
	createPageResponseSchema,
	PaginationRequestSchema,
} from "@/schemas/api";
import type { AppRouteSlugContext } from "@/types/client";

export async function GET(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const ids =
			new URL(request.url).searchParams
				.get("ids")
				?.split(",")
				.filter(Boolean) ?? undefined;
		return routeWithAuthRetry(
			token => areasOfExpertise.list(token, ids),
			z.array(AreaOfExpertiseResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => areasOfExpertise.get(slug[0]!, token),
			AreaOfExpertiseResponseSchema,
		);
	}
	if (slug.length === 2 && slug[1] === "projects") {
		return routeWithAuthRetry(
			token =>
				projectAreasOfExpertise.listProjectsByAreaOfExpertise(slug[0]!, token),
			z.array(ProjectResponseSchema),
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length === 1 && slug[0] === "search") {
		const url = new URL(request.url);
		const pagination = PaginationRequestSchema.parse({
			page: url.searchParams.get("page"),
			size: url.searchParams.get("size"),
		});
		const body = await parseRouteBody(
			request,
			AreaOfExpertiseComplexSearchRequestSchema,
		);
		return routeWithAuthRetry(
			token => areasOfExpertise.search(pagination, body, token),
			createPageResponseSchema(AreaOfExpertiseComplexSearchResponseSchema),
		);
	}

	const body = await parseRouteBody(
		request,
		AreaOfExpertiseCreateRequestSchema,
	);
	return routeWithAuthRetry(
		token => areasOfExpertise.create(body, token),
		AreaOfExpertiseResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(
		request,
		AreaOfExpertiseUpdateRequestSchema,
	);
	return routeWithAuthRetry(
		token => areasOfExpertise.update(slug[0]!, body, token),
		AreaOfExpertiseResponseSchema,
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length === 2 && slug[1] === "projects") {
		return routeVoidWithAuthRetry(token =>
			projectAreasOfExpertise.deleteAllByAreaOfExpertise(slug[0]!, token),
		);
	}
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token =>
		areasOfExpertise.remove(slug[0]!, token),
	);
}
