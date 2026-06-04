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
