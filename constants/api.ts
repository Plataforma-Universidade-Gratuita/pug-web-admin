export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const JSON_HEADERS: Record<string, string> = {
	"Content-Type": "application/json",
};
