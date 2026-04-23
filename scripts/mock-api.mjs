import http from "node:http";

import { mockHandlers } from "../mocks/api/handlers.mjs";

const port = Number(process.env.MOCK_API_PORT ?? 8090);
const verbose = String(process.env.MOCK_API_VERBOSE ?? "true") === "true";

function findHandler(method, pathname) {
	return mockHandlers.find(
		handler => handler.method === method && handler.path === pathname,
	);
}

function writeJson(response, status, body) {
	response.writeHead(status, {
		"Content-Type": "application/json",
	});
	response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
	const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
	const handler = findHandler(request.method ?? "GET", url.pathname);

	if (verbose) {
		console.log(`[mock-api] ${request.method} ${url.pathname}`);
	}

	if (!handler) {
		writeJson(response, 404, {
			success: false,
			data: null,
			error: {
				code: "MOCK_ROUTE_NOT_FOUND",
				message: `No mock handler registered for ${request.method} ${url.pathname}.`,
				details: null,
			},
			timestamp: new Date().toISOString(),
			correlationId: null,
		});
		return;
	}

	try {
		const result = await handler.handle(request, { url });
		if (result.body == null) {
			response.writeHead(result.status);
			response.end();
			return;
		}

		writeJson(response, result.status, result.body);
	} catch (error) {
		console.error("[mock-api] Unhandled error:", error);
		writeJson(response, 500, {
			success: false,
			data: null,
			error: {
				code: "MOCK_INTERNAL_ERROR",
				message: "Unhandled mock API error.",
				details: null,
			},
			timestamp: new Date().toISOString(),
			correlationId: null,
		});
	}
});

server.listen(port, () => {
	console.log(`[mock-api] listening on http://localhost:${port}`);
});
