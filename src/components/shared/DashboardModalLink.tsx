"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type DashboardModalTarget = {
	type: "project" | "task";
	id: string;
};

type DashboardModalLinkProps = {
	href: string;
	target?: "_self" | "_blank";
	rel?: string;
	modalTarget?: DashboardModalTarget | null;
	onClick?: () => void;
	className?: string;
	children: ReactNode;
};

const STORAGE_KEY = "dashboard:modal-target";

export const queueDashboardModalTarget = (target: DashboardModalTarget) => {
	if (typeof window === "undefined") return;
	window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(target));
};

export const readDashboardModalTarget = (): DashboardModalTarget | null => {
	if (typeof window === "undefined") return null;
	const raw = window.sessionStorage.getItem(STORAGE_KEY);
	if (!raw) return null;

	try {
		const parsed = JSON.parse(raw) as DashboardModalTarget;
		if ((parsed.type === "project" || parsed.type === "task") && typeof parsed.id === "string" && parsed.id.trim()) {
			return parsed;
		}
	} catch {
		return null;
	}

	return null;
};

export const clearDashboardModalTarget = () => {
	if (typeof window === "undefined") return;
	window.sessionStorage.removeItem(STORAGE_KEY);
};

export default function DashboardModalLink({ href, target = "_self", rel, modalTarget, onClick, className, children }: DashboardModalLinkProps) {
	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (modalTarget && target !== "_blank") {
			queueDashboardModalTarget(modalTarget);
		}

		onClick?.();
	};

	return (
		<Link href={href} target={target} rel={rel} className={className} onClick={handleClick}>
			{children}
		</Link>
	);
}