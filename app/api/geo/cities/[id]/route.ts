import { cities } from "@/api";
import { CityResponseSchema } from "@/schemas/api";
import { routeWithAuthRetry } from "@/utils/route";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	return routeWithAuthRetry((token) => cities.get(id, token), CityResponseSchema);
}
