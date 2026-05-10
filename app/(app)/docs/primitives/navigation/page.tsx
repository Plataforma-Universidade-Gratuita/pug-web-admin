import { PageShell } from "@/components";
import {
	AccordionParticle,
	DropdownMenuParticle,
	TabsParticle,
} from "@/features/docs";

export default function ComponentsDocsPage() {
	return (
		<PageShell className="space-y-8 p-6 lg:p-8">
			<AccordionParticle />
			<DropdownMenuParticle />
			<TabsParticle />
		</PageShell>
	);
}
