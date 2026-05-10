import { PageShell } from "@/components";
import { CurrentAccountSection } from "@/features/home/CurrentAccountSection";

export default function Page() {
	return (
		<PageShell className="space-y-8 p-6 lg:p-8">
			<CurrentAccountSection />
		</PageShell>
	);
}
