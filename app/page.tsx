"use client";

import Link from "next/link";

import { Check } from "lucide-react";
import { toast } from "sonner";

import HomeClient from "@/components/HomeClient";

export default function Page() {
	return (
		<main className="mx-auto max-w-3xl p-6">
			<h1 className="text-2xl font-semibold">PUG Admin</h1>

			<div className="mt-4 flex gap-3">
				<button
					className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
					onClick={() =>
						toast.success("Tudo certo", { icon: <Check className="size-4" /> })
					}
				>
					Testar toast
				</button>

				<Link
					href="/demo"
					className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
				>
					Ir para demo
				</Link>
				<HomeClient />
			</div>
		</main>
	);
}
