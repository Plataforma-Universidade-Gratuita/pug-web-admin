import type { BadgeTone } from "@/types/client/components/display";

export interface HomePriorityItem {
	badge: string;
	description: string;
	href: string;
	id: string;
	title: string;
	tone: BadgeTone;
}

export interface HomePulseMetric {
	key: string;
	label: string;
	value: string;
	width: number;
}

export interface HomeRecentItem {
	action: string;
	id: string;
	module: string;
	record: string;
	when: string;
	whenTimestamp: number;
}

export interface HomeUpcomingItem {
	badge: string;
	description: string;
	href: string;
	id: string;
	title: string;
	tone: BadgeTone;
}
