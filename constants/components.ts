export const BUTTON_USAGES = {
	primary: "btn-usage-primary",
	secondary: "btn-usage-secondary",
	success: "btn-usage-success",
	info: "btn-usage-info",
	warning: "btn-usage-warning",
	danger: "btn-usage-danger",
} as const;

export const BUTTON_VARIANTS = {
	primary: "btn-variant-primary",
	secondary: "btn-variant-secondary",
	flat: "btn-variant-primary",
	ghost: "btn-variant-secondary",
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
	primary: "",
	secondary: "",
} as const;

export const BADGE_STYLES = {
	primary: {
		neutral: "badge-tone-neutral badge-variant-primary",
		brand: "badge-tone-brand badge-variant-primary",
		success: "badge-tone-success badge-variant-primary",
		info: "badge-tone-info badge-variant-primary",
		warning: "badge-tone-warning badge-variant-primary",
		danger: "badge-tone-danger badge-variant-primary",
	},
	secondary: {
		neutral: "badge-tone-neutral badge-variant-secondary",
		brand: "badge-tone-brand badge-variant-secondary",
		success: "badge-tone-success badge-variant-secondary",
		info: "badge-tone-info badge-variant-secondary",
		warning: "badge-tone-warning badge-variant-secondary",
		danger: "badge-tone-danger badge-variant-secondary",
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
