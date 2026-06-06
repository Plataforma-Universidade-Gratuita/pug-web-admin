import {
	PageShell,
	Section,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";
import type { EntityPageShellProps } from "@/types";

export function EntityPageShell({
	children,
	description,
	title,
}: EntityPageShellProps) {
	return (
		<PageShell
			className="grid gap-4 p-4 lg:p-6"
			width="default"
		>
			<Section className="shadow-normal rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-2)] px-5 py-4">
				<SectionHeader>
					<div className="grid gap-2">
						<SectionTitle className="text-3xl">{title}</SectionTitle>
						{description ? (
							<SectionDescription className="max-w-none">
								{description}
							</SectionDescription>
						) : null}
					</div>
				</SectionHeader>
				<SectionContent>{children}</SectionContent>
			</Section>
		</PageShell>
	);
}
