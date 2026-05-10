import { PageShell } from "@/components";
import {
	AlertDialogParticle,
	DialogParticle,
	DrawerParticle,
	PopoverParticle,
	ToastParticle,
	TooltipParticle,
} from "@/features/docs";

export default function ComponentsDocsPage() {
	return (
		<PageShell className="space-y-8 p-6 lg:p-8">
			<AlertDialogParticle />
			<DialogParticle />
			<DrawerParticle />
			<PopoverParticle />
			<ToastParticle />
			<TooltipParticle />
		</PageShell>
	);
}
