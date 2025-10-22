"use client";

import Link from "next/link";

import { ArrowRight, BookOpen, FileText, Gauge, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Page() {
	const { t } = useTranslation();

	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6">
			<section className="surface-2 br-squircle shadow-normal border-default-2 border p-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="ty-title">
							{t("home.welcome", { defaultValue: "Welcome back" })}
						</h1>
						<p className="ty-helper mt-1">
							{t("home.subtitle", {
								defaultValue:
									"Manage counterpart hours and reports from one place.",
							})}
						</p>
					</div>
					<Sparkles className="text-brand-700 h-6 w-6" />
				</div>

				<div className="mt-6 flex flex-wrap gap-3">
					<Link
						href="/components"
						className="bg-brand-500 hover:bg-brand-600 br-squircle ty-sm-semibold px-4 py-2 text-neutral-50 no-underline"
					>
						{t("home.primaryCta", { defaultValue: "Get started" })}
					</Link>
					<Link
						href="/theme"
						className="surface-2 hover:surface-3 br-squircle ty-sm-semibold border px-4 py-2 no-underline"
					>
						{t("home.customizeTheme", { defaultValue: "Customize theme" })}
					</Link>
					<Link
						href="/docs"
						className="surface-2 hover:surface-3 br-squircle ty-sm-semibold border px-4 py-2 no-underline"
					>
						{t("home.viewDocs", { defaultValue: "View docs" })}
					</Link>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				{[
					{
						href: "/hours",
						title: t("home.cards.hours.title", {
							defaultValue: "Counterpart Hours",
						}),
						desc: t("home.cards.hours.desc", {
							defaultValue: "Review and approve student hours.",
						}),
						Icon: Gauge,
					},
					{
						href: "/reports",
						title: t("home.cards.reports.title", { defaultValue: "Reports" }),
						desc: t("home.cards.reports.desc", {
							defaultValue: "Generate monthly and ad-hoc reports.",
						}),
						Icon: FileText,
					},
					{
						href: "/components",
						title: t("home.cards.ui.title", { defaultValue: "UI Components" }),
						desc: t("home.cards.ui.desc", {
							defaultValue: "Browse ready-to-use building blocks.",
						}),
						Icon: BookOpen,
					},
				].map(({ href, title, desc, Icon }) => (
					<Link
						key={href}
						href={href}
						className="surface-2 hover:surface-3 br-squircle shadow-weak border-default-2 border p-4 no-underline"
					>
						<div className="flex items-start gap-3">
							<Icon className="text-brand-700 h-5 w-5" />
							<div className="min-w-0">
								<h3 className="ty-body-semibold truncate">{title}</h3>
								<p className="ty-sm mt-1">{desc}</p>
							</div>
							<ArrowRight className="ty-muted ml-auto h-4 w-4" />
						</div>
					</Link>
				))}
			</section>

			<section className="surface-2 br-squircle shadow-weak border-default-2 border p-4">
				<h3 className="ty-body-semibold">
					{t("home.recent.title", { defaultValue: "Recent activity" })}
				</h3>
				<p className="ty-sm mt-2">
					{t("home.recent.empty", { defaultValue: "No recent items yet." })}
				</p>
			</section>
		</main>
	);
}
