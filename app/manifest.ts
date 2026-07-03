/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "PUG Web Admin",
		short_name: "PUG Admin",
		description: "Operational workspace for the PUG platform.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#a3322a",
		icons: [
			{
				src: "/assets/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/assets/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
