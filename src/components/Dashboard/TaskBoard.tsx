"use client";

import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { CircleDashed, CircleCheckBig, Clock3, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TaskTable } from "@/components/Dashboard/TaskTable";
import { createTaskAction } from "@/services/task.actions";
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
	canCreateTask?: boolean;
	projects?: ProjectRecord[];
	users?: UserProfile[];
	allowAssignmentEdit?: boolean;
	allowTaskEdit?: boolean;
};

const normalizeStatus = (status?: string | null): TaskStatusValue => {
	if (status === "InProgress" || status === "Completed") return status;
	return "Todo";
};

const isOverdue = (task: TaskRecord) => normalizeStatus(task.status) !== "Completed" && new Date(task.dueDate).getTime() < Date.now();

export function TaskBoard({
	tasks,
	title,
	description,
	roleLabel,
	returnTo,
	statusEditable = false,
	canCreateTask = false,
	projects,
	allowAssignmentEdit = false,
	allowTaskEdit = false,
}: TaskBoardProps) {
	const stats = {
		total: tasks.length,
		todo: tasks.filter(task => normalizeStatus(task.status) === "Todo").length,
		inProgress: tasks.filter(task => normalizeStatus(task.status) === "InProgress").length,
		completed: tasks.filter(task => normalizeStatus(task.status) === "Completed").length,
		overdue: tasks.filter(isOverdue).length,
	};

	return (
		<>
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
					{canCreateTask ? <NewTaskButton projects={projects} /> : null}
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[
					{ label: "Total", value: stats.total, icon: CircleDashed, tone: "from-purple-500 to-fuchsia-500" },
					{ label: "In progress", value: stats.inProgress, icon: Clock3, tone: "from-sky-500 to-blue-500" },
					{ label: "Completed", value: stats.completed, icon: CircleCheckBig, tone: "from-emerald-500 to-teal-500" },
					{ label: "Overdue", value: stats.overdue, icon: TriangleAlert, tone: "from-rose-500 to-red-500" },
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
				<CardContent className="p-4 sm:p-6">
					<TaskTable
						tasks={tasks}
						returnTo={returnTo}
						statusEditable={statusEditable}
						allowAssignmentEdit={allowAssignmentEdit}
						allowTaskEdit={allowTaskEdit}
					/>
				</CardContent>
			</Card>
		</section>
		</>
	);
}

function NewTaskButton({ projects }: { projects?: ProjectRecord[] }) {
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
								<Button type="submit" disabled={isPending} className="rounded-xl bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-lg px-4 py-2">{isPending ? "Creating..." : "Create task"}</Button>
								<Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
							</div>
					</form>
				</div>
			) : null}
		</div>
	);
}