"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type NotificationsToastProps = {
	unreadCount: number;
};

export default function NotificationsToast({ unreadCount }: NotificationsToastProps) {
	useEffect(() => {
		if (unreadCount > 0) {
			toast.info(`You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`);
		}
	}, [unreadCount]);

	return null;
}
