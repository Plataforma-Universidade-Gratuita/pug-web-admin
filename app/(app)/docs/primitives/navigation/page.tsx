import {
	AccordionParticle,
	BreadcrumbParticle,
	DropdownMenuParticle,
	TabsParticle,
} from "@/features/docs";

export default function ComponentsDocsPage() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<AccordionParticle />
			<BreadcrumbParticle />
			<DropdownMenuParticle />
			<TabsParticle />
		</main>
	);
}
