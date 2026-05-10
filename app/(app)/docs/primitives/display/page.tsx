import { PageShell } from "@/components";
import {
	BadgeParticle,
	CardParticle,
	EmptyStateParticle,
	IconParticle,
	SectionParticle,
	SeparatorParticle,
	SkeletonParticle,
	TableParticle,
} from "@/features/docs";

export default function ComponentsDocsPage() {
	return (
		<PageShell className="space-y-8 p-6 lg:p-8">
			<BadgeParticle />
			<CardParticle />
			<EmptyStateParticle />
			<IconParticle />
			<SectionParticle />
			<SeparatorParticle />
			<SkeletonParticle />
			<TableParticle />
		</PageShell>
	);
}
