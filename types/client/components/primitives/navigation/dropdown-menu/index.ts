import type {
	ComponentPropsWithoutRef,
	ForwardRefExoticComponent,
	ReactNode,
	RefAttributes,
} from "react";

import type * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import type { LucideProps } from "lucide-react";

export interface DropdownMenuProps {
	children: ReactNode;
	open?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
}

export interface DropdownMenuTriggerProps {
	children: ReactNode;
}

export interface DropdownMenuContentProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>,
	"children"
> {
	children: ReactNode;
	className?: string;
}

export interface DropdownMenuItemProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>,
	"children"
> {
	inset?: boolean;
	current?: boolean;
	tone?: "default" | "brand" | "info" | "success" | "warning" | "danger";
	label: ReactNode;
	icon: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>;
}

export interface DropdownMenuLabelProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label>,
	"children"
> {
	children: ReactNode;
	inset?: boolean;
}

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
	typeof RadixDropdownMenu.Separator
>;
