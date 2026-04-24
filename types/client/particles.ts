import type { ReactNode } from "react";

export interface ParticlePatternNoteItem {
	description: ReactNode;
}

export interface ParticleContainerProps {
	eyebrow: string;
	title: string;
	description: string;
	children: ReactNode;
	patternNotesItems: readonly ParticlePatternNoteItem[];
	patternNotesTitle: string;
	patternNotesApiLabel: string;
	patternNotesSnippet: string;
}

export interface ParticleSectionProps {
	title: string;
	description: string;
	children: ReactNode;
	defaultExpanded?: boolean;
}

export interface ParticlePatternNotesProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: readonly ParticlePatternNoteItem[];
	title: string;
	apiLabel: string;
	snippet: string;
}
