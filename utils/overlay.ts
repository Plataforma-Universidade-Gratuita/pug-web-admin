const FLOATING_BOUNDARY_SELECTOR = [
	".drawer-content-base",
	".dialog-content-base",
	".navbar-content",
	".navbar-content-scroll-viewport",
	".login-page-content",
].join(", ");

export function getFloatingLayerBoundary(
	element: Element | null,
): HTMLElement | undefined {
	return element?.closest(FLOATING_BOUNDARY_SELECTOR) ?? undefined;
}

export function usesAppTopbarCollisionPadding(
	boundary: HTMLElement | undefined,
): boolean {
	if (!boundary) return false;

	return (
		boundary.classList.contains("navbar-content") ||
		boundary.classList.contains("navbar-content-scroll-viewport")
	);
}
