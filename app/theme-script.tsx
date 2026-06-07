import { THEME_BOOTSTRAP_SCRIPT } from "@/app/constants";

export function ThemeScript() {
	return (
		<script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
	);
}
