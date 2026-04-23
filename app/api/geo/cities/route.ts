import { z } from "zod";

import { cities } from "@/api";
import { CityResponseSchema } from "@/schemas/api";
import { routeWithAuthRetry } from "@/utils/route";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams.get("q") ?? undefined;
	return routeWithAuthRetry(
		(token) => cities.list(token, query),
		z.array(CityResponseSchema),
	);
}
