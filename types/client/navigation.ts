import type { ForwardRefExoticComponent, RefAttributes } from "react";

import type { LucideProps } from "lucide-react";

import type { AppLang, AppTheme } from "./index";

export type NavIconType = ForwardRefExoticComponent<
	Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export interface MenuGroupChild {
	href: string;
	label: string;
	Icon: NavIconType;
}

export interface MenuGroupProps {
	collapsed: boolean;
	label: string;
	Icon: NavIconType;
	childrenItems: MenuGroupChild[];
}

export interface MenuItemProps {
	collapsed: boolean;
	href: string;
	label: string;
	Icon: NavIconType;
	active: boolean;
}

export interface SettingCardOption {
	Icon?: NavIconType;
	label: string;
	value: string;
	onClick: () => void;
}

export interface SettingCardSelectedOption {
	label: string;
	value: string;
	Icon?: NavIconType;
}

export interface SettingCardProps {
	title: string;
	selectedOption?: SettingCardSelectedOption;
	options: SettingCardOption[];
}

export interface SettingsProps {
	compact?: boolean;
}

export interface SidebarProps {
	collapsed: boolean;
}

export interface TopBarProps {
	collapsed: boolean;
	onToggleSidebar: () => void;
}

export interface ThemeSettingOption extends SettingCardOption {
	value: AppTheme;
}

export interface LanguageSettingOption extends SettingCardOption {
	value: AppLang;
}
