export const BUTTON_USAGES = {
	primary: "btn-usage-primary",
	secondary: "btn-usage-secondary",
	success: "btn-usage-success",
	info: "btn-usage-info",
	warning: "btn-usage-warning",
	danger: "btn-usage-danger",
	light: "btn-usage-light",
	dark: "btn-usage-dark",
} as const;

export const BUTTON_VARIANTS = {
	primary: "btn-variant-primary",
	secondary: "btn-variant-secondary",
} as const;

export const BUTTON_SIZES = {
	sm: "min-h-8 px-3 py-1.5 text-xs",
	md: "min-h-9 px-4 py-2 text-sm",
	lg: "min-h-10 px-5 py-2.5 text-sm",
	icon: "h-10 w-10 p-0",
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

export const APP_TOPBAR_COLLISION_PADDING = 76;

export const FLOATING_PANEL_VIEWPORT_PADDING = 16;

export const FLOATING_BOUNDARY_SELECTOR = [
	".drawer-content-base",
	".dialog-content-base",
	".navbar-content",
	".navbar-content-scroll-viewport",
	".login-page-content",
].join(", ");

export const MIN_TABLE_SCROLLBAR_THUMB_SIZE = 32;
export const TABLE_TRUNCATED_COLUMN_WIDTH = 100;

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
