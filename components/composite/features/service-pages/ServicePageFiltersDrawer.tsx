import { Filter } from "lucide-react";

import {
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	Label,
} from "@/components";
import type { ServicePageFiltersDrawerProps } from "@/types";

export function ServicePageFiltersDrawer({
	activeLabel,
	applyLabel,
	children,
	clearConfirmDescription,
	clearConfirmTitle,
	clearLabel,
	hasActiveFilters,
	label,
	onApply,
	onClear,
	onOpenChange,
	open,
	overhead,
	title,
	triggerLabel,
}: ServicePageFiltersDrawerProps) {
	return (
		<Drawer
			open={open}
			onOpenChange={onOpenChange}
		>
			<div className="grid gap-2 self-end">
				<Label>{label}</Label>
				<Button
					variant="secondary"
					usage={hasActiveFilters ? "info" : "secondary"}
					className="w-full justify-start lg:min-w-56"
					onClick={() => onOpenChange(true)}
				>
					{hasActiveFilters ? activeLabel : triggerLabel}
				</Button>
			</div>
			<DrawerContent>
				<DrawerHeader overhead={overhead}>
					<DrawerTitle>{title}</DrawerTitle>
				</DrawerHeader>
				<DrawerBody className="grid gap-6">{children}</DrawerBody>
				<DrawerFooter
					clearConfirmTitle={clearConfirmTitle}
					clearConfirmDescription={clearConfirmDescription}
					clearLabel={clearLabel}
					actionLabel={applyLabel}
					actionIcon={Filter}
					onClear={onClear}
					onAction={onApply}
				/>
			</DrawerContent>
		</Drawer>
	);
}
