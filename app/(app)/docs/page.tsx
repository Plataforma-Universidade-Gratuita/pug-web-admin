import {
	AccordionParticle,
	AlertDialogParticle,
	ButtonParticle,
	CardParticle,
	DatePickerParticle,
	DialogParticle,
	DropdownMenuParticle,
	EmptyStateParticle,
	IconParticle,
	InputParticle,
	MultiSelectParticle,
	PopoverParticle,
	SectionParticle,
	SelectionControlsParticle,
	SelectParticle,
	SkeletonParticle,
	StructurePrimitivesParticle,
	TextAreaParticle,
	TooltipParticle,
	ToggleControlsParticle,
} from "@/features/docs/index";

export default function Page() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<AccordionParticle />
			<AlertDialogParticle />
			<ButtonParticle />
			<CardParticle />
			<DatePickerParticle />
			<DialogParticle />
			<DropdownMenuParticle />
			<EmptyStateParticle />
			<IconParticle />
			<InputParticle />
			<MultiSelectParticle />
			<PopoverParticle />
			<SectionParticle />
			<SelectionControlsParticle />
			<SelectParticle />
			<SkeletonParticle />
			<StructurePrimitivesParticle />
			<TextAreaParticle />
			<TooltipParticle />
			<ToggleControlsParticle />
		</main>
	);
}
