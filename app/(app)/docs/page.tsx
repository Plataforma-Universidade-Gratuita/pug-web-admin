import {
	AccordionParticle,
	AlertDialogParticle,
	ButtonParticle,
	CardParticle,
	DialogParticle,
	DropdownMenuParticle,
	EmptyStateParticle,
	IconParticle,
	PopoverParticle,
	SectionParticle,
	SelectParticle,
	SkeletonParticle,
	TooltipParticle,
} from "@/features/docs/index";

export default function Page() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<AccordionParticle />
			<AlertDialogParticle />
			<ButtonParticle />
			<CardParticle />
			<DialogParticle />
			<DropdownMenuParticle />
			<EmptyStateParticle />
			<IconParticle />
			<PopoverParticle />
			<SectionParticle />
			<SelectParticle />
			<SkeletonParticle />
			<TooltipParticle />
		</main>
	);
}
