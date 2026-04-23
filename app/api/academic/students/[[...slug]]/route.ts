import { z } from "zod";

import { students } from "@/api";
import {
	StudentCreateRequestSchema,
	StudentResponseSchema,
	StudentUpdateRequestSchema,
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
		const searchParams = new URL(request.url).searchParams;
		const q = searchParams.get("q") ?? undefined;
		const courseId = searchParams.get("courseId") ?? undefined;
		return routeWithAuthRetry(
			token => students.list(token, q, courseId),
			z.array(StudentResponseSchema),
		);
	}
	if (slug.length === 1 && slug[0] === "me") {
		return routeWithAuthRetry(
			token => students.getMe(token),
			StudentResponseSchema,
		);
	}
	if (slug.length === 2 && slug[0] === "by-cpf") {
		return routeWithAuthRetry(
			token => students.getByCpf(slug[1]!, token),
			StudentResponseSchema,
		);
	}
	if (slug.length === 2 && slug[0] === "by-email") {
		return routeWithAuthRetry(
			token => students.getByEmail(slug[1]!, token),
			StudentResponseSchema,
		);
	}
	if (slug.length === 2 && slug[0] === "by-registration") {
		return routeWithAuthRetry(
			token => students.getByRegistration(slug[1]!, token),
			StudentResponseSchema,
		);
	}
	if (slug.length === 1) {
		return routeWithAuthRetry(
			token => students.get(slug[0]!, token),
			StudentResponseSchema,
		);
	}
	return routeError(new Error("Not found"));
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length === 0) {
		const body = await parseRouteBody(request, StudentCreateRequestSchema);
		return routeWithAuthRetry(
			token => students.create(body, token),
			StudentResponseSchema,
		);
	}
	if (slug.length === 1 && slug[0] === "bulk") {
		const body = await parseRouteBody(
			request,
			z.array(StudentCreateRequestSchema),
		);
		return routeWithAuthRetry(
			token => students.createBulk(body, token),
			z.array(StudentResponseSchema),
		);
	}
	return routeError(new Error("Not found"));
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	const body = await parseRouteBody(request, StudentUpdateRequestSchema);
	return routeWithAuthRetry(
		token => students.update(slug[0]!, body, token),
		StudentResponseSchema,
	);
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ slug?: string[] }> },
) {
	const { slug = [] } = await params;
	if (slug.length !== 1) return routeError(new Error("Not found"));
	return routeVoidWithAuthRetry(token => students.remove(slug[0]!, token));
}
