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
		<main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
			<BadgeParticle />
			<CardParticle />
			<EmptyStateParticle />
			<IconParticle />
			<SectionParticle />
			<SeparatorParticle />
			<SkeletonParticle />
			<TableParticle />
		</main>
	);
}
