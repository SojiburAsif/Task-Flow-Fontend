import { getProjectDetailsHref, getTaskDetailsHref } from "@/lib/dashboard-links";
import type { NotificationRecord } from "@/types/notification";

export const getNotificationHref = (notification: NotificationRecord, returnTo?: string) => {
	if (notification.task?.id) {
		return getTaskDetailsHref(notification.task.id, returnTo);
	}

	if (notification.project?.id) {
		return getProjectDetailsHref(notification.project.id, returnTo);
	}

	return returnTo && returnTo.startsWith("/dashboard") ? returnTo : "/dashboard/notifications";
};
