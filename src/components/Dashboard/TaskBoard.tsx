"use client";

import React, { type ComponentType, useEffect, useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, CircleDashed, CircleCheckBig, Clock3, Paperclip, TriangleAlert, Users2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTaskStatusAction, createTaskAction } from "@/services/task.actions";
import type { TaskRecord, TaskStatusValue } from "@/services/task.service";
import type { ProjectRecord } from "@/services/project.service";
import type { UserProfile } from "@/services/user.service";



type TaskBoardProps = {
	tasks: TaskRecord[];
	title: string;
	description: string;
	roleLabel: string;
	returnTo: string;
	statusEditable?: boolean;
	projects?: ProjectRecord[];
	users?: UserProfile[];
};

const statusLabel: Record<TaskStatusValue, string> = {
	Todo: "To Do",
	InProgress: "In Progress",
	Completed: "Completed",
};

const normalizeStatus = (status?: string | null): TaskStatusValue => {
	if (status === "InProgress" || status === "Completed") return status;
	return "Todo";
};

const allowedStatuses = (status: TaskStatusValue): TaskStatusValue[] => {
	switch (status) {
		case "Todo":
			return ["Todo", "InProgress"];
		case "InProgress":
			return ["InProgress", "Completed"];
		default:
			return ["Completed"];
	}
};

