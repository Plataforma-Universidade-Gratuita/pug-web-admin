import { ShieldCheck } from "lucide-react";

import { Icon } from "@/components";
import { LOGIN_SECURITY_HIGHLIGHTS } from "@/constants/auth";

export function LoginHero() {
	return (
		<div className="login-hero">
			<div className="login-hero-copy">
				<div className="login-hero-chip">
					<Icon
						icon={ShieldCheck}
						className="h-4 w-4"
					/>
					Admin access
				</div>

				<p className="login-hero-kicker">PUG Web Admin</p>
				<h1 className="login-hero-title">
					Sign in to manage academic operations with clarity.
				</h1>
			</div>

			<div className="login-hero-list">
				{LOGIN_SECURITY_HIGHLIGHTS.map(item => (
					<div
						key={item}
						className="login-hero-item"
					>
						{item}
					</div>
				))}
			</div>
		</div>
	);
}
