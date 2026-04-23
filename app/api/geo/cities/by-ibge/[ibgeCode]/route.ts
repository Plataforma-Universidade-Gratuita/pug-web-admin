import { cities } from "@/api";
import { CityResponseSchema } from "@/schemas/api";
import { routeWithAuthRetry } from "@/utils/route";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ ibgeCode: string }> },
) {
	const { ibgeCode } = await params;
	return routeWithAuthRetry(
		(token) => cities.getByIbge(ibgeCode, token),
		CityResponseSchema,
	);
}
