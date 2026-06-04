"use client";

import { useEffect, useRef, useState } from "react";

import { FloatingPageSelectors } from "@/components";
import { LoginForm } from "@/features/auth/login/LoginForm";
import { LoginHero } from "@/features/auth/login/LoginHero";

export default function Page() {
	const formCardRef = useRef<HTMLDivElement | null>(null);
	const [desktopHeroHeight, setDesktopHeroHeight] = useState<number | null>(
		null,
	);

	useEffect(() => {
		const card = formCardRef.current;
		if (!card) {
			return;
		}

		const syncHeight = () => {
			setDesktopHeroHeight(card.getBoundingClientRect().height);
		};

		syncHeight();

		const observer = new ResizeObserver(() => {
			syncHeight();
		});

		observer.observe(card);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<main className="login-page">
			<FloatingPageSelectors />
			<section className="login-page-content">
				<div
					className="login-page-panel login-page-panel-hero"
					style={
						desktopHeroHeight ? { height: `${desktopHeroHeight}px` } : undefined
					}
				>
					<LoginHero />
				</div>
				<div className="login-page-panel login-page-panel-form">
					<LoginForm panelRef={formCardRef} />
				</div>
			</section>
		</main>
	);
}
