import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	output: "standalone",
	images: { formats: ["image/avif", "image/webp"] },
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
				],
			},
		];
	},
};
export default nextConfig;
