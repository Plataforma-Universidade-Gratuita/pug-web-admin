import { z } from "zod";

import { staff } from "@/api";
import {
	StaffCreateRequestSchema,
	StaffResponseSchema,
	StaffUpdateRequestSchema,
} from "@/schemas/api";
import {
	parseRouteBody,
	routeError,
	routeVoidWithAuthRetry,
	routeWithAuthRetry,
} from "@/utils/route";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const q = new URL(request.url).searchParams.get("q") ?? undefined;
		return routeWithAuthRetry(
			token => staff.list(token, q),
			z.array(StaffResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(token => staff.getMe(token), StaffResponseSchema);
	}
	if (slug.length === 2 && slug[0] === "by-email") {
		return routeWithAuthRetry(
			token => staff.getByEmail(slug[1]!, token),
			StaffResponseSchema,
		);
	}
	if (slug.length === 2 && slug[0] === "by-cpf") {
		return routeWithAuthRetry(
			token => staff.listByCpf(slug[1]!, token),
			z.array(StaffResponseSchema),
		);
	}
	if (slug.length === 2 && slug[0] === "by-entity") {
		return routeWithAuthRetry(
			token => staff.listByEntity(slug[1]!, token),
			z.array(StaffResponseSchema),
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => staff.get(slug[0]!, token),
			StaffResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(request: Request) {
	const body = await parseRouteBody(request, StaffCreateRequestSchema);
	return routeWithAuthRetry(
		token => staff.create(body, token),
		StaffResponseSchema,
	);
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, StaffUpdateRequestSchema);
	return routeWithAuthRetry(
		token => staff.update(slug[0]!, body, token),
		StaffResponseSchema,
	);
}

export async function PATCH(
	_request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length === 2 && slug[1] === "deactivate") {
		return routeVoidWithAuthRetry(token => staff.deactivate(slug[0]!, token));
	}
	return routeError(new Error("Not found"));
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => staff.remove(slug[0]!, token));
}
