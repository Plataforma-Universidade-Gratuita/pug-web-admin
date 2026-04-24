import {
	ButtonParticle,
	CardParticle,
	DialogParticle,
	TooltipParticle,
} from "@/features/docs/index";

export default function Page() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<ButtonParticle />
			<CardParticle />
			<DialogParticle />
			<TooltipParticle />
		</main>
	);
}
