import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge, Icon } from "@/components/primitives";
import { LOGIN_SECURITY_HIGHLIGHTS } from "@/features/auth/login/constants";

export function LoginHero() {
	const { t } = useTranslation();

	return (
		<div className="login-hero">
			<div className="login-hero-copy">
				<div className="login-hero-header">
					<Badge
						tone="brand"
						variant="primary"
						className="login-hero-badge"
					>
						<Icon
							icon={ShieldCheck}
							className="h-4 w-4"
						/>
						{t("auth.login.hero.badge")}
					</Badge>
					<p className="login-hero-kicker">{t("auth.login.brand.name")}</p>
				</div>

				<div className="space-y-4">
					<h1 className="login-hero-title">{t("auth.login.hero.title")}</h1>
				</div>
			</div>

			<div className="login-hero-list">
				{LOGIN_SECURITY_HIGHLIGHTS.map(item => (
					<div
						key={item.titleKey}
						className="login-hero-item"
					>
						<div className="login-hero-item-icon">
							<Icon
								icon={item.icon}
								className="h-4 w-4"
							/>
						</div>
						<div className="space-y-1">
							<p className="login-hero-item-title">{t(item.titleKey)}</p>
							<p className="login-hero-item-description">
								{t(item.descriptionKey)}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
