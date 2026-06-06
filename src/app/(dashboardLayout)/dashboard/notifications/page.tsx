import { getCurrentUser } from "@/lib/currentUser";
import { getRoleDashboardHref } from "@/lib/dashboard-links";
import { Bell, CheckCheck, Clock3, FolderGit2, ListTodo, UserCircle2 } from "lucide-react";

import NotificationsToast from "@/components/Dashboard/NotificationsToast";
import DashboardModalLink from "@/components/shared/DashboardModalLink";
import { getMyNotifications } from "@/services/notification.service";
import type { NotificationRecord } from "@/types/notification";

const formatRelativeTime = (value: string) => {
	const createdAt = new Date(value).getTime();
	const diff = Date.now() - createdAt;
	const minutes = Math.max(1, Math.floor(diff / 60000));
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
};

const getNotificationIcon = (notification: NotificationRecord) => {
	if (notification.task?.id) return ListTodo;
	if (notification.project?.id) return FolderGit2;
	if (notification.actor?.id) return UserCircle2;
	return Bell;
};

export default async function NotificationsPage() {
	const notifications = (await getMyNotifications({ limit: 50 })) ?? [];
	const user = await getCurrentUser();
	const unreadCount = notifications.filter(notification => !notification.isRead).length;

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<NotificationsToast unreadCount={unreadCount} />
			<div className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
				<div className="space-y-2">
					<p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-600 dark:text-purple-400">Dashboard Notifications</p>
					<h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">Your notification inbox</h1>
					<p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">Review project and task activity from the backend notification feed.</p>
				</div>
				<div className="inline-flex items-center gap-2 border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300">
					<CheckCheck size={14} /> {unreadCount} unread
				</div>
			</div>

			{notifications.length === 0 ? (
				<div className="flex flex-col items-center justify-center border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950">
					<Bell className="mb-3 h-10 w-10 text-zinc-400" />
					<h2 className="text-lg font-bold text-zinc-900 dark:text-white">No notifications yet</h2>
					<p className="mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">When project or task events happen, they will appear here.</p>
				</div>
			) : (
				<div className="space-y-3">
					{notifications.map((notification) => {
						const Icon = getNotificationIcon(notification);
						const modalTarget = notification.task?.id
							? { type: "task" as const, id: notification.task.id }
							: notification.project?.id
								? { type: "project" as const, id: notification.project.id }
								: null;
						return (
							<DashboardModalLink
								key={notification.id}
								href={getRoleDashboardHref(user?.role, notification.task?.id ? "task" : "project")}
								modalTarget={modalTarget}
								className={`block border p-5 transition hover:border-purple-300 hover:bg-purple-50/40 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/5 ${notification.isRead ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" : "border-purple-200 bg-purple-50/30 dark:border-purple-500/30 dark:bg-purple-500/5"}`}
							>
								<div className="flex items-start gap-4">
									<div className={`flex h-11 w-11 shrink-0 items-center justify-center border ${notification.isRead ? "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300" : "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300"}`}>
										<Icon size={18} />
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<h2 className="text-base font-bold text-zinc-950 dark:text-white">{notification.title}</h2>
												<p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{notification.message}</p>
											</div>
											<div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
												<Clock3 size={12} /> {formatRelativeTime(notification.createdAt)}
											</div>
										</div>

										<div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wider">
											<span className="border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">{notification.type}</span>
											{notification.project?.name ? <span className="border border-purple-200 bg-purple-50 px-2 py-1 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300">Project: {notification.project.name}</span> : null}
											{notification.task?.title ? <span className="border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">Task: {notification.task.title}</span> : null}
											{notification.actor?.name ? <span className="border border-zinc-200 bg-white px-2 py-1 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">By {notification.actor.name}</span> : null}
											{notification.isRead ? null : <span className="border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">Unread</span>}
										</div>
									</div>
								</div>
							</DashboardModalLink>
						);
					})}
				</div>
			)}
		</div>
	);
}
