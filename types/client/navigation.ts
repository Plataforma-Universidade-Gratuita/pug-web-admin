import type { IconComponent } from "@/types";
import type { AppLang } from "@/types";
import type { AppTheme } from "@/types";

export type TranslationKey = string;

export interface MenuLeafItem {
	href: string;
	label: TranslationKey;
	Icon: IconComponent;
	exact?: boolean;
}

export interface MenuGroupChild {
	label: TranslationKey;
	Icon: IconComponent;
	childrenItems: readonly MenuNode[];
}

export type MenuNode = MenuLeafItem | MenuGroupChild;
export type RouteLabelMap = Record<string, TranslationKey>;

export interface AppShellThemeOption {
	value: AppTheme;
	icon: IconComponent;
	labelKey: TranslationKey;
}

export interface AppShellLanguageOption {
	value: AppLang;
	labelKey: TranslationKey;
	shortLabelKey: TranslationKey;
}

export interface MenuGroupProps {
	collapsed: boolean;
	label: TranslationKey;
	Icon: IconComponent;
	childrenItems: readonly MenuNode[];
	depth?: number;
}

export interface PopoverGroupListProps {
	items: readonly MenuNode[];
	pathname: string;
	closePopover: () => void;
	depth?: number;
}

export interface PopoverGroupProps {
	item: MenuGroupChild;
	pathname: string;
	closePopover: () => void;
	depth: number;
}

export interface MenuItemProps {
	collapsed: boolean;
	href: string;
	label: TranslationKey;
	Icon: IconComponent;
	active: boolean;
	depth?: number;
}

export interface SidebarRowBaseProps {
	active: boolean;
	collapsed?: boolean;
	depth?: number;
	iconSize?: number;
	Icon: IconComponent;
	label: TranslationKey;
}

export interface SidebarRowLinkProps extends SidebarRowBaseProps {
	href: string;
	onSelect?: () => void;
}

export interface SidebarRowButtonProps extends SidebarRowBaseProps {
	ariaExpanded?: boolean;
	onPress: () => void;
}

export type SidebarRowProps =
	| ({ kind: "link" } & SidebarRowLinkProps)
	| ({ kind: "button" } & SidebarRowButtonProps);

export interface SidebarProps {
	collapsed: boolean;
}

export interface TopBarProps {
	collapsed: boolean;
	onToggleSidebar: () => void;
	showWireCredentialsAction?: boolean;
	onOpenWireCredentials?: () => void;
}

export interface RouteBreadcrumbEntry {
	href: string;
	label: string;
	current: boolean;
}
