import type { ToggleGroupColorVariant } from "@/types/client/components/primitives/actions/toggle-group/index";
import type { IconComponent } from "@/types/client/components/primitives/display/icon/index";
import type { AppLang, AppTheme } from "@/types/client/context";

export interface ThemeSelectorOption {
	value: AppTheme;
	icon: IconComponent;
	label: string;
}

export interface ThemeSelectorProps {
	value: AppTheme;
	options: ThemeSelectorOption[];
	onValueChange: (value: AppTheme) => void;
	colorVariant?: ToggleGroupColorVariant;
	className?: string;
}

export interface LanguageSelectorOption {
	value: AppLang;
	label: string;
	shortLabel: string;
}

export interface LanguageSelectorProps {
	value: AppLang;
	options: LanguageSelectorOption[];
	onValueChange: (value: AppLang) => void;
	colorVariant?: ToggleGroupColorVariant;
	className?: string;
}
