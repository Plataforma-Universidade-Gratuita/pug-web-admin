import { z } from "zod";

import { admins } from "@/api";
import {
	AdminCreateRequestSchema,
	AdminResponseSchema,
	AdminUpdateRequestSchema,
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
			token => admins.list(token, q),
			z.array(AdminResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(
			token => admins.getMe(token),
			AdminResponseSchema,
		);
	}
	if (slug.length === 2 && slug[0] === "by-email") {
		return routeWithAuthRetry(
			token => admins.getByEmail(slug[1]!, token),
			AdminResponseSchema,
		);
	}
	if (slug.length === 2 && slug[0] === "by-cpf") {
		return routeWithAuthRetry(
			token => admins.listByCpf(slug[1]!, token),
			z.array(AdminResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => admins.get(slug[0]!, token),
			AdminResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(request: Request) {
	const body = await parseRouteBody(request, AdminCreateRequestSchema);
	return routeWithAuthRetry(
		token => admins.create(body, token),
		AdminResponseSchema,
	);
}

export async function PUT(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, AdminUpdateRequestSchema);
	return routeWithAuthRetry(
		token => admins.update(slug[0]!, body, token),
		AdminResponseSchema,
	);
}

export async function PATCH(request: Request, { params }: AppRouteSlugContext) {
	const { slug = [] } = await params;
	if (slug.length !== 1) {
		return routeError(new Error("Not found"));
	}

	const body = await parseRouteBody(request, z.object({ active: z.boolean() }));
	return routeVoidWithAuthRetry(token =>
		admins.setActive(slug[0]!, body.active, token),
	);
}

export async function DELETE(
	_request: Request,
	{ params }: AppRouteSlugContext,
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => admins.remove(slug[0]!, token));
}