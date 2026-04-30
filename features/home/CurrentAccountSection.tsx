"use client";

import { ShieldCheck, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	Section,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components";
import { useCurrentAccountQuery } from "@/features/identity/account/queries";

export function CurrentAccountSection() {
	const { t } = useTranslation();
	const { data, error, isError, isLoading, refetch } = useCurrentAccountQuery();

	return (
		<Section
			isLoading={isLoading}
			loadingLabel={t("home.currentAccount.loading")}
		>
			<SectionHeader>
				<div className="space-y-2">
					<Badge tone="brand">{t("home.currentAccount.badge")}</Badge>
					<SectionTitle>{t("home.currentAccount.title")}</SectionTitle>
					<SectionDescription>
						{t("home.currentAccount.description")}
					</SectionDescription>
				</div>
			</SectionHeader>

			<SectionContent>
				{isError ? (
					<div className="flex flex-col items-start gap-4 rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] p-4">
						<div className="space-y-1">
							<p className="ty-sm-bold">{t("home.currentAccount.error.title")}</p>
							<p className="ty-helper">
								{error instanceof Error
									? error.message
									: t("home.currentAccount.error.description")}
							</p>
						</div>
						<Button
							usage="secondary"
							variant="ghost"
							onClick={() => void refetch()}
						>
							{t("home.currentAccount.error.retry")}
						</Button>
					</div>
				) : data ? (
					<div className="grid gap-4 lg:grid-cols-3">
						<Card className="p-4">
							<CardHeader className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="surface-1 rounded-[var(--twc-radius-lg)] p-2">
										<Icon
											icon={UserRound}
											className="h-4 w-4 text-[color:var(--color-brand)]"
										/>
									</div>
									<div>
										<CardTitle>{t("home.currentAccount.fields.email")}</CardTitle>
										<CardDescription>{data.email}</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>

						<Card className="p-4">
							<CardHeader className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="surface-1 rounded-[var(--twc-radius-lg)] p-2">
										<Icon
											icon={ShieldCheck}
											className="h-4 w-4 text-[color:var(--color-brand)]"
										/>
									</div>
									<div>
										<CardTitle>{t("home.currentAccount.fields.type")}</CardTitle>
										<CardDescription>
											{data.accountTypeFormatted}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>

						<Card className="p-4">
							<CardHeader className="space-y-3">
								<div className="flex items-center justify-between gap-3">
									<div>
										<CardTitle>{t("home.currentAccount.fields.status")}</CardTitle>
										<CardDescription>
											{data.auditInfo.updatedAtFormatted}
										</CardDescription>
									</div>
									<Badge tone={data.active ? "success" : "warning"}>
										{data.active
											? t("home.currentAccount.values.active")
											: t("home.currentAccount.values.inactive")}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<p className="ty-helper">
									{t("home.currentAccount.lastUpdated", {
										value: data.auditInfo.updatedAtFormatted,
									})}
								</p>
							</CardContent>
						</Card>
					</div>
				) : null}
			</SectionContent>
		</Section>
	);
}
