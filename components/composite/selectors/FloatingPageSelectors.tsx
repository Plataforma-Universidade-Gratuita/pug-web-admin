"use client";

import { useTranslation } from "react-i18next";

import { LanguageSelector, ThemeSelector } from "@/components";
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/constants";
import { useLocale } from "@/contexts/locale";
import { useTheme } from "@/contexts/theme";

export function FloatingPageSelectors() {
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
			<div className="floating-page-controls-inner">
				<div className="floating-page-controls-picker">
					<ThemeSelector
						value={mode}
						options={themeSelectorOptions}
						onValueChange={setMode}
						colorVariant="default"
					/>
				</div>
				<div className="floating-page-controls-picker">
					<LanguageSelector
						value={lang}
						options={languageSelectorOptions}
						onValueChange={setLang}
						colorVariant="default"
					/>
				</div>
			</div>
		</div>
	);
}
