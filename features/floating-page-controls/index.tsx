"use client";

import { useTranslation } from "react-i18next";

import { LanguageSelector, ThemeSelector } from "@/components";
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/constants/app-shell";
import { useLocale } from "@/contexts/locale";
import { useTheme } from "@/contexts/theme";

export function FloatingPageControls() {
	const { t } = useTranslation();
	const { lang, setLang } = useLocale();
	const { mode, setMode } = useTheme();

	const themeSelectorOptions = THEME_OPTIONS.map(option => ({
		value: option.value,
		icon: option.icon,
		label: t(option.labelKey),
	}));

	const languageSelectorOptions = LANGUAGE_OPTIONS.map(option => ({
		value: option.value,
		label: t(option.labelKey),
		shortLabel: t(option.shortLabelKey),
	}));

	return (
		<div className="floating-page-controls">
			<div className="app-topbar-controls floating-page-controls-inner">
				<div className="app-topbar-picker app-topbar-picker-theme">
					<ThemeSelector
						value={mode}
						options={themeSelectorOptions}
						onValueChange={setMode}
					/>
				</div>
				<div className="app-topbar-picker app-topbar-picker-language">
					<LanguageSelector
						value={lang}
						options={languageSelectorOptions}
						onValueChange={setLang}
					/>
				</div>
			</div>
		</div>
	);
}
