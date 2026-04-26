import type { IconComponent } from "@/types/client/components";
import type { AppLang } from "@/types/client/locale";
import type { AppTheme } from "@/types/client/theme";

export interface MenuGroupChild {
	href: string;
	label: string;
	Icon: IconComponent;
}

export interface MenuGroupProps {
	collapsed: boolean;
	label: string;
	Icon: IconComponent;
	childrenItems: MenuGroupChild[];
}

export interface MenuItemProps {
	collapsed: boolean;
	href: string;
	label: string;
	Icon: IconComponent;
	active: boolean;
}

export interface SettingCardOption {
	Icon?: IconComponent;
	label: string;
	value: string;
	onClick: () => void;
}

export interface SettingCardSelectedOption {
	label: string;
	value: string;
	Icon?: IconComponent;
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

export interface RouteBreadcrumbEntry {
	href: string;
	label: string;
	current: boolean;
}

export interface ThemeSettingOption extends SettingCardOption {
	value: AppTheme;
}

export interface LanguageSettingOption extends SettingCardOption {
	value: AppLang;
}