const formatDate = (value?: string | null) => {
	if (!value) return "No deadline";
	return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const isOverdue = (task: TaskRecord) => normalizeStatus(task.status) !== "Completed" && new Date(task.dueDate).getTime() < Date.now();

const getStatusStyles = (status: TaskStatusValue) => {
	switch (status) {
		case "Completed":
			return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
		case "InProgress":
			return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300";
		default:
			return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
	}
};

const getPriorityStyles = (priority?: string | null) => {
	switch ((priority || "Medium").toLowerCase()) {
		case "high":
			return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300";
		case "low":
			return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
		default:
			return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300";
	}
};

export function TaskBoard({ tasks, title, description, roleLabel, returnTo, statusEditable = false, projects, users }: TaskBoardProps) {
	const stats = {
		total: tasks.length,
		todo: tasks.filter(task => normalizeStatus(task.status) === "Todo").length,
		inProgress: tasks.filter(task => normalizeStatus(task.status) === "InProgress").length,
		completed: tasks.filter(task => normalizeStatus(task.status) === "Completed").length,
		overdue: tasks.filter(isOverdue).length,
	};

	function TaskItem({ task }: { task: TaskRecord }) {
		const currentStatus = normalizeStatus(task.status);
		const overdue = isOverdue(task);
		const attachments = task.attachments?.length ?? 0;

		const [updateState, updateAction, updatePending] = useActionState(updateTaskStatusAction, { success: false, message: "" });

		useEffect(() => {
			if (!updateState) return;
			if (updateState.success) {
				toast.success(updateState.message || "Task updated");
			} else if (updateState.message) {
				toast.error(updateState.message);
			}
		}, [updateState]);

		return (
			<article className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div className="space-y-2">
						<div className="flex flex-wrap items-center gap-2">
							<Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${getStatusStyles(currentStatus)}`}>
								{statusLabel[currentStatus]}
							</Badge>
							<Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${getPriorityStyles(task.priority)}`}>
								{(task.priority || "Medium")} Priority
							</Badge>
							{overdue ? (
								<Badge className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
									Overdue
								</Badge>
							) : null}
						</div>
						<h2 className="text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-xl">{task.title}</h2>
						<p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{task.description || "No description provided for this task."}</p>
					</div>
					<Link href={`/dashboard/projects/${task.project.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:text-purple-500 dark:text-purple-300">
						Open project <ArrowUpRight className="h-4 w-4" />
					</Link>
				</div>

				<div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="space-y-3 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
						<div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
							<span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-purple-500" />{formatDate(task.dueDate)}</span>
							<span className="inline-flex items-center gap-2"><Paperclip className="h-4 w-4 text-purple-500" />{attachments} attachment{attachments === 1 ? "" : "s"}</span>
							<span className="inline-flex items-center gap-2"><Users2 className="h-4 w-4 text-purple-500" />{task.assignedTo?.name || "Unassigned"}</span>
						</div>
						<div className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
							Project: <span className="text-zinc-950 dark:text-zinc-100">{task.project.name}</span>
						</div>
					</div>

					{statusEditable ? (
						<form action={updateAction} className="space-y-3 rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800">
							<input type="hidden" name="id" value={task.id} />
							<input type="hidden" name="returnTo" value={returnTo} />
							<div className="space-y-2">
								<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Update status</label>
								<select name="status" defaultValue={currentStatus} className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950">
									{allowedStatuses(currentStatus).map(item => (
										<option key={item} value={item}>{statusLabel[item]}</option>
									))}
								</select>
								<div>
									<label className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Assign to</label>
									{task.project?.members && task.project.members.length > 0 ? (
										<select name="assignedToId" defaultValue={task.assignedTo?.id ?? ""} className="mt-1 h-10 w-full rounded-xl border px-3">
											<option value="">Unassigned</option>
											{task.project.members.map(m => (
												<option key={m.id} value={m.id}>{m.name || m.id}</option>
											))}
										</select>
									) : (
										<select name="assignedToId" disabled className="mt-1 h-10 w-full rounded-xl border px-3 bg-zinc-50/60 text-zinc-500">
											<option value="">No members in project</option>
										</select>
									)}
								</div>
							</div>
							<Button className="w-full rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-700" disabled={updatePending}>{updatePending ? 'Saving...' : 'Save update'}</Button>
						</form>
					) : (
						<div className="rounded-2xl border border-zinc-100 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">Status updates are locked in this view.</div>
					)}
				</div>
			</article>
		)
	}

	return (
		<section className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div className="absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-purple-400/80 to-transparent" />

			<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-500 dark:text-purple-400">{roleLabel}</p>
					<h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">{title}</h1>
					<p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
						{stats.total} task{stats.total === 1 ? "" : "s"} in view
					</div>
					{statusEditable ? (
						<NewTaskButton projects={projects} users={users} />
					) : null}
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[
					{ label: "Total", value: stats.total, icon: CircleDashed as ComponentType<{ className?: string }>, tone: "from-purple-500 to-fuchsia-500" },
					{ label: "In progress", value: stats.inProgress, icon: Clock3 as ComponentType<{ className?: string }>, tone: "from-sky-500 to-blue-500" },
					{ label: "Completed", value: stats.completed, icon: CircleCheckBig as ComponentType<{ className?: string }>, tone: "from-emerald-500 to-teal-500" },
					{ label: "Overdue", value: stats.overdue, icon: TriangleAlert as ComponentType<{ className?: string }>, tone: "from-rose-500 to-red-500" },
				].map(item => (
					<Card key={item.label} className="border border-zinc-200/80 bg-white/90 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
						<CardContent className="flex items-center gap-3 p-4">
							<div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${item.tone} text-white shadow-lg shadow-purple-500/20`}>
								<item.icon className="h-5 w-5" />
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">{item.label}</p>
								<p className="text-2xl font-black text-zinc-950 dark:text-zinc-50">{item.value}</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card className="mt-6 border border-zinc-200/80 bg-white/90 shadow-[0_24px_80px_rgba(91,33,182,0.10)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
				<CardHeader className="border-b border-zinc-200/70 dark:border-zinc-800">
					<CardTitle className="flex items-center gap-2 text-xl text-zinc-950 dark:text-zinc-50">
						<CircleDashed className="h-5 w-5 text-purple-500" />
						Task pipeline
					</CardTitle>
					<CardDescription className="text-zinc-600 dark:text-zinc-400">Track status, deadlines, attachments, and assignment without leaving the dashboard.</CardDescription>
				</CardHeader>
				<CardContent className="p-4 sm:p-6">
					{tasks.length === 0 ? (
						<div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/40 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950/20">
							<div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
								<CircleDashed size={26} className="text-zinc-400 dark:text-zinc-500" />
							</div>
							<h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No tasks available</h3>
							<p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
								When tasks are assigned here, they will appear with deadline, status, priority, and project context.
							</p>
						</div>
					) : (
						<div className="grid gap-4 xl:grid-cols-2">
							{tasks.map(task => (
								<TaskItem key={task.id} task={task} />
							))}
						</div>
					)}
				</CardContent>
			</Card>
    	</section>
	);
}

function NewTaskButton({ projects, users }: { projects?: ProjectRecord[]; users?: UserProfile[] }) {
	const [open, setOpen] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects && projects.length > 0 ? projects[0].id : null);
	const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

	const [actionState, formAction, isPending] = useActionState(createTaskAction, { success: false, message: "" });

	useEffect(() => {
		if (!actionState) return;

		if (actionState.success) {
			toast.success(actionState.message || "Task created");
			// defer state updates to avoid synchronous setState-in-effect warnings
			const raf = window.requestAnimationFrame(() => {
				setOpen(false);
				setSelectedAssignee(null);
			});
			return () => window.cancelAnimationFrame(raf);
		} else if (actionState.message) {
			toast.error(actionState.message);
		}
	}, [actionState]);

	return (
		<div>
			<Button onClick={() => setOpen(o => !o)} className="rounded-xl bg-green-600 text-white hover:bg-green-700">{open ? "Close" : "New Task"}</Button>
			{open ? (
				<div className="mt-3 rounded-2xl border border-zinc-200/60 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
					<form action={formAction} className="space-y-4">
						<div className="grid gap-3 sm:grid-cols-2">
							<input name="title" placeholder="Task title" className="h-11 rounded-xl border border-zinc-200 px-3 placeholder:text-zinc-400" required />
							{projects && projects.length > 0 ? (
								<select name="projectId" value={selectedProjectId ?? ""} onChange={(e) => { setSelectedProjectId(e.target.value || null); setSelectedAssignee(null); }} className="h-11 rounded-xl border border-zinc-200 px-3" required>
									<option value="">Select project</option>
									{projects.map(p => (
										<option key={p.id} value={p.id}>{p.name}</option>
									))}
								</select>
							) : (
								<input name="projectId" placeholder="Project ID" className="h-11 rounded-xl border border-zinc-200 px-3 placeholder:text-zinc-400" required />
							)}
						</div>
						<textarea name="description" placeholder="Short description" className="w-full rounded-xl border border-zinc-200 px-3 py-3 placeholder:text-zinc-400" />
								<div className="grid gap-3 sm:grid-cols-3">
									<input name="dueDate" type="date" className="h-11 rounded-xl border border-zinc-200 px-3" required />
									<select name="priority" className="h-11 rounded-xl border border-zinc-200 px-3">
										<option value="Medium">Medium</option>
										<option value="High">High</option>
										<option value="Low">Low</option>
									</select>
									{/* show only members of selected project in create form */}
									{projects && selectedProjectId ? (
										(() => {
											const members = projects.find(p => p.id === selectedProjectId)?.members ?? [];
											if (members.length > 0) {
												return (
													<select name="assignedToId" value={selectedAssignee ?? ""} onChange={(e) => setSelectedAssignee(e.target.value || null)} className="h-11 rounded-xl border border-zinc-200 px-3" >
														<option value="">Unassigned</option>
														{members.map(m => (
															<option key={m.id} value={m.id}>{m.name || m.id}</option>
														))}
													</select>
												);
											}

											return (
												<select name="assignedToId" disabled className="h-11 rounded-xl border border-zinc-200 px-3 bg-zinc-50/60 text-zinc-500">
													<option value="">No members in selected project</option>
												</select>
											);
										})()
									) : (
										<select name="assignedToId" disabled className="h-11 rounded-xl border border-zinc-200 px-3 bg-zinc-50/60 text-zinc-500">
											<option value="">Select a project to choose assignee</option>
										</select>
									)}
									{/* ensure selected assignee is submitted even when chosen via member list */}
									<input type="hidden" name="assignedToId" value={selectedAssignee ?? ""} />
								</div>

								{/* attachments */}
								<div>
									<label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Attachments</label>
									<input name="attachments" type="file" multiple className="mt-2 w-full" />
								</div>

								{/* members side list */}
								{projects && projects.length > 0 ? (
									<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
										<div />
										<div className="rounded-xl border border-zinc-100 p-3 dark:border-zinc-800">
											<div className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Project members</div>
											<div className="flex max-h-44 flex-col gap-2 overflow-auto">
												{(projects.find(p => p.id === selectedProjectId)?.members ?? []).map(member => (
													<button key={member.id} type="button" onClick={() => setSelectedAssignee(member.id)} className={`text-left rounded-md px-3 py-2 transition ${selectedAssignee === member.id ? 'bg-purple-600 text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
														{member.name || member.id}
														<div className="text-xs text-zinc-500 dark:text-zinc-400">{member.id}</div>
													</button>
												))}
											</div>
										</div>
									</div>
								) : null}
							<div className="flex items-center gap-3">
								<Button type="submit" className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg px-4 py-2">Create task</Button>
								<Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
							</div>
					</form>
				</div>
			) : null}
		</div>
	);
}