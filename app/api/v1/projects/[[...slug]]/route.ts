import { z } from "zod";

import { projects } from "@/api";
import {
	ProjectCreateRequestSchema,
	ProjectResponseSchema,
	ProjectUpdateRequestSchema,
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
		const entityId = searchParams.get("entityId") ?? undefined;
		return routeWithAuthRetry(
			token => projects.list(token, q, entityId),
			z.array(ProjectResponseSchema),
		);
	}
	if (slug.length === 2 && slug[0] === "created-by") {
		return routeWithAuthRetry(
			token => projects.listByCreatedBy(slug[1]!, token),
			z.array(ProjectResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => projects.get(slug[0]!, token),
			ProjectResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(request: Request) {
	const body = await parseRouteBody(request, ProjectCreateRequestSchema);
	return routeWithAuthRetry(
		token => projects.create(body, token),
		ProjectResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, ProjectUpdateRequestSchema);
	return routeWithAuthRetry(
		token => projects.update(slug[0]!, body, token),
		ProjectResponseSchema,
	);
}

export async function PATCH(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length === 2 && slug[1] === "cancel") {
		return routeWithAuthRetry(
			token => projects.cancel(slug[0]!, token),
			ProjectResponseSchema,
		);
	}
	if (slug.length === 2 && slug[1] === "complete") {
		return routeWithAuthRetry(
			token => projects.complete(slug[0]!, token),
			ProjectResponseSchema,
		);
	}
	if (slug.length === 2 && slug[1] === "hold") {
		return routeWithAuthRetry(
			token => projects.hold(slug[0]!, token),
			ProjectResponseSchema,
		);
	}
	if (slug.length === 2 && slug[1] === "retake") {
		return routeWithAuthRetry(
			token => projects.retake(slug[0]!, token),
			ProjectResponseSchema,
		);
	}
	if (slug.length === 2 && slug[1] === "start") {
		return routeWithAuthRetry(
			token => projects.start(slug[0]!, token),
			ProjectResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => projects.remove(slug[0]!, token));
}
