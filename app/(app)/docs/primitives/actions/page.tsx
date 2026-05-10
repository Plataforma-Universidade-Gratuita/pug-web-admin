import { PageShell } from "@/components";
import {
	ButtonParticle,
	ToggleGroupParticle,
	ToggleParticle,
} from "@/features/docs";

export default function ComponentsDocsPage() {
	return (
		<PageShell className="space-y-8 p-6 lg:p-8">
			<ButtonParticle />
			<ToggleParticle />
			<ToggleGroupParticle />
		</PageShell>
	);
}
