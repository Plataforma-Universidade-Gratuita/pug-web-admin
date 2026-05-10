import { PageShell } from "@/components";
import {
	CheckboxParticle,
	ComboboxParticle,
	DatePickerParticle,
	InputParticle,
	LabelParticle,
	MultiSelectParticle,
	RadioGroupParticle,
	SelectParticle,
	SwitchParticle,
	TextAreaParticle,
} from "@/features/docs";

export default function ComponentsDocsPage() {
	return (
		<PageShell className="space-y-8 p-6 lg:p-8">
			<CheckboxParticle />
			<ComboboxParticle />
			<DatePickerParticle />
			<InputParticle />
			<LabelParticle />
			<MultiSelectParticle />
			<RadioGroupParticle />
			<SelectParticle />
			<SwitchParticle />
			<TextAreaParticle />
		</PageShell>
	);
}
