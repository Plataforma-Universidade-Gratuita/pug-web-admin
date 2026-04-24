export const BUTTON_USAGES = {
	primary: "btn-usage-primary",
	secondary: "btn-usage-secondary",
	success: "btn-usage-success",
	info: "btn-usage-info",
	warning: "btn-usage-warning",
	danger: "btn-usage-danger",
} as const;

export const BUTTON_VARIANTS = {
	flat: "btn-variant-flat",
	ghost: "btn-variant-ghost",
} as const;

export const BUTTON_SIZES = {
	sm: "min-h-9 px-3 py-2 text-xs",
	md: "min-h-11 px-4 py-3 text-sm",
	lg: "min-h-12 px-5 py-3.5 text-sm",
	icon: "h-11 w-11 p-0",
} as const;

export const BADGE_TONES = {
	neutral: "",
	brand: "",
	success: "",
	info: "",
	warning: "",
	danger: "",
} as const;

export const BADGE_VARIANTS = {
	soft: "",
	solid: "",
	outline: "",
} as const;

export const BADGE_STYLES = {
	soft: {
		neutral: "badge-tone-neutral badge-variant-soft",
		brand: "badge-tone-brand badge-variant-soft",
		success: "badge-tone-success badge-variant-soft",
		info: "badge-tone-info badge-variant-soft",
		warning: "badge-tone-warning badge-variant-soft",
		danger: "badge-tone-danger badge-variant-soft",
	},
	solid: {
		neutral: "badge-tone-neutral badge-variant-solid",
		brand: "badge-tone-brand badge-variant-solid",
		success: "badge-tone-success badge-variant-solid",
		info: "badge-tone-info badge-variant-solid",
		warning: "badge-tone-warning badge-variant-solid",
		danger: "badge-tone-danger badge-variant-solid",
	},
	outline: {
		neutral: "badge-tone-neutral badge-variant-outline",
		brand: "badge-tone-brand badge-variant-outline",
		success: "badge-tone-success badge-variant-outline",
		info: "badge-tone-info badge-variant-outline",
		warning: "badge-tone-warning badge-variant-outline",
		danger: "badge-tone-danger badge-variant-outline",
	},
} as const;

export const APP_TOPBAR_HEIGHT = "3.75rem";

export const DRAWER_MOTION_STYLES = {
	top: "drawer-content-top",
	right: "drawer-content-right",
	bottom: "drawer-content-bottom",
	left: "drawer-content-left",
} as const;

export const DRAWER_POSITION_STYLES = {
	top: "drawer-side-top",
	right: "drawer-side-right",
	bottom: "drawer-side-bottom",
	left: "drawer-side-left",
} as const;

export const TOAST_DEFAULT_DURATION = 3000;
export const TOAST_UNDO_DURATION = 5000;
export const TOAST_VISIBLE_COUNT = 3;
export const TOAST_OFFSET_TOP = `calc(${APP_TOPBAR_HEIGHT} + 1rem)`;
