import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, FileText, Paperclip, Tag, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/currentUser";
import { getTaskById } from "@/services/task.service";

type Props = {
	params: Promise<{ id: string }>;
	searchParams?: Promise<{ returnTo?: string | string[] }>;
};

const statusLabel = {
	Todo: "To Do",
	InProgress: "In Progress",
	Completed: "Completed",
};

const normalizeStatus = (status?: string | null) => {
	if (status === "InProgress" || status === "Completed") return status;
	return "Todo";
};

const getStatusStyles = (status: string) => {
	switch (status) {
		case "Completed":
			return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
		case "InProgress":
			return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300";
		default:
			return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
	}
};

const formatDate = (value?: string | null) => {
	if (!value) return "No deadline";
	return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getFileName = (url: string) => {
	try {
		const pathname = new URL(url).pathname;
		const lastSegment = pathname.split("/").filter(Boolean).pop();
		return lastSegment ? decodeURIComponent(lastSegment) : url;
	} catch {
		return url;
	}
};

export default async function TaskDetailsPage({ params, searchParams }: Props) {
	const resolvedParams = await params;
	const resolvedSearchParams = searchParams ? await searchParams : undefined;
	const [task, user] = await Promise.all([getTaskById(resolvedParams.id), getCurrentUser()]);

	if (!task) {
		notFound();
	}

	const returnTo = typeof resolvedSearchParams?.returnTo === "string" && resolvedSearchParams.returnTo.startsWith("/dashboard")
		? resolvedSearchParams.returnTo
		: "/dashboard/tasks";
	const currentStatus = normalizeStatus(task.status);
	const canEdit = user?.role === "Admin" || user?.role === "ProjectManager" || (user?.role === "TeamMember" && task.assignedTo?.id === user.id);

	return (
		<div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="space-y-3">
					<Link href={returnTo} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-300">
						<ArrowLeft size={16} />
						Back to task list
					</Link>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">{task.title}</h1>
						<Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${getStatusStyles(currentStatus)}`}>
							{statusLabel[currentStatus as keyof typeof statusLabel]}
						</Badge>
					</div>
					<p className="max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">{task.description || "No description provided for this task."}</p>
				</div>
				<div className="flex flex-wrap gap-3">
					{canEdit ? (
						<Link href={`/dashboard/tasks/${task.id}/edit?returnTo=${encodeURIComponent(returnTo)}`}>
							<Button className="gap-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
								Edit task
								<ArrowUpRight size={16} />
							</Button>
						</Link>
					) : null}
					<Link href={`/dashboard/projects?view=${task.project.id}`}>
						<Button variant="outline" className="gap-2 rounded-xl">
							Open project
							<ArrowUpRight size={16} />
						</Button>
					</Link>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
					<CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
						<CardTitle className="flex items-center gap-2 text-xl text-zinc-950 dark:text-zinc-50">
							<FileText className="h-5 w-5 text-purple-500" />
							Task overview
						</CardTitle>
						<CardDescription className="text-zinc-600 dark:text-zinc-400">Task ID, assignment, deadline, and project context all in one place.</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 p-4 sm:grid-cols-2">
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Task ID</p>
							<p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{task.id}</p>
						</div>
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Project</p>
							<p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{task.project.name}</p>
							<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{task.project.id}</p>
						</div>
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Deadline</p>
							<p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
								<CalendarDays className="h-4 w-4 text-purple-500" />
								{formatDate(task.dueDate)}
							</p>
						</div>
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Assignee</p>
							<p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
								<Users2 className="h-4 w-4 text-purple-500" />
								{task.assignedTo?.name || "Unassigned"}
							</p>
							<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{task.assignedTo?.id || "No assignee selected"}</p>
						</div>
					</CardContent>
				</Card>

				<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
					<CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
						<CardTitle className="flex items-center gap-2 text-xl text-zinc-950 dark:text-zinc-50">
							<Tag className="h-5 w-5 text-purple-500" />
							Project and attachments
						</CardTitle>
						<CardDescription className="text-zinc-600 dark:text-zinc-400">Quick access to the project and any uploaded files.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 p-4">
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Project link</p>
							<Link href={`/dashboard/projects?view=${task.project.id}`} className="mt-2 inline-flex items-center gap-2 font-semibold text-purple-600 transition hover:text-purple-500 dark:text-purple-300">
								Open project details
								<ArrowUpRight className="h-4 w-4" />
							</Link>
						</div>

						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<div className="flex items-center justify-between gap-3">
								<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Attachments</p>
								<Badge className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
									{task.attachments?.length ?? 0} file{(task.attachments?.length ?? 0) === 1 ? "" : "s"}
								</Badge>
							</div>
							<div className="mt-3 space-y-2">
								{task.attachments && task.attachments.length > 0 ? task.attachments.map(url => (
									<a key={url} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">
										<span className="truncate">{getFileName(url)}</span>
										<span className="text-xs text-zinc-500">Open</span>
									</a>
								)) : (
									<div className="rounded-xl border border-dashed border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
										No attachments uploaded.
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
